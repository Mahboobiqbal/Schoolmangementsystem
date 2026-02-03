const Module = require("../models/moduleSchema.js");
const Faculty = require("../models/facultySchema.js");
const Learner = require("../models/learnerSchema.js");

const moduleCreate = async (req, res) => {
  try {
    const modules = req.body.modules.map((module) => ({
      moduleName: module.moduleName,
      moduleCode: module.moduleCode,
      credits: module.credits || 3,
      sessions: module.sessions || 45,
      moduleType: module.moduleType || "Core",
      semester: module.semester,
      description: module.description,
      prerequisites: module.prerequisites,
      learningOutcomes: module.learningOutcomes,
      assessmentCriteria: module.assessmentCriteria,
    }));

    const existingModuleByCode = await Module.findOne({
      moduleCode: modules[0].moduleCode,
      institution: req.body.adminID,
    });

    if (existingModuleByCode) {
      res.send({
        message: "Sorry this module code must be unique as it already exists",
      });
    } else {
      const newModules = modules.map((module) => ({
        ...module,
        programName: req.body.programName,
        institution: req.body.adminID,
      }));

      const result = await Module.insertMany(newModules);
      res.send(result);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const allModules = async (req, res) => {
  try {
    let modules = await Module.find({ institution: req.params.id })
      .populate("programName", "programName programCode")
      .populate("faculty", "name designation");
    if (modules.length > 0) {
      res.send(modules);
    } else {
      res.send({ message: "No modules found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const programModules = async (req, res) => {
  try {
    let modules = await Module.find({ programName: req.params.id }).populate(
      "faculty",
      "name designation",
    );
    if (modules.length > 0) {
      res.send(modules);
    } else {
      res.send({ message: "No modules found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const semesterModules = async (req, res) => {
  try {
    let modules = await Module.find({
      programName: req.params.programId,
      semester: req.params.semester,
    }).populate("faculty", "name designation");
    if (modules.length > 0) {
      res.send(modules);
    } else {
      res.send({ message: "No modules found for this semester" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const freeModuleList = async (req, res) => {
  try {
    const programId = req.params.id;
    console.log("Fetching free modules for program:", programId);

    if (!programId || programId === "null" || programId === "undefined") {
      console.error("Invalid program ID:", programId);
      return res.status(400).json({ message: "Invalid program ID" });
    }

    // Now get only unassigned modules
    let modules = await Module.find({
      programName: programId,
      $or: [{ faculty: { $exists: false } }, { faculty: null }],
    })
      .populate("programName", "programName programCode")
      .lean();

    console.log("Found unassigned modules:", modules.length);
    if (modules.length > 0) {
      res.send(modules);
    } else {
      res.send({ message: "No unassigned modules found" });
    }
  } catch (err) {
    console.error("Error fetching free modules:", err);
    res
      .status(500)
      .json({ message: "Error fetching modules", error: err.message });
  }
};

const getModuleDetail = async (req, res) => {
  try {
    const moduleId = req.params.id;
    console.log("Fetching module details for ID:", moduleId);

    if (!moduleId || moduleId === "null" || moduleId === "undefined") {
      console.error("Invalid module ID:", moduleId);
      return res.status(400).json({ message: "Invalid module ID" });
    }

    let module = await Module.findById(moduleId)
      .populate("programName", "programName programCode")
      .populate("institution", "institutionName")
      .populate("faculty", "name email designation")
      .populate("prerequisites", "moduleName moduleCode");

    console.log("Module found:", module ? "Yes" : "No");
    if (module) {
      res.send(module);
    } else {
      res.status(404).json({ message: "No module found" });
    }
  } catch (err) {
    console.error("Error fetching module detail:", err);
    res
      .status(500)
      .json({ message: "Error fetching module", error: err.message });
  }
};

const updateModule = async (req, res) => {
  try {
    const updatedModule = await Module.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
    );
    res.send(updatedModule);
  } catch (error) {
    res.status(500).json(error);
  }
};

const updateModuleSyllabus = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);

    if (!module) {
      return res.send({ message: "Module not found" });
    }

    module.syllabus = req.body.syllabus;
    const result = await module.save();
    res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

const updateModuleSchedule = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);

    if (!module) {
      return res.send({ message: "Module not found" });
    }

    module.schedule = req.body.schedule;
    const result = await module.save();
    res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

const assignFacultyToModule = async (req, res) => {
  const { facultyId } = req.body;

  try {
    const updatedModule = await Module.findByIdAndUpdate(
      req.params.id,
      { faculty: facultyId },
      { new: true },
    );

    // Also update faculty's assigned module
    await Faculty.findByIdAndUpdate(facultyId, {
      assignedModule: req.params.id,
    });

    res.send(updatedModule);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteModule = async (req, res) => {
  try {
    const deletedModule = await Module.findByIdAndDelete(req.params.id);

    // Update faculty who was teaching this module
    await Faculty.updateOne(
      { assignedModule: deletedModule._id },
      { $unset: { assignedModule: 1 } },
    );

    // Remove module from learners' results and participation
    await Learner.updateMany(
      {},
      {
        $pull: {
          assessmentResults: { moduleName: deletedModule._id },
          participation: { moduleName: deletedModule._id },
        },
      },
    );

    res.send(deletedModule);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteModules = async (req, res) => {
  try {
    const result = await Module.deleteMany({ institution: req.params.id });
    if (result.deletedCount === 0) {
      res.send({ message: "No modules found to delete" });
    } else {
      res.send(result);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteModulesByProgram = async (req, res) => {
  try {
    const result = await Module.deleteMany({ programName: req.params.id });
    if (result.deletedCount === 0) {
      res.send({ message: "No modules found to delete" });
    } else {
      res.send(result);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get modules by type (Core, Elective, etc.)
const getModulesByType = async (req, res) => {
  try {
    let modules = await Module.find({
      institution: req.params.id,
      moduleType: req.params.type,
    })
      .populate("programName", "programName")
      .populate("faculty", "name");
    if (modules.length > 0) {
      res.send(modules);
    } else {
      res.send({ message: "No modules found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// Get module enrollment count
const getModuleEnrollment = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id)
      .populate("programName", "programName")
      .populate("faculty", "name");

    if (!module) {
      return res.send({ message: "Module not found" });
    }

    // Count learners with participation records for this module
    const enrolledCount = await Learner.countDocuments({
      "participation.moduleName": req.params.id,
    });

    res.send({
      module: {
        name: module.moduleName,
        code: module.moduleCode,
        program: module.programName,
        faculty: module.faculty,
      },
      enrolledLearners: enrolledCount,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  moduleCreate,
  allModules,
  programModules,
  semesterModules,
  freeModuleList,
  getModuleDetail,
  updateModule,
  updateModuleSyllabus,
  updateModuleSchedule,
  assignFacultyToModule,
  deleteModule,
  deleteModules,
  deleteModulesByProgram,
  getModulesByType,
  getModuleEnrollment,
};
