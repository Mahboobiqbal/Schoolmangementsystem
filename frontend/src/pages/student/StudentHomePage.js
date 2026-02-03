import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  LinearProgress,
  Skeleton,
} from "@mui/material";
import {
  MenuBook as MenuBookIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import CountUp from "react-countup";

// Components
import CustomPieChart from "../../components/CustomPieChart";
import SeeNotice from "../../components/SeeNotice";
import { getUserDetails } from "../../redux/userRelated/userHandle";
import { getSubjectList } from "../../redux/sclassRelated/sclassHandle";
import { calculateOverallAttendancePercentage } from "../../components/attendanceCalculator";

// Styled Components
const PageHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const StatsCard = styled(Card)(({ theme }) => ({
  position: "relative",
  borderRadius: 16,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.grey[100]}`,
  boxShadow: "0px 1px 3px rgba(15, 23, 42, 0.08)",
  transition: "all 0.3s ease-in-out",
  overflow: "hidden",
  cursor: "pointer",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0px 10px 40px rgba(15, 23, 42, 0.12)",
  },
}));

const IconWrapper = styled(Avatar)(({ bgcolor }) => ({
  width: 56,
  height: 56,
  backgroundColor: bgcolor || "#4F46E5",
  boxShadow: `0 4px 14px 0 ${bgcolor ? bgcolor + "40" : "rgba(79, 70, 229, 0.4)"}`,
}));

const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: theme.palette.grey[100],
  "& .MuiLinearProgress-bar": {
    borderRadius: 4,
  },
}));

const ChartContainer = styled(Box)(({ theme }) => ({
  height: 300,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
}));

const StudentHomePage = () => {
  const dispatch = useDispatch();

  const { userDetails, currentUser, loading } = useSelector(
    (state) => state.user,
  );
  const { subjectsList } = useSelector((state) => state.sclass);

  const [subjectAttendance, setSubjectAttendance] = useState([]);

  useEffect(() => {
    if (!currentUser?._id) return;

    const classID = currentUser.sclassName?._id || currentUser.programName?._id;
    dispatch(getUserDetails(currentUser._id, "Student"));
    if (classID) dispatch(getSubjectList(classID, "ClassSubjects"));
  }, [dispatch, currentUser]);

  useEffect(() => {
    if (userDetails) {
      setSubjectAttendance(userDetails.attendance || []);
    }
  }, [userDetails]);

  // Early return if currentUser is not loaded yet
  if (!currentUser) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  const numberOfSubjects = subjectsList?.length || 0;
  const overallAttendancePercentage =
    calculateOverallAttendancePercentage(subjectAttendance);
  const overallAbsentPercentage = 100 - overallAttendancePercentage;

  const chartData = [
    { name: "Present", value: overallAttendancePercentage },
    { name: "Absent", value: overallAbsentPercentage },
  ];

  const statsData = [
    {
      title: "Total Modules",
      value: numberOfSubjects,
      icon: <MenuBookIcon sx={{ fontSize: 28 }} />,
      iconBg: "#4F46E5",
    },
    {
      title: "Assignments",
      value: 15,
      icon: <AssignmentIcon sx={{ fontSize: 28 }} />,
      iconBg: "#14B8A6",
    },
    {
      title: "Attendance",
      value: overallAttendancePercentage.toFixed(1),
      suffix: "%",
      icon: <CheckCircleIcon sx={{ fontSize: 28 }} />,
      iconBg: "#10B981",
    },
    {
      title: "GPA",
      value: "3.8",
      icon: <PersonIcon sx={{ fontSize: 28 }} />,
      iconBg: "#F97316",
    },
  ];

  return (
    <Box>
      {/* Page Header */}
      <PageHeader>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Welcome back, {currentUser?.name?.split(" ")[0] || "Learner"} 👋
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          Here's your learning progress and academic performance overview.
        </Typography>
      </PageHeader>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsData.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            {loading ? (
              <Skeleton
                variant="rectangular"
                height={160}
                sx={{ borderRadius: 4 }}
              />
            ) : (
              <StatsCard>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                  >
                    <Box flex={1}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          fontWeight: 500,
                          mb: 1,
                        }}
                      >
                        {stat.title}
                      </Typography>
                      <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
                        {typeof stat.value === "number" ||
                        typeof stat.value === "string" ? (
                          stat.suffix ? (
                            `${stat.value}${stat.suffix}`
                          ) : stat.title === "Total Modules" ? (
                            <CountUp
                              start={0}
                              end={stat.value}
                              duration={2.5}
                            />
                          ) : stat.title === "Assignments" ? (
                            <CountUp
                              start={0}
                              end={stat.value}
                              duration={2.5}
                            />
                          ) : (
                            stat.value
                          )
                        ) : (
                          stat.value
                        )}
                      </Typography>
                    </Box>
                    <IconWrapper bgcolor={stat.iconBg}>{stat.icon}</IconWrapper>
                  </Box>
                </CardContent>
              </StatsCard>
            )}
          </Grid>
        ))}
      </Grid>

      {/* Charts and Info Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Attendance Chart */}
        <Grid item xs={12} md={6}>
          <StatsCard>
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                📊 Attendance Overview
              </Typography>
              <ChartContainer>
                {loading ? (
                  <Skeleton variant="circular" width={200} height={200} />
                ) : subjectAttendance && subjectAttendance.length > 0 ? (
                  <CustomPieChart data={chartData} />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No attendance data yet
                  </Typography>
                )}
              </ChartContainer>
            </CardContent>
          </StatsCard>
        </Grid>

        {/* Module Progress */}
        <Grid item xs={12} md={6}>
          <StatsCard>
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                📚 Module Progress
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {subjectsList && subjectsList.length > 0 ? (
                  subjectsList.slice(0, 3).map((subject, index) => (
                    <Box key={index}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        sx={{ mb: 1 }}
                      >
                        <Typography variant="body2" fontWeight={500}>
                          {subject.subName || subject.moduleName}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontWeight={500}
                        >
                          {75 + index * 5}%
                        </Typography>
                      </Box>
                      <ProgressBar
                        variant="determinate"
                        value={75 + index * 5}
                        sx={{
                          "& .MuiLinearProgress-bar": {
                            backgroundColor:
                              index === 0
                                ? "#4F46E5"
                                : index === 1
                                  ? "#14B8A6"
                                  : "#10B981",
                          },
                        }}
                      />
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No modules enrolled yet
                  </Typography>
                )}
              </Box>
            </CardContent>
          </StatsCard>
        </Grid>
      </Grid>

      {/* Announcements */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <StatsCard>
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                📢 Announcements
              </Typography>
              <SeeNotice />
            </CardContent>
          </StatsCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentHomePage;
