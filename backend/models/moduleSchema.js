const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema(
  {
    moduleName: {
      type: String,
      required: true,
    },
    moduleCode: {
      type: String,
      required: true,
    },
    credits: {
      type: Number,
      required: true,
      default: 3,
    },
    sessions: {
      type: Number,
      required: true,
      default: 45, // total lecture hours
    },
    moduleType: {
      type: String,
      enum: ["Core", "Elective", "Lab", "Project", "Seminar", "Internship"],
      default: "Core",
    },
    semester: {
      type: Number,
      min: 1,
      max: 8,
    },
    programName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "program",
      required: true,
    },
    institution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "faculty",
    },
    description: {
      type: String,
    },
    prerequisites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "module",
      },
    ],
    learningOutcomes: [
      {
        type: String,
      },
    ],
    assessmentCriteria: {
      assignments: {
        type: Number,
        default: 20, // percentage
      },
      quizzes: {
        type: Number,
        default: 10,
      },
      midTerm: {
        type: Number,
        default: 20,
      },
      finalExam: {
        type: Number,
        default: 40,
      },
      project: {
        type: Number,
        default: 10,
      },
    },
    schedule: [
      {
        day: {
          type: String,
          enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
        },
        startTime: String,
        endTime: String,
        room: String,
        sessionType: {
          type: String,
          enum: ["Lecture", "Lab", "Tutorial", "Seminar"],
          default: "Lecture",
        },
      },
    ],
    syllabus: [
      {
        week: Number,
        topic: String,
        description: String,
        readings: String,
      },
    ],
    status: {
      type: String,
      enum: ["Active", "Inactive", "Archived"],
      default: "Active",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("module", moduleSchema);
