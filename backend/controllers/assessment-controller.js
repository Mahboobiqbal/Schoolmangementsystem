const Assessment = require("../models/assessmentSchema.js");
const Learner = require("../models/learnerSchema.js");

const assessmentCreate = async (req, res) => {
  try {
    const assessment = new Assessment({
      title: req.body.title,
      assessmentType: req.body.assessmentType,
      module: req.body.module,
      program: req.body.program,
      institution: req.body.adminID,
      faculty: req.body.faculty,
      description: req.body.description,
      instructions: req.body.instructions,
      maxMarks: req.body.maxMarks || 100,
      passingMarks: req.body.passingMarks || 40,
      weightage: req.body.weightage || 10,
      dueDate: req.body.dueDate,
      startDate: req.body.startDate,
      duration: req.body.duration,
      rubric: req.body.rubric,
      allowLateSubmission: req.body.allowLateSubmission || false,
      latePenalty: req.body.latePenalty || 10,
    });

    const result = await assessment.save();
    res.send(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

const assessmentList = async (req, res) => {
  try {
    let assessments = await Assessment.find({ institution: req.params.id })
      .populate("module", "moduleName moduleCode")
      .populate("program", "programName")
      .populate("faculty", "name");
    if (assessments.length > 0) {
      res.send(assessments);
    } else {
      res.send({ message: "No assessments found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getAssessmentsByModule = async (req, res) => {
  try {
    let assessments = await Assessment.find({ module: req.params.id }).populate(
      "faculty",
      "name",
    );
    if (assessments.length > 0) {
      res.send(assessments);
    } else {
      res.send({ message: "No assessments found for this module" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getAssessmentsByProgram = async (req, res) => {
  try {
    let assessments = await Assessment.find({ program: req.params.id })
      .populate("module", "moduleName moduleCode")
      .populate("faculty", "name");
    if (assessments.length > 0) {
      res.send(assessments);
    } else {
      res.send({ message: "No assessments found for this program" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getAssessmentDetail = async (req, res) => {
  try {
    let assessment = await Assessment.findById(req.params.id)
      .populate("module", "moduleName moduleCode credits")
      .populate("program", "programName programCode")
      .populate("faculty", "name email")
      .populate("submissions.learner", "name enrollmentId");
    if (assessment) {
      res.send(assessment);
    } else {
      res.send({ message: "No assessment found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const updateAssessment = async (req, res) => {
  try {
    const updatedAssessment = await Assessment.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
    );
    res.send(updatedAssessment);
  } catch (error) {
    res.status(500).json(error);
  }
};

const publishAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findByIdAndUpdate(
      req.params.id,
      { status: "Published" },
      { new: true },
    );
    res.send(assessment);
  } catch (error) {
    res.status(500).json(error);
  }
};

const submitAssessment = async (req, res) => {
  const { learnerId, attachments } = req.body;

  try {
    const assessment = await Assessment.findById(req.params.id);

    if (!assessment) {
      return res.send({ message: "Assessment not found" });
    }

    const existingSubmission = assessment.submissions.find(
      (s) => s.learner.toString() === learnerId,
    );

    const isLate = new Date() > new Date(assessment.dueDate);
    const submissionStatus = isLate ? "Late" : "Submitted";

    if (existingSubmission) {
      existingSubmission.submittedAt = new Date();
      existingSubmission.status = submissionStatus;
      existingSubmission.attachments =
        attachments || existingSubmission.attachments;
    } else {
      assessment.submissions.push({
        learner: learnerId,
        submittedAt: new Date(),
        status: submissionStatus,
        attachments,
      });
    }

    const result = await assessment.save();
    res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

const gradeSubmission = async (req, res) => {
  const { learnerId, marksObtained, grade, feedback } = req.body;

  try {
    const assessment = await Assessment.findById(req.params.id);

    if (!assessment) {
      return res.send({ message: "Assessment not found" });
    }

    const submission = assessment.submissions.find(
      (s) => s.learner.toString() === learnerId,
    );

    if (!submission) {
      return res.send({ message: "Submission not found" });
    }

    // Apply late penalty if applicable
    let finalMarks = marksObtained;
    if (submission.status === "Late" && assessment.allowLateSubmission) {
      const daysLate = Math.ceil(
        (new Date(submission.submittedAt) - new Date(assessment.dueDate)) /
          (1000 * 60 * 60 * 24),
      );
      const penaltyPercentage = Math.min(
        daysLate * assessment.latePenalty,
        100,
      );
      finalMarks = marksObtained * (1 - penaltyPercentage / 100);
    }

    submission.marksObtained = finalMarks;
    submission.grade = grade || calculateGrade(finalMarks, assessment.maxMarks);
    submission.feedback = feedback;
    submission.status = "Graded";

    // Also update learner's assessment results
    await Learner.findByIdAndUpdate(learnerId, {
      $push: {
        assessmentResults: {
          moduleName: assessment.module,
          assessmentType: assessment.assessmentType,
          marksObtained: finalMarks,
          maxMarks: assessment.maxMarks,
          grade: submission.grade,
          assessmentDate: new Date(),
        },
      },
    });

    const result = await assessment.save();
    res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

const calculateGrade = (marks, maxMarks) => {
  const percentage = (marks / maxMarks) * 100;
  if (percentage >= 90) return "A+";
  if (percentage >= 85) return "A";
  if (percentage >= 80) return "A-";
  if (percentage >= 75) return "B+";
  if (percentage >= 70) return "B";
  if (percentage >= 65) return "B-";
  if (percentage >= 60) return "C+";
  if (percentage >= 55) return "C";
  if (percentage >= 50) return "C-";
  if (percentage >= 40) return "D";
  return "F";
};

const getAssessmentStats = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id).populate(
      "submissions.learner",
      "name enrollmentId",
    );

    if (!assessment) {
      return res.send({ message: "Assessment not found" });
    }

    const submissions = assessment.submissions;
    const gradedSubmissions = submissions.filter((s) => s.status === "Graded");

    const stats = {
      totalSubmissions: submissions.length,
      gradedCount: gradedSubmissions.length,
      pendingCount: submissions.filter(
        (s) => s.status === "Submitted" || s.status === "Late",
      ).length,
      averageScore:
        gradedSubmissions.length > 0
          ? (
              gradedSubmissions.reduce((sum, s) => sum + s.marksObtained, 0) /
              gradedSubmissions.length
            ).toFixed(2)
          : 0,
      highestScore:
        gradedSubmissions.length > 0
          ? Math.max(...gradedSubmissions.map((s) => s.marksObtained))
          : 0,
      lowestScore:
        gradedSubmissions.length > 0
          ? Math.min(...gradedSubmissions.map((s) => s.marksObtained))
          : 0,
      gradeDistribution: getGradeDistribution(gradedSubmissions),
    };

    res.send(stats);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getGradeDistribution = (submissions) => {
  const distribution = {};
  submissions.forEach((s) => {
    distribution[s.grade] = (distribution[s.grade] || 0) + 1;
  });
  return distribution;
};

const deleteAssessment = async (req, res) => {
  try {
    const result = await Assessment.findByIdAndDelete(req.params.id);
    res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteAssessments = async (req, res) => {
  try {
    const result = await Assessment.deleteMany({ institution: req.params.id });
    if (result.deletedCount === 0) {
      res.send({ message: "No assessments found to delete" });
    } else {
      res.send(result);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  assessmentCreate,
  assessmentList,
  getAssessmentsByModule,
  getAssessmentsByProgram,
  getAssessmentDetail,
  updateAssessment,
  publishAssessment,
  submitAssessment,
  gradeSubmission,
  getAssessmentStats,
  deleteAssessment,
  deleteAssessments,
};
