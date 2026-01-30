const bcrypt = require("bcrypt");
const Faculty = require("../models/facultySchema.js");
const Module = require("../models/moduleSchema.js");

const facultyRegister = async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    institution,
    assignedModule,
    assignedProgram,
    designation,
    department,
    specialization,
    qualification,
  } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const faculty = new Faculty({
      name,
      email,
      password: hashedPass,
      role: role || "Faculty",
      institution,
      assignedModule,
      assignedProgram,
      designation: designation || "Instructor",
      department,
      specialization,
      qualification,
    });

    const existingFacultyByEmail = await Faculty.findOne({ email });

    if (existingFacultyByEmail) {
      res.send({ message: "Email already exists" });
    } else {
      let result = await faculty.save();
      if (assignedModule) {
        await Module.findByIdAndUpdate(assignedModule, {
          faculty: faculty._id,
        });
      }
      result.password = undefined;
      res.send(result);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const facultyLogIn = async (req, res) => {
  try {
    let faculty = await Faculty.findOne({ email: req.body.email });
    if (faculty) {
      const validated = await bcrypt.compare(
        req.body.password,
        faculty.password,
      );
      if (validated) {
        faculty = await faculty.populate(
          "assignedModule",
          "moduleName sessions credits",
        );
        faculty = await faculty.populate("institution", "institutionName");
        faculty = await faculty.populate("assignedProgram", "programName");
        faculty.password = undefined;
        res.send(faculty);
      } else {
        res.send({ message: "Invalid password" });
      }
    } else {
      res.send({ message: "Faculty not found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getFaculty = async (req, res) => {
  try {
    let facultyList = await Faculty.find({ institution: req.params.id })
      .populate("assignedModule", "moduleName moduleCode credits")
      .populate("assignedProgram", "programName programCode");
    if (facultyList.length > 0) {
      let modifiedFaculty = facultyList.map((faculty) => {
        return { ...faculty._doc, password: undefined };
      });
      res.send(modifiedFaculty);
    } else {
      res.send({ message: "No faculty found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getFacultyDetail = async (req, res) => {
  try {
    let faculty = await Faculty.findById(req.params.id)
      .populate("assignedModule", "moduleName sessions credits moduleCode")
      .populate("institution", "institutionName")
      .populate("assignedProgram", "programName programCode")
      .populate("courseAllocation.module", "moduleName moduleCode")
      .populate("courseAllocation.program", "programName");
    if (faculty) {
      faculty.password = undefined;
      res.send(faculty);
    } else {
      res.send({ message: "No faculty found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const updateFacultyModule = async (req, res) => {
  const { facultyId, assignedModule } = req.body;
  try {
    const updatedFaculty = await Faculty.findByIdAndUpdate(
      facultyId,
      { assignedModule },
      { new: true },
    );

    await Module.findByIdAndUpdate(assignedModule, {
      faculty: updatedFaculty._id,
    });

    res.send(updatedFaculty);
  } catch (error) {
    res.status(500).json(error);
  }
};

const allocateCourse = async (req, res) => {
  const { facultyId, module, program, semester, academicYear } = req.body;

  try {
    const faculty = await Faculty.findById(facultyId);

    if (!faculty) {
      return res.send({ message: "Faculty not found" });
    }

    // Check if already allocated
    const existingAllocation = faculty.courseAllocation.find(
      (a) =>
        a.module.toString() === module &&
        a.semester === semester &&
        a.academicYear === academicYear,
    );

    if (existingAllocation) {
      return res.send({
        message: "Course already allocated for this semester",
      });
    }

    faculty.courseAllocation.push({ module, program, semester, academicYear });

    // Update workload
    const moduleData = await Module.findById(module);
    if (moduleData) {
      faculty.workload.currentCredits += moduleData.credits;
    }

    await faculty.save();
    await Module.findByIdAndUpdate(module, { faculty: facultyId });

    res.send(faculty);
  } catch (error) {
    res.status(500).json(error);
  }
};

const removeCourseAllocation = async (req, res) => {
  const { facultyId, module, academicYear, semester } = req.body;

  try {
    const faculty = await Faculty.findById(facultyId);

    if (!faculty) {
      return res.send({ message: "Faculty not found" });
    }

    faculty.courseAllocation = faculty.courseAllocation.filter(
      (a) =>
        !(
          a.module.toString() === module &&
          a.academicYear === academicYear &&
          a.semester === semester
        ),
    );

    // Update workload
    const moduleData = await Module.findById(module);
    if (moduleData) {
      faculty.workload.currentCredits = Math.max(
        0,
        faculty.workload.currentCredits - moduleData.credits,
      );
    }

    await faculty.save();

    res.send(faculty);
  } catch (error) {
    res.status(500).json(error);
  }
};

const updateFacultySchedule = async (req, res) => {
  const { facultyId, schedule } = req.body;

  try {
    const updatedFaculty = await Faculty.findByIdAndUpdate(
      facultyId,
      { schedule },
      { new: true },
    );

    res.send(updatedFaculty);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteFaculty = async (req, res) => {
  try {
    const deletedFaculty = await Faculty.findByIdAndDelete(req.params.id);

    await Module.updateOne(
      { faculty: deletedFaculty._id },
      { $unset: { faculty: 1 } },
    );

    res.send(deletedFaculty);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteAllFaculty = async (req, res) => {
  try {
    const deletionResult = await Faculty.deleteMany({
      institution: req.params.id,
    });

    const deletedCount = deletionResult.deletedCount || 0;

    if (deletedCount === 0) {
      res.send({ message: "No faculty found to delete" });
      return;
    }

    res.send(deletionResult);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteFacultyByProgram = async (req, res) => {
  try {
    const deletionResult = await Faculty.deleteMany({
      assignedProgram: req.params.id,
    });

    const deletedCount = deletionResult.deletedCount || 0;

    if (deletedCount === 0) {
      res.send({ message: "No faculty found to delete" });
      return;
    }

    res.send(deletionResult);
  } catch (error) {
    res.status(500).json(error);
  }
};

const updateFaculty = async (req, res) => {
  try {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedFaculty = await Faculty.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
    );

    updatedFaculty.password = undefined;
    res.send(updatedFaculty);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get faculty workload summary
const getFacultyWorkload = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id)
      .populate("courseAllocation.module", "moduleName credits sessions")
      .populate("courseAllocation.program", "programName");

    if (!faculty) {
      return res.send({ message: "Faculty not found" });
    }

    const workloadSummary = {
      faculty: {
        name: faculty.name,
        designation: faculty.designation,
        department: faculty.department,
      },
      currentCredits: faculty.workload.currentCredits,
      maxCredits: faculty.workload.maxCredits,
      utilizationPercentage: (
        (faculty.workload.currentCredits / faculty.workload.maxCredits) *
        100
      ).toFixed(2),
      courseAllocation: faculty.courseAllocation,
      schedule: faculty.schedule,
    };

    res.send(workloadSummary);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  facultyRegister,
  facultyLogIn,
  getFaculty,
  getFacultyDetail,
  updateFacultyModule,
  allocateCourse,
  removeCourseAllocation,
  updateFacultySchedule,
  deleteFaculty,
  deleteAllFaculty,
  deleteFacultyByProgram,
  updateFaculty,
  getFacultyWorkload,
};
