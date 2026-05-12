const Subject = require("../models/subjectSchema.js");
const Teacher = require("../models/teacherSchema.js");
const Student = require("../models/studentSchema.js");
const Module = require("../models/moduleSchema.js");
const mongoose = require("mongoose");

const subjectCreate = async (req, res) => {
  try {
    console.log("SubjectCreate request body:", req.body);

    const subjects = req.body.subjects.map((subject) => ({
      subName: subject.subName,
      subCode: subject.subCode,
      sessions: subject.sessions.toString(), // Convert to string as schema requires
    }));

    // Check if any subject code already exists for this school
    const existingSubjectBySubCode = await Subject.findOne({
      subCode: subjects[0].subCode,
      school: req.body.adminID,
    });

    if (existingSubjectBySubCode) {
      res.send({
        message: "Sorry this subcode must be unique as it already exists",
      });
    } else {
      const newSubjects = subjects.map((subject) => ({
        ...subject,
        sclassName: req.body.sclassName,
        school: req.body.adminID,
      }));

      const programId = new mongoose.Types.ObjectId(req.body.sclassName);
      const instId = new mongoose.Types.ObjectId(req.body.adminID);
      const moduleCodes = subjects.map((s) => s.subCode);

      // Replace existing modules for these codes
      await Module.deleteMany({
        programName: programId,
        moduleCode: { $in: moduleCodes },
      });
      await Module.insertMany(
        subjects.map((subject) => ({
          moduleName: subject.subName,
          moduleCode: subject.subCode,
          sessions: parseInt(subject.sessions) || 45,
          programName: programId,
          institution: instId,
          credits: 3,
        })),
      );

      const result = await Subject.insertMany(newSubjects);

      // Link each Subject to its corresponding Module
      if (result && result.length > 0) {
        for (const subject of result) {
          const mod = await Module.findOne({
            moduleCode: subject.subCode,
            programName: programId,
          });
          if (mod) {
            await Subject.findByIdAndUpdate(subject._id, {
              $set: { moduleRef: mod._id },
            });
          }
        }
      }

      res.send(result);
    }
  } catch (err) {
    console.error("SubjectCreate error:", err);
    console.error("SubjectCreate error stack:", err.stack);
    res.status(500).json({
      message: "Error creating subject",
      error: err.message,
    });
  }
};

const allSubjects = async (req, res) => {
  try {
    let subjects = await Subject.find({ school: req.params.id }).populate(
      "sclassName",
      "programName sclassName",
    );
    if (subjects.length > 0) {
      res.send(subjects);
    } else {
      res.send({ message: "No subjects found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const classSubjects = async (req, res) => {
  try {
    let subjects = await Subject.find({ sclassName: req.params.id });
    if (subjects.length > 0) {
      res.send(subjects);
    } else {
      res.send({ message: "No subjects found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const freeSubjectList = async (req, res) => {
  try {
    let subjects = await Subject.find({
      sclassName: req.params.id,
      teacher: { $exists: false },
    });
    if (subjects.length > 0) {
      res.send(subjects);
    } else {
      res.send({ message: "No subjects found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getSubjectDetail = async (req, res) => {
  try {
    let subject = await Subject.findById(req.params.id);
    if (subject) {
      subject = await subject.populate("sclassName", "programName sclassName");
      subject = await subject.populate("teacher", "name");
      subject = await subject.populate("moduleRef", "moduleName moduleCode");
      res.send(subject);
    } else {
      res.send({ message: "No subject found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteSubject = async (req, res) => {
  try {
    const deletedSubject = await Subject.findByIdAndDelete(req.params.id);

    if (deletedSubject) {
      // Clean up teacher reference
      await Teacher.updateOne(
        { teachSubject: deletedSubject._id },
        { $unset: { teachSubject: 1 } },
      );

      // Clean up corresponding Module
      if (deletedSubject.moduleRef) {
        await Module.findByIdAndDelete(deletedSubject.moduleRef);
      } else {
        await Module.findOneAndDelete({ moduleCode: deletedSubject.subCode });
      }
    }

    // Remove the objects containing the deleted subject from students' examResult array
    await Student.updateMany(
      {},
      { $pull: { examResult: { subName: deletedSubject._id } } },
    );

    // Remove the objects containing the deleted subject from students' attendance array
    await Student.updateMany(
      {},
      { $pull: { attendance: { subName: deletedSubject._id } } },
    );

    res.send(deletedSubject);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteSubjects = async (req, res) => {
  try {
    const subjectsToDelete = await Subject.find({ school: req.params.id });
    const subjectIds = subjectsToDelete.map((subject) => subject._id);
    const subjectCodes = subjectsToDelete.map((subject) => subject.subCode);

    const deletedSubjects = await Subject.deleteMany({ school: req.params.id });

    if (subjectIds.length > 0) {
      await Teacher.updateMany(
        { teachSubject: { $in: subjectIds } },
        { $unset: { teachSubject: 1 } },
      );

      await Module.deleteMany({ moduleCode: { $in: subjectCodes } });
    }

    await Student.updateMany({}, { $set: { examResult: [], attendance: [] } });

    res.send(deletedSubjects);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteSubjectsByClass = async (req, res) => {
  try {
    const subjectsToDelete = await Subject.find({ sclassName: req.params.id });
    const subjectIds = subjectsToDelete.map((subject) => subject._id);
    const subjectCodes = subjectsToDelete.map((subject) => subject.subCode);

    const deletedSubjects = await Subject.deleteMany({
      sclassName: req.params.id,
    });

    if (subjectIds.length > 0) {
      await Teacher.updateMany(
        { teachSubject: { $in: subjectIds } },
        { $unset: { teachSubject: 1 } },
      );

      await Module.deleteMany({ moduleCode: { $in: subjectCodes } });
    }

    await Student.updateMany({}, { $set: { examResult: [], attendance: [] } });

    res.send(deletedSubjects);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  subjectCreate,
  freeSubjectList,
  classSubjects,
  getSubjectDetail,
  deleteSubjectsByClass,
  deleteSubjects,
  deleteSubject,
  allSubjects,
};
