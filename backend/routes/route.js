const router = require("express").Router();

// Admin / Institution Controller
const {
  adminRegister,
  adminLogIn,
  getAdminDetail,
} = require("../controllers/admin-controller.js");

// Program Controller (formerly Class)
const {
  programCreate,
  programList,
  deleteProgram,
  deletePrograms,
  getProgramDetail,
  getProgramLearners,
  updateProgram,
  updateProgramCurriculum,
  getProgramsByType,
  getProgramStats,
} = require("../controllers/program-controller.js");

// Feedback Controller (formerly Complain)
const {
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
} = require("../controllers/feedback-controller.js");

// Announcement Controller (formerly Notice)
const {
  announcementCreate,
  announcementList,
  deleteAnnouncements,
  deleteAnnouncement,
  updateAnnouncement,
  getAnnouncementsByCategory,
  getAnnouncementsByAudience,
  getAnnouncementDetail,
  deactivateAnnouncement,
  getUrgentAnnouncements,
} = require("../controllers/announcement-controller.js");

// Learner Controller (formerly Student)
const {
  learnerRegister,
  learnerLogIn,
  getLearners,
  getLearnerDetail,
  deleteLearners,
  deleteLearner,
  updateLearner,
  learnerParticipation,
  deleteLearnersByProgram,
  updateAssessmentResult,
  clearAllLearnersParticipationByModule,
  clearAllLearnersParticipation,
  removeLearnerParticipationByModule,
  removeLearnerParticipation,
  getLearnerTranscript,
  getLearnerPerformance,
} = require("../controllers/learner-controller.js");

// Module Controller (formerly Subject)
const {
  moduleCreate,
  programModules,
  deleteModulesByProgram,
  getModuleDetail,
  deleteModule,
  freeModuleList,
  allModules,
  deleteModules,
  semesterModules,
  updateModule,
  updateModuleSyllabus,
  updateModuleSchedule,
  assignFacultyToModule,
  getModulesByType,
  getModuleEnrollment,
} = require("../controllers/module-controller.js");

// Faculty Controller (formerly Teacher)
const {
  facultyRegister,
  facultyLogIn,
  getFaculty,
  getFacultyDetail,
  deleteAllFaculty,
  deleteFacultyByProgram,
  deleteFaculty,
  updateFacultyModule,
  allocateCourse,
  removeCourseAllocation,
  updateFacultySchedule,
  updateFaculty,
  getFacultyWorkload,
} = require("../controllers/faculty-controller.js");

// Assessment Controller (new)
const {
  assessmentCreate,
  assessmentList,
  getAssessmentsByModule,
  getAssessmentsByProgram,
  getAssessmentDetail,
  updateAssessment,
  publishAssessment,
  submitAssessment,
  gradeSubmission,
  getAssessmentStats,
  deleteAssessment,
  deleteAssessments,
} = require("../controllers/assessment-controller.js");

// Academic Calendar Controller (new)
const {
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
} = require("../controllers/calendar-controller.js");

// ==================== ADMIN / INSTITUTION ROUTES ====================
router.post("/AdminReg", adminRegister);
router.post("/AdminLogin", adminLogIn);
router.get("/Admin/:id", getAdminDetail);

// ==================== LEARNER ROUTES (formerly Student) ====================
router.post("/LearnerReg", learnerRegister);
router.post("/LearnerLogin", learnerLogIn);

router.get("/Learners/:id", getLearners);
router.get("/Learner/:id", getLearnerDetail);
router.get("/Learner/Transcript/:id", getLearnerTranscript);
router.get("/Learner/Performance/:id", getLearnerPerformance);

router.delete("/Learners/:id", deleteLearners);
router.delete("/LearnersProgram/:id", deleteLearnersByProgram);
router.delete("/Learner/:id", deleteLearner);

router.put("/Learner/:id", updateLearner);
router.put("/UpdateAssessmentResult/:id", updateAssessmentResult);
router.put("/LearnerParticipation/:id", learnerParticipation);

