import * as React from "react";
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
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import bgpic from "../../assets/designlogin.jpg";
import { LightPurpleButton } from "../../components/buttonStyles";
import { registerUser } from "../../redux/userRelated/userHandle";
import styled from "styled-components";
import Popup from "../../components/Popup";

const defaultTheme = createTheme();

const AdminRegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, currentUser, response, error, currentRole } = useSelector(
    (state) => state.user,
  );

  const [toggle, setToggle] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [adminNameError, setAdminNameError] = useState(false);
  const [institutionNameError, setInstitutionNameError] = useState(false);
  const role = "Admin";

  const handleSubmit = (event) => {
    event.preventDefault();

    const name = event.target.adminName.value;
    const schoolName = event.target.institutionName.value;
    const email = event.target.email.value;
    const password = event.target.password.value;

    if (!name || !schoolName || !email || !password) {
      if (!name) setAdminNameError(true);
      if (!schoolName) setInstitutionNameError(true);
      if (!email) setEmailError(true);
      if (!password) setPasswordError(true);
      return;
    }

    const fields = { name, email, password, role, schoolName };
    setLoader(true);
    dispatch(registerUser(fields, role));
  };

  const handleInputChange = (event) => {
    const { name } = event.target;
    if (name === "email") setEmailError(false);
    if (name === "password") setPasswordError(false);
    if (name === "adminName") setAdminNameError(false);
    if (name === "institutionName") setInstitutionNameError(false);
  };

  useEffect(() => {
    if (
      status === "success" ||
      (currentUser !== null && currentRole === "Admin")
    ) {
      navigate("/Admin/dashboard");
    } else if (status === "failed") {
      setMessage(response);
      setShowPopup(true);
      setLoader(false);
    } else if (status === "error") {
      console.log(error);
    }
  }, [status, currentUser, currentRole, navigate, error, response]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <BlurCircleWrapper>
            <svg width="340" height="340" viewBox="0 0 340 340" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="170" cy="170" r="140" fill="url(#paint0_radial_1_1)" fillOpacity="0.7"/>
                <defs>
                    <radialGradient id="paint0_radial_1_1" cx="0" cy="0" r="1" gradientTransform="translate(170 170) scale(140)" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#43cea2"/>
                        <stop offset="0.7" stopColor="#1a73e8"/>
                        <stop offset="1" stopColor="#7f56da"/> 
                    </radialGradient>
                </defs>
            </svg>
          </BlurCircleWrapper>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: 'relative',
              zIndex: 1
            }}
          >
            <Typography variant="h4" sx={{ mb: 2, color: "#2c2143" }}>
              Administrator Registration
            </Typography>
            <Typography variant="h7">
              Create your academic institution by registering as an
              administrator.
              <br />
              You will be able to add learners and faculty and manage the
              system.
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 2 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="adminName"
                label="Enter your name"
                name="adminName"
                autoComplete="name"
                autoFocus
                error={adminNameError}
                helperText={adminNameError && "Name is required"}
                onChange={handleInputChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="institutionName"
                label="Create your institution name"
                name="institutionName"
                autoComplete="off"
                error={institutionNameError}
                helperText={
                  institutionNameError && "Institution name is required"
                }
                onChange={handleInputChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Enter your email"
                name="email"
                autoComplete="email"
                error={emailError}
                helperText={emailError && "Email is required"}
                onChange={handleInputChange}
              />
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
              </Grid>
              <LightPurpleButton
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {loader ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Register"
                )}
              </LightPurpleButton>
              <Grid container>
                <Grid>Already have an account?</Grid>
                <Grid item sx={{ ml: 2 }}>
                  <StyledLink to="/Adminlogin">Log in</StyledLink>
                </Grid>
              </Grid>
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
      </Grid>
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </ThemeProvider>
  );
};

export default AdminRegisterPage;

const StyledLink = styled(Link)`
  margin-top: 9px;
  text-decoration: none;
  color: #7f56da;
`;

const BlurCircleWrapper = styled.div`
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 0;
  filter: blur(48px);
  pointer-events: none;
  opacity: 0.7;
`;
