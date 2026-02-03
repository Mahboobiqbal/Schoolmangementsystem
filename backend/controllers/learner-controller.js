const bcrypt = require("bcrypt");
const Learner = require("../models/learnerSchema.js");
const Module = require("../models/moduleSchema.js");

const learnerRegister = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    const enrollmentId = req.body.enrollmentId || req.body.rollNum;
    const programName = req.body.programName || req.body.sclassName;

    if (!enrollmentId) {
      return res
        .status(400)
        .json({ message: "Enrollment ID (rollNum) is required" });
    }

    if (!programName) {
      return res
        .status(400)
        .json({ message: "Program (sclassName) is required" });
    }

    const existingLearner = await Learner.findOne({
      enrollmentId: enrollmentId,
      institution: req.body.adminID,
      programName: programName,
    });

    if (existingLearner) {
      res.send({ message: "Enrollment ID already exists" });
    } else {
      const learner = new Learner({
        ...req.body,
        enrollmentId: enrollmentId,
        programName: programName,
        institution: req.body.adminID,
        password: hashedPass,
      });

      let result = await learner.save();

      result.password = undefined;
      res.send(result);
    }
  } catch (err) {
    console.error("Learner registration error:", err);
    res.status(500).json({ message: err.message, error: err });
  }
};

const learnerLogIn = async (req, res) => {
  try {
    const enrollmentId = req.body.enrollmentId || req.body.rollNum;
    const learnerName = req.body.learnerName || req.body.name;

    if (!enrollmentId || !learnerName) {
      return res.send({ message: "Enrollment ID and Name are required" });
    }

    let learner = await Learner.findOne({
      enrollmentId: enrollmentId,
      name: { $regex: new RegExp("^" + learnerName + "$", "i") },
    });
    if (learner) {
      const validated = await bcrypt.compare(
        req.body.password,
        learner.password,
      );
      if (validated) {
        learner = await learner.populate("institution", "institutionName");
        learner = await learner.populate("programName", "programName");
        learner.password = undefined;
        learner.assessmentResults = undefined;
        learner.participation = undefined;
        res.send(learner);
      } else {
        res.send({ message: "Invalid password" });
      }
    } else {
      res.send({ message: "Learner not found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getLearners = async (req, res) => {
  try {
    let learners = await Learner.find({ institution: req.params.id }).populate(
      "programName",
      "programName",
    );
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

const getLearnerDetail = async (req, res) => {
  try {
    let learner = await Learner.findById(req.params.id)
      .populate("institution", "institutionName")
      .populate("programName", "programName programCode")
      .populate("assessmentResults.moduleName", "moduleName moduleCode credits")
      .populate("participation.moduleName", "moduleName sessions");
    if (learner) {
      learner.password = undefined;
      res.send(learner);
    } else {
      res.send({ message: "No learner found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteLearner = async (req, res) => {
  try {
    const result = await Learner.findByIdAndDelete(req.params.id);
    res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteLearners = async (req, res) => {
  try {
    const result = await Learner.deleteMany({ institution: req.params.id });
    if (result.deletedCount === 0) {
      res.send({ message: "No learners found to delete" });
    } else {
      res.send(result);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteLearnersByProgram = async (req, res) => {
  try {
    const result = await Learner.deleteMany({ programName: req.params.id });
    if (result.deletedCount === 0) {
      res.send({ message: "No learners found to delete" });
    } else {
      res.send(result);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const updateLearner = async (req, res) => {
  try {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    let result = await Learner.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
    );

    result.password = undefined;
    res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

const updateAssessmentResult = async (req, res) => {
  const {
    moduleName,
    marksObtained,
    assessmentType,
    maxMarks,
    grade,
    remarks,
  } = req.body;

  try {
    const learner = await Learner.findById(req.params.id);

    if (!learner) {
      return res.send({ message: "Learner not found" });
    }

    const existingResult = learner.assessmentResults.find(
      (result) =>
        result.moduleName.toString() === moduleName &&
        result.assessmentType === assessmentType,
    );

    if (existingResult) {
      existingResult.marksObtained = marksObtained;
      existingResult.maxMarks = maxMarks || existingResult.maxMarks;
      existingResult.grade = grade || existingResult.grade;
      existingResult.remarks = remarks || existingResult.remarks;
      existingResult.assessmentDate = new Date();
    } else {
      learner.assessmentResults.push({
        moduleName,
        marksObtained,
        assessmentType: assessmentType || "Assignment",
        maxMarks: maxMarks || 100,
        grade,
        remarks,
        assessmentDate: new Date(),
      });
    }

    const result = await learner.save();
    return res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

const learnerParticipation = async (req, res) => {
  const { moduleName, status, date, engagementScore, notes } = req.body;

  try {
    const learner = await Learner.findById(req.params.id);

    if (!learner) {
      return res.send({ message: "Learner not found" });
    }

    const module = await Module.findById(moduleName);

    const existingParticipation = learner.participation.find(
      (p) =>
        p.date.toDateString() === new Date(date).toDateString() &&
        p.moduleName.toString() === moduleName,
    );

    if (existingParticipation) {
      existingParticipation.status = status;
      existingParticipation.engagementScore =
        engagementScore || existingParticipation.engagementScore;
      existingParticipation.notes = notes || existingParticipation.notes;
    } else {
      // Check if the learner has already attended the maximum number of sessions
      const attendedSessions = learner.participation.filter(
        (p) => p.moduleName.toString() === moduleName,
      ).length;

      if (module && attendedSessions >= module.sessions) {
        return res.send({ message: "Maximum session limit reached" });
      }

      learner.participation.push({
        date,
        status,
        moduleName,
        engagementScore: engagementScore || 5,
        notes,
      });
    }

    const result = await learner.save();
    return res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

const clearAllLearnersParticipationByModule = async (req, res) => {
  const moduleName = req.params.id;

  try {
    const result = await Learner.updateMany(
      { "participation.moduleName": moduleName },
      { $pull: { participation: { moduleName } } },
    );
    return res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

const clearAllLearnersParticipation = async (req, res) => {
  const institutionId = req.params.id;

  try {
    const result = await Learner.updateMany(
      { institution: institutionId },
      { $set: { participation: [] } },
    );

    return res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

const removeLearnerParticipationByModule = async (req, res) => {
  const learnerId = req.params.id;
  const moduleName = req.body.moduleId;

  try {
    const result = await Learner.updateOne(
      { _id: learnerId },
      { $pull: { participation: { moduleName: moduleName } } },
    );

    return res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

const removeLearnerParticipation = async (req, res) => {
  const learnerId = req.params.id;

  try {
    const result = await Learner.updateOne(
      { _id: learnerId },
      { $set: { participation: [] } },
    );

    return res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get learner's academic transcript
const getLearnerTranscript = async (req, res) => {
  try {
    const learner = await Learner.findById(req.params.id)
      .populate("institution", "institutionName")
      .populate("programName", "programName programCode")
      .populate(
        "assessmentResults.moduleName",
        "moduleName moduleCode credits",
      );

    if (!learner) {
      return res.send({ message: "Learner not found" });
    }

    // Calculate GPA and organize by semester
    const transcript = {
      learnerInfo: {
        name: learner.name,
        enrollmentId: learner.enrollmentId,
        program: learner.programName,
        institution: learner.institution,
        status: learner.status,
      },
      academicHistory: learner.academicHistory,
      assessmentResults: learner.assessmentResults,
      cumulativeGPA: calculateCumulativeGPA(learner.academicHistory),
    };

    res.send(transcript);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Helper function to calculate cumulative GPA
const calculateCumulativeGPA = (academicHistory) => {
  if (!academicHistory || academicHistory.length === 0) return 0;

  let totalPoints = 0;
  let totalCredits = 0;

  academicHistory.forEach((semester) => {
    if (semester.gpa && semester.creditsEarned) {
      totalPoints += semester.gpa * semester.creditsEarned;
      totalCredits += semester.creditsEarned;
    }
  });

  return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
};

// Get learner performance analytics
const getLearnerPerformance = async (req, res) => {
  try {
    const learner = await Learner.findById(req.params.id)
      .populate("assessmentResults.moduleName", "moduleName moduleCode credits")
      .populate("participation.moduleName", "moduleName sessions");

    if (!learner) {
      return res.send({ message: "Learner not found" });
    }

    // Calculate performance metrics
    const participationRate = calculateParticipationRate(learner.participation);
    const averageScore = calculateAverageScore(learner.assessmentResults);
    const modulePerformance = getModulePerformance(learner.assessmentResults);

    const performance = {
      participationRate,
      averageScore,
      modulePerformance,
      totalAssessments: learner.assessmentResults.length,
      recentActivity: learner.participation.slice(-10),
    };

    res.send(performance);
  } catch (error) {
    res.status(500).json(error);
  }
};

const calculateParticipationRate = (participation) => {
  if (!participation || participation.length === 0) return 0;
  const present = participation.filter(
    (p) => p.status === "Present" || p.status === "Late",
  ).length;
  return ((present / participation.length) * 100).toFixed(2);
};

const calculateAverageScore = (results) => {
  if (!results || results.length === 0) return 0;
  const total = results.reduce(
    (sum, r) => sum + (r.marksObtained / r.maxMarks) * 100,
    0,
  );
  return (total / results.length).toFixed(2);
};

const getModulePerformance = (results) => {
  const moduleMap = {};
  results.forEach((r) => {
    const moduleId = r.moduleName?._id?.toString() || r.moduleName?.toString();
    if (!moduleMap[moduleId]) {
      moduleMap[moduleId] = {
        moduleName: r.moduleName?.moduleName || "Unknown",
        assessments: [],
        averageScore: 0,
      };
    }
    moduleMap[moduleId].assessments.push({
      type: r.assessmentType,
      score: r.marksObtained,
      maxScore: r.maxMarks,
      grade: r.grade,
    });
  });

  // Calculate average for each module
  Object.keys(moduleMap).forEach((key) => {
    const module = moduleMap[key];
    const total = module.assessments.reduce(
      (sum, a) => sum + (a.score / a.maxScore) * 100,
      0,
    );
    module.averageScore = (total / module.assessments.length).toFixed(2);
  });

  return Object.values(moduleMap);
};

module.exports = {
  learnerRegister,
  learnerLogIn,
  getLearners,
  getLearnerDetail,
  deleteLearners,
  deleteLearner,
  updateLearner,
  learnerParticipation,
  deleteLearnersByProgram,
  updateAssessmentResult,
  clearAllLearnersParticipationByModule,
  clearAllLearnersParticipation,
  removeLearnerParticipationByModule,
  removeLearnerParticipation,
  getLearnerTranscript,
  getLearnerPerformance,
};
