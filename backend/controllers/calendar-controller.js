const AcademicCalendar = require("../models/academicCalendarSchema.js");

const calendarCreate = async (req, res) => {
  try {
    const calendar = new AcademicCalendar({
      institution: req.body.adminID,
      academicYear: req.body.academicYear,
      semester: req.body.semester,
      events: req.body.events || [],
      schedule: req.body.schedule,
      holidays: req.body.holidays || [],
      workingDays: req.body.workingDays || [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
      ],
      classTimings: req.body.classTimings,
    });

    const existingCalendar = await AcademicCalendar.findOne({
      institution: req.body.adminID,
      academicYear: req.body.academicYear,
      semester: req.body.semester,
    });

    if (existingCalendar) {
      res.send({ message: "Calendar for this semester already exists" });
    } else {
      const result = await calendar.save();
      res.send(result);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const calendarList = async (req, res) => {
  try {
    let calendars = await AcademicCalendar.find({
      institution: req.params.id,
    }).sort({ academicYear: -1, semester: 1 });
    if (calendars.length > 0) {
      res.send(calendars);
    } else {
      res.send({ message: "No academic calendars found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getCalendarDetail = async (req, res) => {
  try {
    let calendar = await AcademicCalendar.findById(req.params.id).populate(
      "events.affectedPrograms",
      "programName",
    );
    if (calendar) {
      res.send(calendar);
    } else {
      res.send({ message: "No calendar found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getCurrentCalendar = async (req, res) => {
  try {
    const now = new Date();
    let calendar = await AcademicCalendar.findOne({
      institution: req.params.id,
      "schedule.semesterStart": { $lte: now },
      "schedule.semesterEnd": { $gte: now },
    }).populate("events.affectedPrograms", "programName");

    if (calendar) {
      res.send(calendar);
    } else {
      // Return the most recent calendar if no current one
      calendar = await AcademicCalendar.findOne({
        institution: req.params.id,
      }).sort({ createdAt: -1 });
      if (calendar) {
        res.send(calendar);
      } else {
        res.send({ message: "No calendar found" });
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const addEvent = async (req, res) => {
  try {
    const calendar = await AcademicCalendar.findById(req.params.id);

    if (!calendar) {
      return res.send({ message: "Calendar not found" });
    }

    calendar.events.push({
      title: req.body.title,
      eventType: req.body.eventType,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      description: req.body.description,
      isRecurring: req.body.isRecurring || false,
      affectedPrograms: req.body.affectedPrograms,
      status: req.body.status || "Scheduled",
    });

    const result = await calendar.save();
    res.send(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

const updateEvent = async (req, res) => {
  const { eventId } = req.body;

  try {
    const calendar = await AcademicCalendar.findById(req.params.id);

    if (!calendar) {
      return res.send({ message: "Calendar not found" });
    }

    const event = calendar.events.id(eventId);
    if (!event) {
      return res.send({ message: "Event not found" });
    }

    Object.assign(event, req.body);
    const result = await calendar.save();
    res.send(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

const removeEvent = async (req, res) => {
  const { eventId } = req.body;

  try {
    const calendar = await AcademicCalendar.findById(req.params.id);

    if (!calendar) {
      return res.send({ message: "Calendar not found" });
    }

    calendar.events.pull(eventId);
    const result = await calendar.save();
    res.send(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

const addHoliday = async (req, res) => {
  try {
    const calendar = await AcademicCalendar.findById(req.params.id);

    if (!calendar) {
      return res.send({ message: "Calendar not found" });
    }

    calendar.holidays.push({
      name: req.body.name,
      date: req.body.date,
      isInstitutionWide: req.body.isInstitutionWide !== false,
    });

    const result = await calendar.save();
    res.send(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

const updateSchedule = async (req, res) => {
  try {
    const result = await AcademicCalendar.findByIdAndUpdate(
      req.params.id,
      { schedule: req.body.schedule },
      { new: true },
    );
    res.send(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getUpcomingEvents = async (req, res) => {
  try {
    const calendar = await AcademicCalendar.findOne({
      institution: req.params.id,
    }).sort({ createdAt: -1 });

    if (!calendar) {
      return res.send({ message: "No calendar found" });
    }

    const now = new Date();
    const upcomingEvents = calendar.events
      .filter((e) => new Date(e.startDate) >= now && e.status !== "Cancelled")
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    res.send(upcomingEvents);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getEventsByType = async (req, res) => {
  try {
    const calendar = await AcademicCalendar.findOne({
      institution: req.params.id,
    }).sort({ createdAt: -1 });

    if (!calendar) {
      return res.send({ message: "No calendar found" });
    }

    const events = calendar.events.filter(
      (e) => e.eventType === req.params.type,
    );

    res.send(events);
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteCalendar = async (req, res) => {
  try {
    const result = await AcademicCalendar.findByIdAndDelete(req.params.id);
    res.send(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteCalendars = async (req, res) => {
  try {
    const result = await AcademicCalendar.deleteMany({
      institution: req.params.id,
    });
    if (result.deletedCount === 0) {
      res.send({ message: "No calendars found to delete" });
    } else {
      res.send(result);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  calendarCreate,
  calendarList,
  getCalendarDetail,
  getCurrentCalendar,
  addEvent,
  updateEvent,
  removeEvent,
  addHoliday,
  updateSchedule,
  getUpcomingEvents,
  getEventsByType,
  deleteCalendar,
  deleteCalendars,
};
