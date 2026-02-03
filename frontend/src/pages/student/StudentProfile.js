import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Avatar,
  Container,
  Divider,
  Chip,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux";
import SchoolIcon from "@mui/icons-material/School";
import BadgeIcon from "@mui/icons-material/Badge";
import BuildingIcon from "@mui/icons-material/Apartment";

const LearnerProfile = () => {
  const { currentUser, response, error } = useSelector((state) => state.user);

  if (response) {
    console.log(response);
  } else if (error) {
    console.log(error);
  }

  if (!currentUser) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  const programName = currentUser.sclassName || currentUser.programName;
  const learnerInstitution = currentUser.school || currentUser.institution;

  return (
    <>
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Header Card */}
        <ProfileHeaderCard elevation={0}>
          <CardContent sx={{ textAlign: "center", py: 4 }}>
            <Avatar
              alt="Learner Avatar"
              sx={{
                width: 120,
                height: 120,
                margin: "0 auto",
                mb: 2,
                fontSize: 48,
                background: "linear-gradient(135deg, #4F46E5 0%, #14B8A6 100%)",
              }}
            >
              {String(currentUser.name).charAt(0)}
            </Avatar>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              {currentUser.name}
            </Typography>
            <Chip
              label="Learner"
              color="primary"
              variant="outlined"
              sx={{ mt: 1 }}
            />
          </CardContent>
        </ProfileHeaderCard>

        {/* Info Cards */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {/* Program Info */}
          <Grid item xs={12} sm={6}>
            <InfoCard elevation={0}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <SchoolIcon sx={{ color: "#4F46E5", mr: 1 }} />
                  <Typography variant="subtitle2" color="textSecondary">
                    Program
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {programName?.sclassName || programName?.programName || "N/A"}
                </Typography>
              </CardContent>
            </InfoCard>
          </Grid>

          {/* Enrollment ID Info */}
          <Grid item xs={12} sm={6}>
            <InfoCard elevation={0}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <BadgeIcon sx={{ color: "#14B8A6", mr: 1 }} />
                  <Typography variant="subtitle2" color="textSecondary">
                    Enrollment ID
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {currentUser?.rollNum || currentUser?.enrollmentId || "N/A"}
                </Typography>
              </CardContent>
            </InfoCard>
          </Grid>

          {/* Institution Info */}
          <Grid item xs={12}>
            <InfoCard elevation={0}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <BuildingIcon sx={{ color: "#F97316", mr: 1 }} />
                  <Typography variant="subtitle2" color="textSecondary">
                    Institution
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {learnerInstitution?.schoolName ||
                    learnerInstitution?.institutionName ||
                    "N/A"}
                </Typography>
              </CardContent>
            </InfoCard>
          </Grid>

          {/* Academic Performance */}
          <Grid item xs={12}>
            <Card elevation={0} sx={{ border: "1px solid #e5e7eb" }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Academic Performance
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <PerformanceBox>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ mb: 0.5 }}
                      >
                        Current GPA
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 700, color: "#4F46E5" }}
                      >
                        3.8
                      </Typography>
                    </PerformanceBox>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <PerformanceBox>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ mb: 0.5 }}
                      >
                        Attendance
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 700, color: "#10B981" }}
                      >
                        92%
                      </Typography>
                    </PerformanceBox>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <PerformanceBox>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ mb: 0.5 }}
                      >
                        Courses
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 700, color: "#14B8A6" }}
                      >
                        6/8
                      </Typography>
                    </PerformanceBox>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12}>
            <Card elevation={0} sx={{ border: "1px solid #e5e7eb" }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Contact Information
                </Typography>
                <Stack spacing={1.5}>
                  <InfoRow>
                    <Typography variant="body2" color="textSecondary">
                      Email:
                    </Typography>
                    <Typography variant="body2">
                      {currentUser.email || "Not provided"}
                    </Typography>
                  </InfoRow>
                  <Divider />
                  <InfoRow>
                    <Typography variant="body2" color="textSecondary">
                      Phone:
                    </Typography>
                    <Typography variant="body2">+1 (555) 123-4567</Typography>
                  </InfoRow>
                  <Divider />
                  <InfoRow>
                    <Typography variant="body2" color="textSecondary">
                      Address:
                    </Typography>
                    <Typography variant="body2">
                      123 Main Street, City, State 12345
                    </Typography>
                  </InfoRow>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

const ProfileHeaderCard = styled(Card)`
  background: linear-gradient(135deg, #f3f4f6 0%, #ffffff 100%);
  border-radius: 16px;
`;

const InfoCard = styled(Card)`
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: #d1d5db;
  }
`;

const PerformanceBox = styled(Box)`
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
`;

const InfoRow = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export default LearnerProfile;
