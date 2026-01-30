import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./userRelated/userSlice";
import { learnerReducer } from "./learnerRelated/learnerSlice";
import { facultyReducer } from "./facultyRelated/facultySlice";
import { programReducer } from "./programRelated/programSlice";
import { assessmentReducer } from "./assessmentRelated/assessmentSlice";
import { announcementReducer } from "./announcementRelated/announcementSlice";

// Legacy imports for backward compatibility
import { studentReducer } from "./studentRelated/studentSlice";
import { noticeReducer } from "./noticeRelated/noticeSlice";
import { sclassReducer } from "./sclassRelated/sclassSlice";
import { teacherReducer } from "./teacherRelated/teacherSlice";
import { complainReducer } from "./complainRelated/complainSlice";

const store = configureStore({
  reducer: {
    // New academic system reducers
    user: userReducer,
    learner: learnerReducer,
    faculty: facultyReducer,
    program: programReducer,
    assessment: assessmentReducer,
    announcement: announcementReducer,

    // Legacy reducers for backward compatibility
    student: studentReducer,
    teacher: teacherReducer,
    notice: noticeReducer,
    complain: complainReducer,
    sclass: sclassReducer,
  },
});

export default store;