router.put(
  "/RemoveAllLearnersModuleParticipation/:id",
  clearAllLearnersParticipationByModule,
);
router.put(
  "/RemoveAllLearnersParticipation/:id",
  clearAllLearnersParticipation,
);
router.put(
  "/RemoveLearnerModuleParticipation/:id",
  removeLearnerParticipationByModule,
);
router.put("/RemoveLearnerParticipation/:id", removeLearnerParticipation);

// ==================== FACULTY ROUTES (formerly Teacher) ====================
router.post("/FacultyReg", facultyRegister);
router.post("/FacultyLogin", facultyLogIn);

router.get("/Faculty/:id", getFaculty);
router.get("/FacultyDetail/:id", getFacultyDetail);
router.get("/FacultyWorkload/:id", getFacultyWorkload);

router.delete("/AllFaculty/:id", deleteAllFaculty);
router.delete("/FacultyProgram/:id", deleteFacultyByProgram);
router.delete("/Faculty/:id", deleteFaculty);

router.put("/FacultyModule", updateFacultyModule);
router.put("/Faculty/:id", updateFaculty);
router.put("/FacultySchedule", updateFacultySchedule);

router.post("/AllocateCourse", allocateCourse);
router.put("/RemoveCourseAllocation", removeCourseAllocation);

// ==================== ANNOUNCEMENT ROUTES (formerly Notice) ====================
router.post("/AnnouncementCreate", announcementCreate);
router.get("/Announcements/:id", announcementList);
router.get("/Announcement/:id", getAnnouncementDetail);
router.get(
  "/AnnouncementsByCategory/:id/:category",
  getAnnouncementsByCategory,
);
router.get(
  "/AnnouncementsByAudience/:id/:audience",
  getAnnouncementsByAudience,
);
router.get("/UrgentAnnouncements/:id", getUrgentAnnouncements);

router.delete("/Announcements/:id", deleteAnnouncements);
router.delete("/Announcement/:id", deleteAnnouncement);
router.put("/Announcement/:id", updateAnnouncement);
router.put("/DeactivateAnnouncement/:id", deactivateAnnouncement);

// Legacy routes for backward compatibility
router.post("/NoticeCreate", announcementCreate);
router.get("/NoticeList/:id", announcementList);

// ==================== FEEDBACK ROUTES (formerly Complain) ====================
router.post("/FeedbackCreate", feedbackCreate);
router.get("/FeedbackList/:id", feedbackList);
router.get("/Feedback/:id", getFeedbackDetail);
router.get("/FeedbackByType/:id/:type", getFeedbackByType);
router.get("/FeedbackByCategory/:id/:category", getFeedbackByCategory);
router.get("/FeedbackByStatus/:id/:status", getFeedbackByStatus);
router.get("/FeedbackStats/:id", getFeedbackStats);

router.put("/FeedbackStatus/:id", updateFeedbackStatus);
router.put("/RespondToFeedback/:id", respondToFeedback);
router.delete("/Feedback/:id", deleteFeedback);
router.delete("/Feedbacks/:id", deleteFeedbacks);

// Legacy routes for backward compatibility
router.post("/ComplainCreate", feedbackCreate);
router.get("/ComplainList/:id", feedbackList);

// ==================== PROGRAM ROUTES (formerly Sclass) ====================
router.post("/ProgramCreate", programCreate);
router.get("/Programs/:id", programList);
router.get("/Program/:id", getProgramDetail);
router.get("/Program/Learners/:id", getProgramLearners);
router.get("/ProgramsByType/:id/:type", getProgramsByType);
router.get("/ProgramStats/:id", getProgramStats);

router.put("/Program/:id", updateProgram);
router.put("/ProgramCurriculum/:id", updateProgramCurriculum);

router.delete("/Programs/:id", deletePrograms);
router.delete("/Program/:id", deleteProgram);

