import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Box, Button } from '@mui/material';
import styled from 'styled-components';
import Students from "../assets/students.svg";
import { LightPurpleButton } from '../components/buttonStyles';
import { styled as muiStyled } from '@mui/material/styles';

const ModernButton = muiStyled(Button)({
    background: "linear-gradient(90deg, #1a73e8 0%, #43cea2 100%)",
    color: "#fff",
    fontWeight: 700,
    fontSize: "1.1rem",
    borderRadius: "12px",
    padding: "12px 0",
    boxShadow: "0 4px 16px rgba(26,115,232,0.08)",
    textTransform: "none",
    fontFamily: "'Inter', sans-serif",
    '&:hover': {
        background: "linear-gradient(90deg, #43cea2 0%, #1a73e8 100%)",
        boxShadow: "0 6px 24px rgba(26,115,232,0.12)",
    },
});

const Homepage = () => {
    return (
        <StyledContainer>
            <Grid container spacing={0}>
                <Grid item xs={12} md={6}>
                    <img src={Students} alt="students" style={{ width: '100%' }} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <StyledPaper elevation={3}>
                        <StyledTitle>
                            Welcome to
                            <br />
                            School Management
                            <br />
                            System
                        </StyledTitle>
                        <StyledText>
                            Streamline school management, class organization, and add students and faculty.
                            Seamlessly track attendance, assess performance, and provide feedback.
                            Access records, view marks, and communicate effortlessly.
                        </StyledText>
                        <StyledBox>
                            <StyledLink to="/choose">
                                <ModernButton variant="contained" fullWidth>
                                    Login
                                </ModernButton>
                            </StyledLink>
                            <StyledLink to="/chooseasguest">
                                <Button variant="outlined" fullWidth
                                    sx={{
                                        mt: 2, mb: 3,
                                        color: "#1a73e8",
                                        borderColor: "#1a73e8",
                                        fontWeight: 600,
                                        borderRadius: "12px",
                                        fontFamily: "'Inter', sans-serif"
                                    }}
                                >
                                    Login as Guest
                                </Button>
                            </StyledLink>
                            <StyledText style={{ fontSize: "1rem", color: "#6c757d", marginTop: 8 }}>
                                Don't have an account?{' '}
                                <Link to="/Adminregister" style={{ color: "#1a73e8", fontWeight: 600, textDecoration: "underline" }}>
                                    Sign up
                                </Link>
                            </StyledText>
                        </StyledBox>
                    </StyledPaper>
                </Grid>
            </Grid>
        </StyledContainer>
    );
};

export default Homepage;

const StyledContainer = styled(Container)`
  display: flex;
  justify-content: center;
  padding-top: 40px;
  align-items: center;
  height: 100vh;
  background: linear-gradient(120deg, #f8fafc 0%, #e3f2fd 100%);
`;

const StyledPaper = styled.div`
  padding: 40px 32px;
  height: auto;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 8px 32px rgba(60,72,88,0.10);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  padding: 24px 0 0 0;
  width: 100%;
`;

const StyledTitle = styled.h1`
  font-size: 2.1rem; // reduced from 2.7rem
  color: #1a237e;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  font-weight: 800;
  padding-top: 0;
  letter-spacing: 0.5px;
  line-height: 1.1;
  margin-bottom: 12px; // slightly reduced
  text-align: center;
`;

const StyledText = styled.p`
  color: #374151;
  margin-top: 12px; // reduced
  margin-bottom: 12px; // reduced
  font-size: 0.98rem; // reduced from 1.08rem
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  letter-spacing: 0.01em;
  line-height: 1.5; // slightly tighter
  text-align: center;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  width: 100%;
`;
