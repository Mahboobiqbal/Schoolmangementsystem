import React, { useState } from "react";
import { Box, CssBaseline, useMediaQuery } from "@mui/material";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import theme from "../../theme/theme";

// Layout Components
import Sidebar, {
  DRAWER_WIDTH,
  DRAWER_WIDTH_COLLAPSED,
} from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

// Icons
import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import GradingIcon from "@mui/icons-material/Grading";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CampaignIcon from "@mui/icons-material/Campaign";
import FeedbackIcon from "@mui/icons-material/Feedback";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

// Auth
import Logout from "../Logout";
import { authLogout } from "../../redux/userRelated/userSlice";

// Admin Pages
import AdminProfile from "./AdminProfile";
import AdminHomePage from "./AdminHomePage";

// Learner Related
import AddStudent from "./studentRelated/AddStudent";
import SeeComplains from "./studentRelated/SeeComplains";
import ShowStudents from "./studentRelated/ShowStudents";
import StudentAttendance from "./studentRelated/StudentAttendance";
import StudentExamMarks from "./studentRelated/StudentExamMarks";
import ViewStudent from "./studentRelated/ViewStudent";

// Announcement Related
import AddNotice from "./noticeRelated/AddNotice";
import ShowNotices from "./noticeRelated/ShowNotices";

// Module Related
import ShowSubjects from "./subjectRelated/ShowSubjects";
import SubjectForm from "./subjectRelated/SubjectForm";
import ViewSubject from "./subjectRelated/ViewSubject";

// Faculty Related
import AddTeacher from "./teacherRelated/AddTeacher";
import ChooseClass from "./teacherRelated/ChooseClass";
import ChooseSubject from "./teacherRelated/ChooseSubject";
import ShowTeachers from "./teacherRelated/ShowTeachers";
import TeacherDetails from "./teacherRelated/TeacherDetails";

// Program Related
import AddClass from "./classRelated/AddClass";
import ClassDetails from "./classRelated/ClassDetails";
import ShowClasses from "./classRelated/ShowClasses";