// Legacy routes for backward compatibility
const {
  sclassCreate,
  sclassList,
  getSclassDetail,
  getSclassStudents,
} = require("../controllers/class-controller.js");
router.post("/SclassCreate", programCreate); // Use new Program schema
router.get("/SclassList/:id", sclassList);
router.get("/Sclass/:id", getSclassDetail);
router.get("/Sclass/Students/:id", getSclassStudents);

// Module routes
router.post("/ModuleCreate", moduleCreate);
router.get("/Modules/:id", allModules);
router.get("/FreeModules/:id", freeModuleList);
router.get("/ProgramAllModules/:id", programModules); // Debug route - shows ALL modules for a program
router.get("/Module/:id", getModuleDetail);

router.put("/Module/:id", updateModule);
router.put("/ModuleSyllabus/:id", updateModuleSyllabus);
router.put("/ModuleSchedule/:id", updateModuleSchedule);
router.put("/AssignFaculty/:id", assignFacultyToModule);

router.delete("/Module/:id", deleteModule);
router.delete("/Modules/:id", deleteModules);
router.delete("/ModulesProgram/:id", deleteModulesByProgram);

// Legacy routes for backward compatibility
const {
  subjectCreate,
  allSubjects,
  classSubjects,
  freeSubjectList,
  getSubjectDetail,
} = require("../controllers/subject-controller.js");
router.post("/SubjectCreate", subjectCreate);
router.get("/AllSubjects/:id", allSubjects);
router.get("/ClassSubjects/:id", classSubjects);
router.get("/FreeSubjectList/:id", freeSubjectList);
router.get("/Subject/:id", getSubjectDetail);

// ==================== ASSESSMENT ROUTES (new) ====================
router.post("/AssessmentCreate", assessmentCreate);
router.get("/Assessments/:id", assessmentList);
router.get("/AssessmentsByModule/:id", getAssessmentsByModule);
router.get("/AssessmentsByProgram/:id", getAssessmentsByProgram);
router.get("/Assessment/:id", getAssessmentDetail);
router.get("/AssessmentStats/:id", getAssessmentStats);

router.put("/Assessment/:id", updateAssessment);
router.put("/PublishAssessment/:id", publishAssessment);
router.put("/SubmitAssessment/:id", submitAssessment);
router.put("/GradeSubmission/:id", gradeSubmission);

router.delete("/Assessment/:id", deleteAssessment);
router.delete("/Assessments/:id", deleteAssessments);

// ==================== LEGACY ROUTES FOR LEARNER/FACULTY ====================
// Map old Student endpoints to new Learner endpoints
router.get("/Students/:id", getLearners);
router.get("/Student/:id", getLearnerDetail);
router.delete("/Student/:id", deleteLearner);
router.delete("/Students/:id", deleteLearners);
router.put("/Student/:id", updateLearner);

// Map old Teacher endpoints to new Faculty endpoints
router.get("/Teachers/:id", getFaculty);
router.get("/Teacher/:id", getFacultyDetail);
router.delete("/Teacher/:id", deleteFaculty);
router.delete("/Teachers/:id", deleteAllFaculty);
router.put("/Teacher/:id", updateFaculty);

// ==================== ACADEMIC CALENDAR ROUTES (new) ====================
router.post("/CalendarCreate", calendarCreate);
router.get("/Calendars/:id", calendarList);
router.get("/Calendar/:id", getCalendarDetail);
router.get("/CurrentCalendar/:id", getCurrentCalendar);
router.get("/UpcomingEvents/:id", getUpcomingEvents);
router.get("/EventsByType/:id/:type", getEventsByType);

router.put("/AddEvent/:id", addEvent);
router.put("/UpdateEvent/:id", updateEvent);
router.put("/RemoveEvent/:id", removeEvent);
router.put("/AddHoliday/:id", addHoliday);
router.put("/UpdateSchedule/:id", updateSchedule);

router.delete("/Calendar/:id", deleteCalendar);
router.delete("/Calendars/:id", deleteCalendars);

module.exports = router;
