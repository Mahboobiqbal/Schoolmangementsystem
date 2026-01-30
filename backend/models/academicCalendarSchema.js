const mongoose = require("mongoose");

const academicCalendarSchema = new mongoose.Schema(
  {
    institution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
      required: true,
    },
    academicYear: {
      type: String,
      required: true, // e.g., "2025-2026"
    },
    semester: {
      type: String,
      required: true, // e.g., "Fall 2025", "Spring 2026"
    },
    events: [
      {
        title: {
          type: String,
          required: true,
        },
        eventType: {
          type: String,
          enum: [
            "Semester Start",
            "Semester End",
            "Registration Period",
            "Add/Drop Period",
            "Mid-Term Exams",
            "Final Exams",
            "Holiday",
            "Break",
            "Convocation",
            "Orientation",
            "Workshop",
            "Seminar",
            "Conference",
            "Other",
          ],
          required: true,
        },
        startDate: {
          type: Date,
          required: true,
        },
        endDate: {
          type: Date,
          required: true,
        },
        description: {
          type: String,
        },
        isRecurring: {
          type: Boolean,
          default: false,
        },
        affectedPrograms: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "program",
          },
        ],
        status: {
          type: String,
          enum: ["Scheduled", "Ongoing", "Completed", "Cancelled", "Postponed"],
          default: "Scheduled",
        },
      },
    ],
    schedule: {
      semesterStart: Date,
      semesterEnd: Date,
      registrationStart: Date,
      registrationEnd: Date,
      addDropDeadline: Date,
      midTermStart: Date,
      midTermEnd: Date,
      finalExamStart: Date,
      finalExamEnd: Date,
      gradeSubmissionDeadline: Date,
    },
    holidays: [
      {
        name: String,
        date: Date,
        isInstitutionWide: {
          type: Boolean,
          default: true,
        },
      },
    ],
    workingDays: {
      type: [String],
      default: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
    classTimings: {
      firstPeriodStart: String,
      lastPeriodEnd: String,
      periodDuration: Number, // in minutes
      breakDuration: Number,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("academicCalendar", academicCalendarSchema);
