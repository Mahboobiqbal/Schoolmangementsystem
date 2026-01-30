const Program = require("../models/programSchema.js");
const Learner = require("../models/learnerSchema.js");
const Module = require("../models/moduleSchema.js");
const Faculty = require("../models/facultySchema.js");

const programCreate = async (req, res) => {
  try {
    const program = new Program({
      programName: req.body.programName,
      programCode: req.body.programCode,
      programType: req.body.programType || "Undergraduate",
      department: req.body.department,
      duration: req.body.duration || 4,
      totalSemesters: req.body.totalSemesters || 8,
      totalCredits: req.body.totalCredits || 120,
      description: req.body.description,
      institution: req.body.adminID,
      eligibility: req.body.eligibility,
      fees: req.body.fees,
    });

    const existingProgramByCode = await Program.findOne({
      programCode: req.body.programCode,
      institution: req.body.adminID,
    });

    if (existingProgramByCode) {
      res.send({ message: "Sorry this program code already exists" });
    } else {
      const result = await program.save();
      res.send(result);
    }
  } catch (err) {
    console.error("Program creation error:", err);
    res.status(500).json({ message: err.message, error: err });
  }
};

const programList = async (req, res) => {
  try {
    let programs = await Program.find({ institution: req.params.id });
    if (programs.length > 0) {
      res.send(programs);
    } else {
      res.send({ message: "No programs found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getProgramDetail = async (req, res) => {
  try {
    let program = await Program.findById(req.params.id)
      .populate("institution", "institutionName")
      .populate("curriculum.modules", "moduleName moduleCode credits");
    if (program) {
      res.send(program);
    } else {
      res.send({ message: "No program found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getProgramLearners = async (req, res) => {
  try {
    let learners = await Learner.find({ programName: req.params.id });
    if (learners.length > 0) {
      let modifiedLearners = learners.map((learner) => {
        return { ...learner._doc, password: undefined };
      });
      res.send(modifiedLearners);
    } else {
      res.send({ message: "No learners found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const updateProgram = async (req, res) => {
  try {
    const updatedProgram = await Program.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
    );
    res.send(updatedProgram);
  } catch (error) {
    res.status(500).json(error);
  }
};

const updateProgramCurriculum = async (req, res) => {
  const { semester, modules, minCredits, maxCredits } = req.body;

  try {
    const program = await Program.findById(req.params.id);

    if (!program) {
      return res.send({ message: "Program not found" });
    }

    const existingSemester = program.curriculum.find(
      (c) => c.semester === semester,
    );

    if (existingSemester) {
      existingSemester.modules = modules;
      existingSemester.minCredits = minCredits;
      existingSemester.maxCredits = maxCredits;
    } else {
      program.curriculum.push({ semester, modules, minCredits, maxCredits });
    }

    const result = await program.save();
    res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteProgram = async (req, res) => {
  try {
    const deletedProgram = await Program.findByIdAndDelete(req.params.id);
    if (!deletedProgram) {
      return res.send({ message: "Program not found" });
    }
    // Also delete associated learners, modules, and faculty
    await Learner.deleteMany({ programName: req.params.id });
    await Module.deleteMany({ programName: req.params.id });
    await Faculty.deleteMany({ assignedProgram: req.params.id });
    res.send(deletedProgram);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deletePrograms = async (req, res) => {
  try {
    const deletedPrograms = await Program.deleteMany({
      institution: req.params.id,
    });
    if (deletedPrograms.deletedCount === 0) {
      return res.send({ message: "No programs found to delete" });
    }
    await Learner.deleteMany({ institution: req.params.id });
    await Module.deleteMany({ institution: req.params.id });
    await Faculty.deleteMany({ institution: req.params.id });
    res.send(deletedPrograms);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get programs by type
const getProgramsByType = async (req, res) => {
  try {
    let programs = await Program.find({
      institution: req.params.id,
      programType: req.params.type,
    });
    if (programs.length > 0) {
      res.send(programs);
    } else {
      res.send({ message: "No programs found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// Get program statistics
const getProgramStats = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.send({ message: "Program not found" });
    }

    const learnerCount = await Learner.countDocuments({
      programName: req.params.id,
    });
    const moduleCount = await Module.countDocuments({
      programName: req.params.id,
    });
    const facultyCount = await Faculty.countDocuments({
      assignedProgram: req.params.id,
    });

    const stats = {
      program: {
        name: program.programName,
        code: program.programCode,
        type: program.programType,
      },
      learnerCount,
      moduleCount,
      facultyCount,
      totalSemesters: program.totalSemesters,
      totalCredits: program.totalCredits,
    };

    res.send(stats);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  programCreate,
  programList,
  getProgramDetail,
  getProgramLearners,
  updateProgram,
  updateProgramCurriculum,
  deleteProgram,
  deletePrograms,
  getProgramsByType,
  getProgramStats,
};
