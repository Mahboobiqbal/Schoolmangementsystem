import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Grid,
  Box,
  Typography,
  Paper,
  Checkbox,
  FormControlLabel,
  TextField,
  CssBaseline,
  IconButton,
  InputAdornment,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import bgpic from "../assets/designlogin.jpg";
import { PrimaryButton, SecondaryButton } from "../components/ui/Buttons";
import { loginUser } from "../redux/userRelated/userHandle";
import Popup from "../components/Popup";

const LoginPage = ({ role }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, currentUser, response, error, currentRole } = useSelector(
    (state) => state.user,
  );

  const [toggle, setToggle] = useState(false);
  const [guestLoader, setGuestLoader] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [enrollmentIdError, setEnrollmentIdError] = useState(false);
  const [learnerNameError, setLearnerNameError] = useState(false);

  // Map new roles to legacy roles for API compatibility
  const isLearnerRole = role === "Student" || role === "Learner";
  const isFacultyRole = role === "Teacher" || role === "Faculty";
  const displayRole = isLearnerRole
    ? "Learner"
    : isFacultyRole
      ? "Faculty"
      : role;

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isLearnerRole) {
      const enrollmentId = event.target.enrollmentId.value;
      const learnerName = event.target.learnerName.value;
      const password = event.target.password.value;

      if (!enrollmentId || !learnerName || !password) {
        if (!enrollmentId) setEnrollmentIdError(true);
        if (!learnerName) setLearnerNameError(true);
        if (!password) setPasswordError(true);
        return;
      }
      const fields = { enrollmentId, learnerName, password };
      setLoader(true);
      dispatch(loginUser(fields, "Learner"));
    } else {
      const email = event.target.email.value;
      const password = event.target.password.value;

      if (!email || !password) {
        if (!email) setEmailError(true);
        if (!password) setPasswordError(true);
        return;
      }

      const fields = { email, password };
      setLoader(true);
      dispatch(loginUser(fields, isFacultyRole ? "Faculty" : role));
    }
  };

  const handleInputChange = (event) => {
    const { name } = event.target;
    if (name === "email") setEmailError(false);
    if (name === "password") setPasswordError(false);
    if (name === "enrollmentId") setEnrollmentIdError(false);
    if (name === "learnerName") setLearnerNameError(false);
  };

  const guestModeHandler = () => {
    const password = "password123";

    if (role === "Admin") {
      const email = "admin@test.com";
      const fields = { email, password };
      setGuestLoader(true);
      dispatch(loginUser(fields, role));
    } else if (isLearnerRole) {
      const enrollmentId = "L001";
      const learnerName = "John Learner";
      const fields = { enrollmentId, learnerName, password };
      setGuestLoader(true);
      dispatch(loginUser(fields, "Learner"));
    } else if (isFacultyRole) {
      const email = "professor@test.com";
      const fields = { email, password };
      setGuestLoader(true);
      dispatch(loginUser(fields, "Faculty"));
    }
  };

  useEffect(() => {
    if (status === "success" || currentUser !== null) {
      if (currentRole === "Admin") {
        navigate("/Admin/dashboard");
      } else if (currentRole === "Student" || currentRole === "Learner") {
        navigate("/Learner/dashboard");
      } else if (currentRole === "Teacher" || currentRole === "Faculty") {
        navigate("/Faculty/dashboard");
      }
    } else if (status === "failed") {
      setMessage(response);
      setShowPopup(true);
      setLoader(false);
    } else if (status === "error") {
      setMessage("Network Error");
      setShowPopup(true);
      setLoader(false);
      setGuestLoader(false);
    }
  }, [status, currentRole, navigate, error, response, currentUser]);

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <CssBaseline />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
            {displayRole} Login
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back! Please enter your details
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 2, width: "100%" }}
          >
            {isLearnerRole ? (
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="enrollmentId"
                  label="Enter your Enrollment ID"
                  name="enrollmentId"
                  autoComplete="off"
                  type="text"
                  autoFocus
                  error={enrollmentIdError}
                  helperText={enrollmentIdError && "Enrollment ID is required"}
                  onChange={handleInputChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="learnerName"
                  label="Enter your name"
                  name="learnerName"
                  autoComplete="name"
                  autoFocus
                  error={learnerNameError}
                  helperText={learnerNameError && "Name is required"}
                  onChange={handleInputChange}
                />
              </>
            ) : (
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Enter your email"
                name="email"
                autoComplete="email"
                autoFocus
                error={emailError}
                helperText={emailError && "Email is required"}
                onChange={handleInputChange}
              />
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={toggle ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              error={passwordError}
              helperText={passwordError && "Password is required"}
              onChange={handleInputChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setToggle(!toggle)}>
                      {toggle ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Grid
              container
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Link
                to="#"
                style={{
                  marginTop: "9px",
                  textDecoration: "none",
                  color: "#4F46E5",
                }}
              >
                Forgot password?
              </Link>
            </Grid>
            <PrimaryButton type="submit" fullWidth sx={{ mt: 3 }}>
              {loader ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Login"
              )}
            </PrimaryButton>
            <SecondaryButton
              fullWidth
              onClick={guestModeHandler}
              sx={{ mt: 2, mb: 3 }}
            >
              Login as Guest
            </SecondaryButton>
            {role === "Admin" && (
              <Grid container>
                <Grid>Don't have an account?</Grid>
                <Grid item sx={{ ml: 2 }}>
                  <Link
                    to="/Adminregister"
                    style={{
                      textDecoration: "none",
                      color: "#4F46E5",
                      fontWeight: 600,
                    }}
                  >
                    Sign up
                  </Link>
                </Grid>
              </Grid>
            )}
          </Box>
        </Box>
      </Grid>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: `url(${bgpic})`,
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={guestLoader}
      >
        <CircularProgress color="primary" />
        Please Wait
      </Backdrop>
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </Grid>
  );
};

export default LoginPage;
