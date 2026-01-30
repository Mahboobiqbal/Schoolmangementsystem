const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "userType",
      required: true,
    },
    userType: {
      type: String,
      enum: ["learner", "faculty"],
      default: "learner",
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    feedbackType: {
      type: String,
      enum: ["Complaint", "Suggestion", "Query", "Grievance", "Appreciation"],
      default: "Complaint",
    },
    category: {
      type: String,
      enum: [
        "Academic",
        "Administrative",
        "Infrastructure",
        "Faculty",
        "Technical",
        "Other",
      ],
      default: "Other",
    },
    subject: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved", "Closed", "Escalated"],
      default: "Pending",
    },
    institution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
      required: true,
    },
    response: {
      message: String,
      respondedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "admin",
      },
      respondedAt: Date,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("feedback", feedbackSchema);
