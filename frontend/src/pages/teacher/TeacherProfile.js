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
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationIcon from "@mui/icons-material/LocationOn";

const ProfileHeaderCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.grey[100]}`,
  marginBottom: theme.spacing(3),
  background: "linear-gradient(135deg, #f3f4f6, #ffffff)",
  boxShadow: "0px 1px 3px rgba(15, 23, 42, 0.08)",
}));

const InfoCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.grey[100]}`,
  boxShadow: "0px 1px 3px rgba(15, 23, 42, 0.08)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0px 4px 12px rgba(15, 23, 42, 0.12)",
  },
}));

const PerformanceBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  backgroundColor: "#f9fafb",
  borderRadius: 8,
  textAlign: "center",
}));

const InfoRow = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(1, 0),
}));

const FacultyProfile = () => {
  const { currentUser } = useSelector((state) => state.user);

  const facultyProgram = currentUser?.teachSclass;
  const facultyModule = currentUser?.teachSubject;
  const facultyInstitution = currentUser?.school;

  return (
    <Box>
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Header Card */}
        <ProfileHeaderCard elevation={0}>
          <CardContent sx={{ textAlign: "center", py: 4 }}>
            <Avatar
              alt="Faculty Avatar"
              sx={{
                width: 120,
                height: 120,
                margin: "0 auto",
                mb: 2,
                fontSize: 48,
                background: "linear-gradient(135deg, #F59E0B 0%, #F97316 100%)",
              }}
            >
              {String(currentUser?.name || "F").charAt(0)}
            </Avatar>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              {currentUser?.name || "Faculty"}
            </Typography>
            <Chip
              label="Faculty"
              color="warning"
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
                  {facultyProgram?.sclassName || "Not assigned"}
                </Typography>
              </CardContent>
            </InfoCard>
          </Grid>

          {/* Module Info */}
          <Grid item xs={12} sm={6}>
            <InfoCard elevation={0}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <BadgeIcon sx={{ color: "#14B8A6", mr: 1 }} />
                  <Typography variant="subtitle2" color="textSecondary">
                    Module
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {facultyModule?.subName || "Not assigned"}
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
                  {facultyInstitution?.schoolName || "Not assigned"}
                </Typography>
              </CardContent>
            </InfoCard>
          </Grid>

          {/* Professional Information */}
          <Grid item xs={12}>
            <Card elevation={0} sx={{ border: "1px solid #e5e7eb" }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Professional Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <PerformanceBox>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ mb: 0.5 }}
                      >
                        Classes
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 700, color: "#4F46E5" }}
                      >
                        1
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
                        Students
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 700, color: "#10B981" }}
                      >
                        28
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
                        Hours
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 700, color: "#14B8A6" }}
                      >
                        45
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
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <EmailIcon sx={{ fontSize: 20, color: "#4F46E5" }} />
                      <Typography variant="body2" color="textSecondary">
                        Email:
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      {currentUser?.email || "Not provided"}
                    </Typography>
                  </InfoRow>
                  <Divider />
                  <InfoRow>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PhoneIcon sx={{ fontSize: 20, color: "#14B8A6" }} />
                      <Typography variant="body2" color="textSecondary">
                        Phone:
                      </Typography>
                    </Box>
                    <Typography variant="body2">+1 (555) 987-6543</Typography>
                  </InfoRow>
                  <Divider />
                  <InfoRow>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <LocationIcon sx={{ fontSize: 20, color: "#F97316" }} />
                      <Typography variant="body2" color="textSecondary">
                        Office:
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      Room 301, Building A
                    </Typography>
                  </InfoRow>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default FacultyProfile;
