const mongoose = require("mongoose");
const Feedback = require("../models/complainSchema.js");

const feedbackCreate = async (req, res) => {
  try {
    const feedback = new Feedback({
      user: req.body.userId,
      userType: req.body.userType || "learner",
      date: req.body.date || new Date(),
      feedbackType: req.body.feedbackType || "Complaint",
      category: req.body.category || "Other",
      subject: req.body.subject,
      description: req.body.description,
      priority: req.body.priority || "Medium",
      institution: req.body.adminID,
    });

    const result = await feedback.save();
    res.send(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

const feedbackList = async (req, res) => {
  try {
    let feedbacks = await Feedback.find({ institution: req.params.id })
      .populate("user", "name enrollmentId email")
      .sort({ createdAt: -1 });
    if (feedbacks.length > 0) {
      res.send(feedbacks);
    } else {
      res.send({ message: "No feedback found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getFeedbackByType = async (req, res) => {
  try {
    let feedbacks = await Feedback.find({
      institution: req.params.id,
      feedbackType: req.params.type,
    })
      .populate("user", "name enrollmentId email")
      .sort({ createdAt: -1 });
    if (feedbacks.length > 0) {
      res.send(feedbacks);
    } else {
      res.send({ message: "No feedback found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getFeedbackByCategory = async (req, res) => {
  try {
    let feedbacks = await Feedback.find({
      institution: req.params.id,
      category: req.params.category,
    })
      .populate("user", "name enrollmentId email")
      .sort({ createdAt: -1 });
    if (feedbacks.length > 0) {
      res.send(feedbacks);
    } else {
      res.send({ message: "No feedback found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getFeedbackByStatus = async (req, res) => {
  try {
    let feedbacks = await Feedback.find({
      institution: req.params.id,
      status: req.params.status,
    })
      .populate("user", "name enrollmentId email")
      .sort({ priority: -1, createdAt: -1 });
    if (feedbacks.length > 0) {
      res.send(feedbacks);
    } else {
      res.send({ message: "No feedback found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getFeedbackDetail = async (req, res) => {
  try {
    let feedback = await Feedback.findById(req.params.id)
      .populate("user", "name enrollmentId email")
      .populate("institution", "institutionName")
      .populate("response.respondedBy", "name");
    if (feedback) {
      res.send(feedback);
    } else {
      res.send({ message: "No feedback found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const updateFeedbackStatus = async (req, res) => {
  try {
    const result = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true },
    );
    res.send(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

const respondToFeedback = async (req, res) => {
  try {
    const result = await Feedback.findByIdAndUpdate(
      req.params.id,
      {
        response: {
          message: req.body.message,
          respondedBy: req.body.adminId,
          respondedAt: new Date(),
        },
        status: req.body.status || "Resolved",
      },
      { new: true },
    );
    res.send(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteFeedback = async (req, res) => {
  try {
    const result = await Feedback.findByIdAndDelete(req.params.id);
    res.send(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteFeedbacks = async (req, res) => {
  try {
    const result = await Feedback.deleteMany({ institution: req.params.id });
    if (result.deletedCount === 0) {
      res.send({ message: "No feedback found to delete" });
    } else {
      res.send(result);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// Get feedback statistics
const getFeedbackStats = async (req, res) => {
  try {
    const total = await Feedback.countDocuments({ institution: req.params.id });
    const pending = await Feedback.countDocuments({
      institution: req.params.id,
      status: "Pending",
    });
    const inProgress = await Feedback.countDocuments({
      institution: req.params.id,
      status: "In Progress",
    });
    const resolved = await Feedback.countDocuments({
      institution: req.params.id,
      status: "Resolved",
    });

    const institutionObjId = new mongoose.Types.ObjectId(req.params.id);

    const byCategory = await Feedback.aggregate([
      { $match: { institution: institutionObjId } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    const byType = await Feedback.aggregate([
      { $match: { institution: institutionObjId } },
      { $group: { _id: "$feedbackType", count: { $sum: 1 } } },
    ]);

    res.send({
      total,
      pending,
      inProgress,
      resolved,
      byCategory,
      byType,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  feedbackCreate,
  feedbackList,
  getFeedbackByType,
  getFeedbackByCategory,
  getFeedbackByStatus,
  getFeedbackDetail,
  updateFeedbackStatus,
  respondToFeedback,
  deleteFeedback,
  deleteFeedbacks,
  getFeedbackStats,
};
