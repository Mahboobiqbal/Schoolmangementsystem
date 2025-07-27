import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
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
  Backdrop
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import bgpic from "../assets/designlogin.jpg"
import { LightPurpleButton } from '../components/buttonStyles';
import styled from 'styled-components';
import { loginUser } from '../redux/userRelated/userHandle';
import Popup from '../components/Popup';

const defaultTheme = createTheme();

const LoginPage = ({ role }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, currentUser, response, error, currentRole } = useSelector(state => state.user);

  const [toggle, setToggle] = useState(false);
  const [guestLoader, setGuestLoader] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [rollNumberError, setRollNumberError] = useState(false);
  const [studentNameError, setStudentNameError] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (role === "Student") {
      const rollNum = event.target.rollNumber.value;
      const studentName = event.target.studentName.value;
      const password = event.target.password.value;

      if (!rollNum || !studentName || !password) {
        if (!rollNum) setRollNumberError(true);
        if (!studentName) setStudentNameError(true);
        if (!password) setPasswordError(true);
        return;
      }
      const fields = { rollNum, studentName, password }
      setLoader(true)
      dispatch(loginUser(fields, role))
    }
    else {
      const email = event.target.email.value;
      const password = event.target.password.value;

      if (!email || !password) {
        if (!email) setEmailError(true);
        if (!password) setPasswordError(true);
        return;
      }

      const fields = { email, password }
      setLoader(true)
      dispatch(loginUser(fields, role))
    }
  };

  const handleInputChange = (event) => {
    const { name } = event.target;
    if (name === 'email') setEmailError(false);
    if (name === 'password') setPasswordError(false);
    if (name === 'rollNumber') setRollNumberError(false);
    if (name === 'studentName') setStudentNameError(false);
  };

  const guestModeHandler = () => {
    const password = "zxc"

    if (role === "Admin") {
      const email = "yogendra@12"
      const fields = { email, password }
      setGuestLoader(true)
      dispatch(loginUser(fields, role))
    }
    else if (role === "Student") {
      const rollNum = "1"
      const studentName = "Dipesh Awasthi"
      const fields = { rollNum, studentName, password }
      setGuestLoader(true)
      dispatch(loginUser(fields, role))
    }
    else if (role === "Teacher") {
      const email = "tony@12"
      const fields = { email, password }
      setGuestLoader(true)
      dispatch(loginUser(fields, role))
    }
  }

  useEffect(() => {
    if (status === 'success' || currentUser !== null) {
      if (currentRole === 'Admin') {
        navigate('/Admin/dashboard');
      }
      else if (currentRole === 'Student') {
        navigate('/Student/dashboard');
      } else if (currentRole === 'Teacher') {
        navigate('/Teacher/dashboard');
      }
    }
    else if (status === 'failed') {
      setMessage(response)
      setShowPopup(true)
      setLoader(false)
    }
    else if (status === 'error') {
      setMessage("Network Error")
      setShowPopup(true)
      setLoader(false)
      setGuestLoader(false)
    }
  }, [status, currentRole, navigate, error, response, currentUser]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          elevation={8}
          square
          sx={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255,255,255,0.95)',
            borderRadius: { md: '2rem 0 0 2rem', xs: 0 },
            boxShadow: { md: '0 8px 32px 0 rgba(31,38,135,0.25)', xs: 'none' },
          }}
        >
          <Box
            sx={{
              mx: { xs: 2, sm: 6, md: 8 },
              my: { xs: 4, md: 8 },
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography variant="h4" sx={{ mb: 2, color: "#2c2143", fontWeight: 700, letterSpacing: 1 }}>
              {role} Login
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "#7f56da", mb: 2 }}>
              Welcome back! Please enter your details
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
              {role === "Student" ? (
                <>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="rollNumber"
                    label="Roll Number"
                    name="rollNumber"
                    autoComplete="off"
                    type="number"
                    autoFocus
                    error={rollNumberError}
                    helperText={rollNumberError && 'Roll Number is required'}
                    onChange={handleInputChange}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="studentName"
                    label="Name"
                    name="studentName"
                    autoComplete="name"
                    error={studentNameError}
                    helperText={studentNameError && 'Name is required'}
                    onChange={handleInputChange}
                  />
                </>
              ) : (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  error={emailError}
                  helperText={emailError && 'Email is required'}
                  onChange={handleInputChange}
                />
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={toggle ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                error={passwordError}
                helperText={passwordError && 'Password is required'}
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
              <Grid container sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
                <StyledLink href="#">
                  Forgot password?
                </StyledLink>
              </Grid>
              <LightPurpleButton
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  py: 1.5,
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  letterSpacing: 0.5,
                  borderRadius: "1rem"
                }}
              >
                {loader ?
                  <CircularProgress size={24} color="inherit" />
                  : "Login"}
              </LightPurpleButton>
              <Button
                fullWidth
                onClick={guestModeHandler}
                variant="outlined"
                sx={{
                  mt: 2,
                  mb: 3,
                  color: "#7f56da",
                  borderColor: "#7f56da",
                  borderRadius: "1rem",
                  fontWeight: 600,
                  letterSpacing: 0.5
                }}
              >
                Login as Guest
              </Button>
              {role === "Admin" &&
                <Grid container justifyContent="center" alignItems="center" sx={{ mt: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Don't have an account?
                  </Typography>
                  <StyledLink to="/Adminregister" style={{ marginLeft: 8 }}>
                    Sign up
                  </StyledLink>
                </Grid>
              }
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
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: { md: '0 2rem 2rem 0', xs: 0 },
            boxShadow: { md: '0 8px 32px 0 rgba(31,38,135,0.15)', xs: 'none' },
          }}
        />
      </Grid>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={guestLoader}
      >
        <CircularProgress color="primary" />
        <span style={{ marginLeft: 16 }}>Please Wait</span>
      </Backdrop>
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </ThemeProvider>
  );
}

export default LoginPage

const StyledLink = styled(Link)`
  margin-top: 9px;
  text-decoration: none;
  color: #7f56da;
  font-weight: 600;
  font-size: 1rem;
  transition: color 0.2s;
  &:hover {
    color: #411d70;
    text-decoration: underline;
  }
`;