// Styled Components
const MainContent = styled("main", {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  flexGrow: 1,
  minHeight: "100vh",
  backgroundColor: "#F8FAFC",
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
  paddingTop: 70,
  width: `calc(100% - ${DRAWER_WIDTH_COLLAPSED}px)`,
  [theme.breakpoints.up("sm")]: {
    width: open
      ? `calc(100% - ${DRAWER_WIDTH}px)`
      : `calc(100% - ${DRAWER_WIDTH_COLLAPSED}px)`,
  },
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: "100%",
  margin: "0 auto",
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  [theme.breakpoints.up("lg")]: {
    padding: theme.spacing(4, 6),
  },
}));

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const handleToggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleLogout = () => {
    dispatch(authLogout());
    navigate("/");
  };
  const handleProfileClick = () => navigate("/Admin/profile");
  const handleSettingsClick = () => navigate("/Admin/profile");

  // Menu sections for the sidebar
  const menuSections = [
    {
      title: "Main",
      items: [
        { id: "dashboard", label: "Dashboard", path: "/", icon: <HomeIcon /> },
        {
          id: "programs",
          label: "Programs",
          path: "/Admin/programs",
          icon: <SchoolIcon />,
        },
        {
          id: "modules",
          label: "Modules",
          path: "/Admin/modules",
          icon: <MenuBookIcon />,
        },
        {
          id: "faculty",
          label: "Faculty",
          path: "/Admin/faculty",
          icon: <PeopleIcon />,
        },
        {
          id: "learners",
          label: "Learners",
          path: "/Admin/learners",
          icon: <PersonIcon />,
        },
      ],
    },
    {
      title: "Academic",
      items: [
        {
          id: "assessments",
          label: "Assessments",
          path: "/Admin/assessments",
          icon: <GradingIcon />,
        },
        {
          id: "calendar",
          label: "Academic Calendar",
          path: "/Admin/calendar",
          icon: <CalendarMonthIcon />,
        },
      ],
    },
    {
      title: "Communication",
      items: [
        {
          id: "announcements",
          label: "Announcements",
          path: "/Admin/announcements",
          icon: <CampaignIcon />,
        },
        {
          id: "feedback",
          label: "Feedback",
          path: "/Admin/feedback",
          icon: <FeedbackIcon />,
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          id: "profile",
          label: "My Profile",
          path: "/Admin/profile",
          icon: <AccountCircleIcon />,
        },
        {
          id: "settings",
          label: "Settings",
          path: "/Admin/settings",
          icon: <SettingsIcon />,
        },
      ],
    },
  ];

  // User data for navbar and sidebar
  const user = {
    name: currentUser?.name || "Admin",
    email: currentUser?.email || "admin@institution.edu",
    role: "Administrator",
    avatar: null,
  };

  // Sample notifications
  const notifications = [
    {
      title: "New learner enrolled in Computer Science",
      time: "2 hours ago",
      read: false,
    },
    {
      title: "Faculty meeting scheduled for tomorrow",
      time: "5 hours ago",
      read: false,
    },
    { title: "Assessment results published", time: "1 day ago", read: true },
  ];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", overflow: "hidden" }}>
      <CssBaseline />

      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onToggle={handleToggleSidebar}
        sections={menuSections}
        user={user}
        logo="A"
        title="AMS"
      />

      {/* Navbar */}
      <Navbar
        open={sidebarOpen}
        onMenuClick={handleToggleSidebar}
        user={user}
        onLogout={handleLogout}
        onProfileClick={handleProfileClick}
        onSettingsClick={handleSettingsClick}
        notifications={notifications}
        pageTitle=""
      />

      {/* Main Content */}
      <MainContent open={sidebarOpen}>
        <ContentWrapper>
          <Routes>
            {/* Dashboard */}
            <Route path="/" element={<AdminHomePage />} />
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/Admin/dashboard" element={<AdminHomePage />} />
            <Route path="/Admin/profile" element={<AdminProfile />} />

            {/* Feedback (formerly Complains) */}
            <Route path="/Admin/feedback" element={<SeeComplains />} />
            <Route path="/Admin/complains" element={<SeeComplains />} />

            {/* Announcements (formerly Notices) */}
            <Route path="/Admin/addannouncement" element={<AddNotice />} />
            <Route path="/Admin/announcements" element={<ShowNotices />} />
            <Route path="/Admin/addnotice" element={<AddNotice />} />
            <Route path="/Admin/notices" element={<ShowNotices />} />

            <Route
              path="/Admin/subject/student/attendance/:studentID/:subjectID"
              element={<StudentAttendance situation="Subject" />}
            />
            <Route
              path="/Admin/module/learner/marks/:learnerID/:moduleID"
              element={<StudentExamMarks situation="Subject" />}
            />
            <Route
              path="/Admin/subject/student/marks/:studentID/:subjectID"
              element={<StudentExamMarks situation="Subject" />}
            />

            {/* Programs (formerly Classes) */}
            <Route path="/Admin/addprogram" element={<AddClass />} />
            <Route path="/Admin/addclass" element={<AddClass />} />
            <Route path="/Admin/programs" element={<ShowClasses />} />
            <Route path="/Admin/classes" element={<ShowClasses />} />
            <Route
              path="/Admin/programs/program/:id"
              element={<ClassDetails />}
            />
            <Route path="/Admin/classes/class/:id" element={<ClassDetails />} />
            <Route
              path="/Admin/program/addlearners/:id"
              element={<AddStudent situation="Class" />}
            />
            <Route
              path="/Admin/class/addstudents/:id"
              element={<AddStudent situation="Class" />}
            />

            {/* Learners (formerly Students) */}
            <Route
              path="/Admin/addlearners"
              element={<AddStudent situation="Student" />}
            />
            <Route
              path="/Admin/addstudents"
              element={<AddStudent situation="Student" />}
            />
            <Route path="/Admin/learners" element={<ShowStudents />} />
            <Route path="/Admin/students" element={<ShowStudents />} />
            <Route
              path="/Admin/learners/learner/:id"
              element={<ViewStudent />}
            />
            <Route
              path="/Admin/students/student/:id"
              element={<ViewStudent />}
            />
            <Route
              path="/Admin/learners/learner/participation/:id"
              element={<StudentAttendance situation="Student" />}
            />
            <Route
              path="/Admin/students/student/attendance/:id"
              element={<StudentAttendance situation="Student" />}
            />
            <Route
              path="/Admin/learners/learner/marks/:id"
              element={<StudentExamMarks situation="Student" />}
            />
            <Route
              path="/Admin/students/student/marks/:id"
              element={<StudentExamMarks situation="Student" />}
            />

            {/* Modules (formerly Subjects) */}
            <Route path="/Admin/modules" element={<ShowSubjects />} />
            <Route path="/Admin/subjects" element={<ShowSubjects />} />
            <Route
              path="/Admin/modules/module/:programID/:moduleID"
              element={<ViewSubject />}
            />
            <Route
              path="/Admin/subjects/subject/:classID/:subjectID"
              element={<ViewSubject />}
            />
            <Route
              path="/Admin/modules/chooseprogram"
              element={<ChooseClass situation="Subject" />}
            />
            <Route
              path="/Admin/subjects/chooseclass"
              element={<ChooseClass situation="Subject" />}
            />
            <Route path="/Admin/addmodule/:id" element={<SubjectForm />} />
            <Route path="/Admin/addsubject/:id" element={<SubjectForm />} />
            <Route
              path="/Admin/program/module/:programID/:moduleID"
              element={<ViewSubject />}
            />
            <Route
              path="/Admin/class/subject/:classID/:subjectID"
              element={<ViewSubject />}
            />
            <Route
              path="/Admin/module/learner/participation/:learnerID/:moduleID"
              element={<StudentAttendance situation="Subject" />}
            />

            {/* Faculty (formerly Teachers) */}
            <Route path="/Admin/faculty" element={<ShowTeachers />} />
            <Route path="/Admin/teachers" element={<ShowTeachers />} />
            <Route
              path="/Admin/faculty/member/:id"
              element={<TeacherDetails />}
            />
            <Route
              path="/Admin/teachers/teacher/:id"
              element={<TeacherDetails />}
            />
            <Route
              path="/Admin/faculty/chooseprogram"
              element={<ChooseClass situation="Teacher" />}
            />
            <Route
              path="/Admin/teachers/chooseclass"
              element={<ChooseClass situation="Teacher" />}
            />
            <Route
              path="/Admin/faculty/choosemodule/:id"
              element={<ChooseSubject situation="Norm" />}
            />
            <Route
              path="/Admin/teachers/choosesubject/:id"
              element={<ChooseSubject situation="Norm" />}
            />
            <Route
              path="/Admin/faculty/choosemodule/:programID/:facultyID"
              element={<ChooseSubject situation="Teacher" />}
            />
            <Route
              path="/Admin/teachers/choosesubject/:classID/:teacherID"
              element={<ChooseSubject situation="Teacher" />}
            />
            <Route
              path="/Admin/faculty/addfaculty/:id"
              element={<AddTeacher />}
            />
            <Route
              path="/Admin/teachers/addteacher/:id"
              element={<AddTeacher />}
            />

            <Route path="/logout" element={<Logout />} />
          </Routes>
        </ContentWrapper>
      </MainContent>
    </Box>
  );
};

export default AdminDashboard;
