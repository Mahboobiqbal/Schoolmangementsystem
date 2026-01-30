import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import theme from "./theme/theme";
import Homepage from "./pages/Homepage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import LearnerDashboard from "./pages/student/StudentDashboard";
import FacultyDashboard from "./pages/teacher/TeacherDashboard";
import LoginPage from "./pages/LoginPage";
import AdminRegisterPage from "./pages/admin/AdminRegisterPage";
import ChooseUser from "./pages/ChooseUser";

const App = () => {
  const { currentRole } = useSelector((state) => state.user);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {currentRole === null && (
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/choose" element={<ChooseUser visitor="normal" />} />
            <Route
              path="/chooseasguest"
              element={<ChooseUser visitor="guest" />}
            />

            <Route path="/Adminlogin" element={<LoginPage role="Admin" />} />
            <Route
              path="/Learnerlogin"
              element={<LoginPage role="Learner" />}
            />
            <Route
              path="/Facultylogin"
              element={<LoginPage role="Faculty" />}
            />

            {/* Legacy routes for backward compatibility */}
            <Route
              path="/Studentlogin"
              element={<LoginPage role="Learner" />}
            />
            <Route
              path="/Teacherlogin"
              element={<LoginPage role="Faculty" />}
            />

            <Route path="/Adminregister" element={<AdminRegisterPage />} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}

        {currentRole === "Admin" && (
          <>
            <AdminDashboard />
          </>
        )}

        {(currentRole === "Learner" || currentRole === "Student") && (
          <>
            <LearnerDashboard />
          </>
        )}

        {(currentRole === "Faculty" || currentRole === "Teacher") && (
          <>
            <FacultyDashboard />
          </>
        )}
      </Router>
    </ThemeProvider>
  );
};

export default App;
