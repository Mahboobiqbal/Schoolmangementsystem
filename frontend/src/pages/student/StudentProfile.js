import React from 'react'
import styled from 'styled-components';
import { Card, CardContent, Typography, Grid, Box, Avatar, Container, Paper } from '@mui/material';
import { useSelector } from 'react-redux';

const StudentProfile = () => {
  const { currentUser, response, error } = useSelector((state) => state.user);

  if (response) { console.log(response) }
  else if (error) { console.log(error) }

  const sclassName = currentUser.sclassName
  const studentSchool = currentUser.school

  return (
    <ProfileBg>
      <Container maxWidth="md">
        <ProfileCard elevation={3}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center">
                <AvatarStyled>
                  {String(currentUser.name).charAt(0)}
                </AvatarStyled>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5" align="center" sx={{ fontWeight: 700, color: "#411d70" }}>
                {currentUser.name}
              </Typography>
              <Typography variant="subtitle1" align="center" sx={{ color: "#7f56da" }}>
                Roll No: {currentUser.rollNum}
              </Typography>
              <Typography variant="subtitle1" align="center" sx={{ color: "#7f56da" }}>
                Class: {sclassName.sclassName}
              </Typography>
              <Typography variant="subtitle1" align="center" sx={{ color: "#7f56da" }}>
                School: {studentSchool.schoolName}
              </Typography>
            </Grid>
          </Grid>
        </ProfileCard>
        <Card sx={{ mt: 3, borderRadius: "1.5rem", boxShadow: "0 4px 24px 0 rgba(127,86,218,0.10)" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" component="p">
                  <strong>Date of Birth:</strong> January 1, 2000
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" component="p">
                  <strong>Gender:</strong> Male
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" component="p">
                  <strong>Email:</strong> john.doe@example.com
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" component="p">
                  <strong>Phone:</strong> (123) 456-7890
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" component="p">
                  <strong>Address:</strong> 123 Main Street, City, Country
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" component="p">
                  <strong>Emergency Contact:</strong> (987) 654-3210
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </ProfileBg>
  )
}

export default StudentProfile

const ProfileBg = styled.div`
  min-height: 100vh;
  background: linear-gradient(120deg, #f8f9fc 0%, #e9e6f7 100%);
  padding: 40px 0;
`;

const ProfileCard = styled(Paper)`
  padding: 32px 24px 24px 24px;
  margin-bottom: 24px;
  border-radius: 1.5rem !important;
  box-shadow: 0 4px 24px 0 rgba(127,86,218,0.10) !important;
`;

const AvatarStyled = styled(Avatar)`
  && {
    width: 110px;
    height: 110px;
    background: linear-gradient(135deg, #7f56da 60%, #411d70 100%);
    font-size: 3rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 2px 12px 0 rgba(127,86,218,0.15);
  }
`;