const Announcement = require("../models/noticeSchema.js");

const announcementCreate = async (req, res) => {
  try {
    const announcement = new Announcement({
      title: req.body.title,
      content: req.body.content,
      date: req.body.date || new Date(),
      category: req.body.category || "General",
      priority: req.body.priority || "Normal",
      targetAudience: req.body.targetAudience || "All",
      targetPrograms: req.body.targetPrograms,
      institution: req.body.adminID,
      expiryDate: req.body.expiryDate,
      attachments: req.body.attachments,
    });

    const result = await announcement.save();
    res.send(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

const announcementList = async (req, res) => {
  try {
    let announcements = await Announcement.find({
      institution: req.params.id,
      isActive: true,
    })
      .populate("targetPrograms", "programName")
      .sort({ createdAt: -1 });
    if (announcements.length > 0) {
      res.send(announcements);
    } else {
      res.send({ message: "No announcements found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getAnnouncementsByCategory = async (req, res) => {
  try {
    let announcements = await Announcement.find({
      institution: req.params.id,
      category: req.params.category,
      isActive: true,
    }).sort({ createdAt: -1 });
    if (announcements.length > 0) {
      res.send(announcements);
    } else {
      res.send({ message: "No announcements found in this category" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getAnnouncementsByAudience = async (req, res) => {
  try {
    let announcements = await Announcement.find({
      institution: req.params.id,
      $or: [{ targetAudience: "All" }, { targetAudience: req.params.audience }],
      isActive: true,
    }).sort({ priority: -1, createdAt: -1 });
    if (announcements.length > 0) {
      res.send(announcements);
    } else {
      res.send({ message: "No announcements found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getAnnouncementDetail = async (req, res) => {
  try {
    let announcement = await Announcement.findById(req.params.id)
      .populate("targetPrograms", "programName programCode")
      .populate("institution", "institutionName");
    if (announcement) {
      res.send(announcement);
    } else {
      res.send({ message: "No announcement found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const updateAnnouncement = async (req, res) => {
  try {
    const result = await Announcement.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
    );
    res.send(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

const deactivateAnnouncement = async (req, res) => {
  try {
    const result = await Announcement.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true },
    );
    res.send(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteAnnouncement = async (req, res) => {
  try {
    const result = await Announcement.findByIdAndDelete(req.params.id);
    res.send(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteAnnouncements = async (req, res) => {
  try {
    const result = await Announcement.deleteMany({
      institution: req.params.id,
    });
    if (result.deletedCount === 0) {
      res.send({ message: "No announcements found to delete" });
    } else {
      res.send(result);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// Get urgent announcements
const getUrgentAnnouncements = async (req, res) => {
  try {
    let announcements = await Announcement.find({
      institution: req.params.id,
      priority: "Urgent",
      isActive: true,
      $or: [{ expiryDate: { $gte: new Date() } }, { expiryDate: null }],
    }).sort({ createdAt: -1 });
    if (announcements.length > 0) {
      res.send(announcements);
    } else {
      res.send({ message: "No urgent announcements" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  announcementCreate,
  announcementList,
  getAnnouncementsByCategory,
  getAnnouncementsByAudience,
  getAnnouncementDetail,
  updateAnnouncement,
  deactivateAnnouncement,
  deleteAnnouncement,
  deleteAnnouncements,
  getUrgentAnnouncements,
};
