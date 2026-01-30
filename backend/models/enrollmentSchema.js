const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    learner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "learner",
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
    semester: {
      type: Number,
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
    },
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
    enrolledModules: [
      {
        module: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "module",
        },
        status: {
          type: String,
          enum: ["Enrolled", "Dropped", "Completed", "Failed", "Withdrawn"],
          default: "Enrolled",
        },
        enrollmentDate: {
          type: Date,
          default: Date.now,
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
            "W",
            "P",
          ],
        },
        credits: Number,
        gradePoints: Number,
      },
    ],
    totalCreditsAttempted: {
      type: Number,
      default: 0,
    },
    totalCreditsEarned: {
      type: Number,
      default: 0,
    },
    semesterGPA: {
      type: Number,
      min: 0,
      max: 4.0,
    },
    cumulativeGPA: {
      type: Number,
      min: 0,
      max: 4.0,
    },
    status: {
      type: String,
      enum: [
        "Active",
        "Probation",
        "Suspended",
        "Graduated",
        "Withdrawn",
        "On Leave",
      ],
      default: "Active",
    },
    remarks: {
      type: String,
    },
    fees: {
      totalAmount: Number,
      paidAmount: {
        type: Number,
        default: 0,
      },
      dueAmount: Number,
      paymentStatus: {
        type: String,
        enum: ["Paid", "Partial", "Pending", "Overdue"],
        default: "Pending",
      },
    },
  },
  { timestamps: true },
);

// Compound index to ensure one enrollment per learner per semester
enrollmentSchema.index(
  { learner: 1, semester: 1, academicYear: 1 },
  { unique: true },
);

module.exports = mongoose.model("enrollment", enrollmentSchema);
