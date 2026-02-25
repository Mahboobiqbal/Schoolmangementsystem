const mongoose = require("mongoose");

const institutionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "Admin",
    },
    institutionName: {
      type: String,
      unique: true,
      required: true,
    },
    // Legacy field for backward compatibility with old school-based controllers
    schoolName: {
      type: String,
      sparse: true,
    },
    institutionType: {
      type: String,
      enum: [
        "University",
        "College",
        "Institute",
        "Academy",
        "Training Center",
      ],
      default: "University",
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },
    contact: {
      phone: String,
      fax: String,
      website: String,
    },
    accreditation: {
      body: String,
      status: {
        type: String,
        enum: ["Accredited", "Pending", "Not Accredited"],
        default: "Pending",
      },
      validUntil: Date,
    },
    academicCalendar: [
      {
        event: String,
        startDate: Date,
        endDate: Date,
        description: String,
        type: {
          type: String,
          enum: [
            "Semester Start",
            "Semester End",
            "Holiday",
            "Exam Period",
            "Registration",
            "Other",
          ],
        },
      },
    ],
    currentSemester: {
      name: String,
      startDate: Date,
      endDate: Date,
    },
    settings: {
      gradingSystem: {
        type: String,
        enum: ["GPA", "Percentage", "Letter Grade"],
        default: "GPA",
      },
      maxGPA: {
        type: Number,
        default: 4.0,
      },
      passingGrade: {
        type: String,
        default: "D",
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("admin", institutionSchema);
