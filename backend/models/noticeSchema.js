const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    category: {
      type: String,
      enum: [
        "General",
        "Academic",
        "Examination",
        "Event",
        "Holiday",
        "Emergency",
        "Administrative",
      ],
      default: "General",
    },
    priority: {
      type: String,
      enum: ["Low", "Normal", "High", "Urgent"],
      default: "Normal",
    },
    targetAudience: {
      type: String,
      enum: ["All", "Learners", "Faculty", "Admin", "Specific Program"],
      default: "All",
    },
    targetPrograms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "program",
      },
    ],
    institution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
    },
    expiryDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    attachments: [
      {
        fileName: String,
        fileUrl: String,
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("announcement", announcementSchema);
