import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Paper,
  Box,
  Container,
  CircularProgress,
  Backdrop,
  Typography,
} from '@mui/material';
import { AccountCircle, School, Group } from '@mui/icons-material';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/userRelated/userHandle';
import Popup from '../components/Popup';

const ChooseUser = ({ visitor }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const password = "zxc";

  const { status, currentUser, currentRole } = useSelector(state => state.user);

  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const navigateHandler = (user) => {
    if (user === "Admin") {
      if (visitor === "guest") {
        const email = "yogendra@12";
        const fields = { email, password };
        setLoader(true);
        dispatch(loginUser(fields, user));
      }
      else {
        navigate('/Adminlogin');
      }
    }
    else if (user === "Student") {
      if (visitor === "guest") {
        const rollNum = "1";
        const studentName = "Dipesh Awasthi";
        const fields = { rollNum, studentName, password };
        setLoader(true);
        dispatch(loginUser(fields, user));
      }
      else {
        navigate('/Studentlogin');
      }
    }
    else if (user === "Teacher") {
      if (visitor === "guest") {
        const email = "tony@12";
        const fields = { email, password };
        setLoader(true);
        dispatch(loginUser(fields, user));
      }
      else {
        navigate('/Teacherlogin');
      }
    }
  };

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
    else if (status === 'error') {
      setLoader(false);
      setMessage("Network Error");
      setShowPopup(true);
    }
  }, [status, currentRole, navigate, currentUser]);

  return (
    <StyledContainer>
      <Container maxWidth="md">
        <Box mb={6} textAlign="center">
          <Typography variant="h3" sx={{ color: "#fff", fontWeight: 700, letterSpacing: 1, mb: 1 }}>
            Choose User Type
          </Typography>
          <Typography variant="subtitle1" sx={{ color: "rgba(255,255,255,0.7)" }}>
            Select your role to continue to the dashboard
          </Typography>
        </Box>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <StyledPaper elevation={6} onClick={() => navigateHandler("Admin")}>
              <Box className="icon-circle" mb={2}>
                <AccountCircle fontSize="inherit" />
              </Box>
              <StyledTypography>Admin</StyledTypography>
              <StyledDesc>
                Login as an administrator to access the dashboard and manage app data.
              </StyledDesc>
            </StyledPaper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StyledPaper elevation={6} onClick={() => navigateHandler("Student")}>
              <Box className="icon-circle student" mb={2}>
                <School fontSize="inherit" />
              </Box>
              <StyledTypography>Student</StyledTypography>
              <StyledDesc>
                Login as a student to explore course materials and assignments.
              </StyledDesc>
            </StyledPaper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StyledPaper elevation={6} onClick={() => navigateHandler("Teacher")}>
              <Box className="icon-circle teacher" mb={2}>
                <Group fontSize="inherit" />
              </Box>
              <StyledTypography>Teacher</StyledTypography>
              <StyledDesc>
                Login as a teacher to create courses, assignments, and track student progress.
              </StyledDesc>
            </StyledPaper>
          </Grid>
        </Grid>
      </Container>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loader}
      >
        <CircularProgress color="inherit" />
        <span style={{ marginLeft: 16 }}>Please Wait</span>
      </Backdrop>
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </StyledContainer>
  );
};

export default ChooseUser;

const StyledContainer = styled.div`
  background: linear-gradient(to bottom, #411d70, #19118b 90%);
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 3rem 1rem 2rem 1rem;
`;

const StyledPaper = styled(Paper)`
  padding: 2.5rem 1.5rem 2rem 1.5rem;
  text-align: center;
  background-color: #1f1f38 !important;
  color: rgba(255, 255, 255, 0.85);
  cursor: pointer;
  border-radius: 1.5rem !important;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.25);
  transition: background 0.2s, color 0.2s, box-shadow 0.2s, transform 0.15s;
  position: relative;
  &:hover {
    background: #2c2c6c !important;
    color: #fff;
    box-shadow: 0 12px 36px 0 rgba(31, 38, 135, 0.35);
    transform: translateY(-4px) scale(1.03);
  }
  .icon-circle {
    background: linear-gradient(135deg, #7c3aed 60%, #19118b 100%);
    color: #fff;
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem auto;
    border-radius: 50%;
    font-size: 2.5rem;
    box-shadow: 0 4px 16px 0 rgba(124, 58, 237, 0.25);
    transition: background 0.2s;
  }
  .icon-circle.student {
    background: linear-gradient(135deg, #2563eb 60%, #19118b 100%);
  }
  .icon-circle.teacher {
    background: linear-gradient(135deg, #059669 60%, #19118b 100%);
  }
`;

const StyledTypography = styled.h2`
  margin-bottom: 0.5rem;
  font-size: 1.6rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.5px;
`;

const StyledDesc = styled.p`
  color: rgba(255,255,255,0.7);
  font-size: 1rem;
  margin: 0;
  margin-top: 0.5rem;
  line-height: 1.5;
`;