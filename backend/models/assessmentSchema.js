const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    assessmentType: {
      type: String,
      enum: [
        "Assignment",
        "Quiz",
        "MidTerm",
        "Final",
        "Project",
        "Presentation",
        "Lab Work",
        "Research Paper",
      ],
      required: true,
    },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "module",
      required: true,
    },
    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "program",
      required: true,
    },
    institution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
      required: true,
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "faculty",
    },
    description: {
      type: String,
    },
    instructions: {
      type: String,
    },
    maxMarks: {
      type: Number,
      required: true,
      default: 100,
    },
    passingMarks: {
      type: Number,
      default: 40,
    },
    weightage: {
      type: Number,
      default: 10, // percentage contribution to final grade
    },
    dueDate: {
      type: Date,
      required: true,
    },
    startDate: {
      type: Date,
    },
    duration: {
      type: Number, // in minutes
    },
    status: {
      type: String,
      enum: ["Draft", "Published", "Ongoing", "Completed", "Graded"],
      default: "Draft",
    },
    submissions: [
      {
        learner: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "learner",
        },
        submittedAt: {
          type: Date,
          default: Date.now,
        },
        marksObtained: {
          type: Number,
        },
        grade: {
          type: String,
          enum: [
            "A+",
            "A",
            "A-",
            "B+",
            "B",
            "B-",
            "C+",
            "C",
            "C-",
            "D",
            "F",
            "I",
          ],
        },
        feedback: {
          type: String,
        },
        status: {
          type: String,
          enum: ["Pending", "Submitted", "Late", "Graded", "Returned"],
          default: "Pending",
        },
        attachments: [
          {
            fileName: String,
            fileUrl: String,
          },
        ],
      },
    ],
    rubric: [
      {
        criterion: String,
        description: String,
        maxPoints: Number,
        levels: [
          {
            level: String,
            points: Number,
            description: String,
          },
        ],
      },
    ],
    allowLateSubmission: {
      type: Boolean,
      default: false,
    },
    latePenalty: {
      type: Number, // percentage deduction per day
      default: 10,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("assessment", assessmentSchema);
