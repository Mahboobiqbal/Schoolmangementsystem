import React, { useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Avatar,
  Chip,
  LinearProgress,
  Skeleton,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CountUp from "react-countup";

// Icons
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AssignmentIcon from "@mui/icons-material/Assignment";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

// Redux
import { getAllSclasses } from "../../redux/sclassRelated/sclassHandle";
import { getAllStudents } from "../../redux/studentRelated/studentHandle";
import { getAllTeachers } from "../../redux/teacherRelated/teacherHandle";

// Styled Components
const PageHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const StatsCard = styled(Box)(({ theme, gradient }) => ({
  position: "relative",
  padding: theme.spacing(3),
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
  ...(gradient && {
    background: gradient,
    border: "none",
    "& *": {
      color: "#FFFFFF",
    },
  }),
}));

const IconWrapper = styled(Avatar)(({ bgcolor }) => ({
  width: 56,
  height: 56,
  backgroundColor: bgcolor || "#4F46E5",
  boxShadow: `0 4px 14px 0 ${bgcolor ? bgcolor + "40" : "rgba(79, 70, 229, 0.4)"}`,
}));

const TrendBadge = styled(Box)(({ theme, trend }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  padding: "4px 10px",
  borderRadius: 20,
  fontSize: "0.75rem",
  fontWeight: 600,
  backgroundColor:
    trend > 0 ? theme.palette.success.light : theme.palette.error.light,
  color: trend > 0 ? theme.palette.success.dark : theme.palette.error.dark,
}));

const SectionCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.grey[100]}`,
  boxShadow: "0px 1px 3px rgba(15, 23, 42, 0.08)",
  height: "100%",
}));

const QuickActionCard = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: 12,
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
  border: `1px solid ${theme.palette.grey[100]}`,
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
    borderColor: theme.palette.primary.main,
    "& .action-icon": {
      backgroundColor: theme.palette.primary.main,
      color: "#FFFFFF",
    },
  },
}));

const ActivityItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  gap: theme.spacing(2),
  padding: theme.spacing(2, 0),
  borderBottom: `1px solid ${theme.palette.grey[100]}`,
  "&:last-child": {
    borderBottom: "none",
  },
}));

const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: theme.palette.grey[100],
  "& .MuiLinearProgress-bar": {
    borderRadius: 4,
  },
}));

const AdminHomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { studentsList: learnersList, loading: learnersLoading } = useSelector(
    (state) => state.student,
  );
  const { sclassesList: programsList, loading: programsLoading } = useSelector(
    (state) => state.sclass,
  );
  const { teachersList: facultyList, loading: facultyLoading } = useSelector(
    (state) => state.teacher,
  );
  const { currentUser } = useSelector((state) => state.user);

  const adminID = currentUser._id;

  useEffect(() => {
    dispatch(getAllStudents(adminID));
    dispatch(getAllSclasses(adminID, "Sclass"));
    dispatch(getAllTeachers(adminID));
  }, [adminID, dispatch]);

  const numberOfLearners = learnersList?.length || 0;
  const numberOfPrograms = programsList?.length || 0;
  const numberOfFaculty = facultyList?.length || 0;

  const loading = learnersLoading || programsLoading || facultyLoading;

  // Stats data
  const statsData = [
    {
      title: "Total Learners",
      value: numberOfLearners,
      trend: 12,
      trendLabel: "vs last month",
      icon: <PeopleIcon sx={{ fontSize: 28 }} />,
      iconBg: "#4F46E5",
      gradient: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
      onClick: () => navigate("/Admin/learners"),
    },
    {
      title: "Active Programs",
      value: numberOfPrograms,
      trend: 8,
      trendLabel: "vs last month",
      icon: <SchoolIcon sx={{ fontSize: 28 }} />,
      iconBg: "#14B8A6",
      onClick: () => navigate("/Admin/programs"),
    },
    {
      title: "Faculty Members",
      value: numberOfFaculty,
      trend: -2,
      trendLabel: "vs last month",
      icon: <PersonIcon sx={{ fontSize: 28 }} />,
      iconBg: "#F59E0B",
      onClick: () => navigate("/Admin/faculty"),
    },
    {
      title: "Revenue",
      value: 48500,
      prefix: "$",
      trend: 18,
      trendLabel: "vs last month",
      icon: <AttachMoneyIcon sx={{ fontSize: 28 }} />,
      iconBg: "#10B981",
      onClick: () => {},
    },
  ];

  // Quick actions
  const quickActions = [
    { icon: <AddIcon />, title: "Add Learner", path: "/Admin/addlearners" },
    { icon: <SchoolIcon />, title: "New Program", path: "/Admin/addprogram" },
    {
      icon: <PersonIcon />,
      title: "Add Faculty",
      path: "/Admin/faculty/chooseprogram",
    },
  ];

  // Recent activity data (mock)
  const recentActivity = [
    {
      type: "enrollment",
      title: "New learner enrolled",
      subtitle: "John Doe - Computer Science",
      time: "2 hours ago",
      icon: <PeopleIcon />,
      color: "#4F46E5",
    },
    {
      type: "assessment",
      title: "Assessment submitted",
      subtitle: "Mathematics Module - Grade A",
      time: "4 hours ago",
      icon: <AssignmentIcon />,
      color: "#10B981",
    },
    {
      type: "announcement",
      title: "New announcement posted",
      subtitle: "End of semester schedule",
      time: "6 hours ago",
      icon: <NotificationsActiveIcon />,
      color: "#F59E0B",
    },
    {
      type: "faculty",
      title: "Faculty assigned",
      subtitle: "Dr. Smith - Physics Program",
      time: "1 day ago",
      icon: <PersonIcon />,
      color: "#14B8A6",
    },
  ];

  // Program performance data (mock)
  const programPerformance = [
    { name: "Computer Science", enrolled: 120, capacity: 150, progress: 80 },
    { name: "Business Admin", enrolled: 95, capacity: 100, progress: 95 },
    { name: "Engineering", enrolled: 78, capacity: 120, progress: 65 },
    { name: "Arts & Design", enrolled: 45, capacity: 80, progress: 56 },
  ];

  return (
    <Box>
      {/* Page Header */}
      <PageHeader>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Welcome back, {currentUser?.name?.split(" ")[0] || "Admin"} 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your institution today.
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
              <StatsCard
                gradient={index === 0 ? stat.gradient : undefined}
                onClick={stat.onClick}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Box flex={1}>
                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          index === 0
                            ? "rgba(255,255,255,0.8)"
                            : "text.secondary",
                        fontWeight: 500,
                        mb: 1,
                      }}
                    >
                      {stat.title}
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        mb: 1,
                        fontSize: { xs: "1.75rem", md: "2rem" },
                        color: index === 0 ? "#FFFFFF" : "text.primary",
                      }}
                    >
                      <CountUp
                        start={0}
                        end={stat.value}
                        duration={2.5}
                        prefix={stat.prefix}
                        separator=","
                      />
                    </Typography>
                    {index !== 0 && (
                      <TrendBadge trend={stat.trend}>
                        {stat.trend > 0 ? (
                          <TrendingUpIcon sx={{ fontSize: 14 }} />
                        ) : (
                          <TrendingDownIcon sx={{ fontSize: 14 }} />
                        )}
                        {Math.abs(stat.trend)}%
                      </TrendBadge>
                    )}
                  </Box>
                  {index !== 0 && (
                    <IconWrapper
                      sx={{ backgroundColor: alpha(stat.iconBg, 0.1) }}
                    >
                      <Box sx={{ color: stat.iconBg }}>{stat.icon}</Box>
                    </IconWrapper>
                  )}
                </Box>
              </StatsCard>
            )}
          </Grid>
        ))}
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} lg={8}>
          <SectionCard>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <Typography variant="h6" fontWeight={600}>
                Quick Actions
              </Typography>
            </Box>
            <Grid container spacing={2}>
              {quickActions.map((action, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <QuickActionCard onClick={() => navigate(action.path)}>
                    <Avatar
                      className="action-icon"
                      sx={{
                        backgroundColor: alpha("#4F46E5", 0.1),
                        color: "#4F46E5",
                        transition: "all 0.2s",
                      }}
                    >
                      {action.icon}
                    </Avatar>
                    <Box flex={1}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {action.title}
                      </Typography>
                    </Box>
                    <ArrowForwardIcon
                      sx={{ color: "text.secondary", fontSize: 20 }}
                    />
                  </QuickActionCard>
                </Grid>
              ))}
            </Grid>
          </SectionCard>
        </Grid>

        {/* Calendar Widget */}
        <Grid item xs={12} lg={4}>
          <SectionCard>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <Typography variant="h6" fontWeight={600}>
                Upcoming Events
              </Typography>
              <Chip
                icon={<CalendarTodayIcon sx={{ fontSize: 16 }} />}
                label="View All"
                size="small"
                variant="outlined"
                sx={{ cursor: "pointer" }}
              />
            </Box>
            <Box>
              {[
                { date: "Jan 31", title: "Faculty Meeting", time: "10:00 AM" },
                { date: "Feb 02", title: "Semester Begins", time: "All Day" },
                { date: "Feb 05", title: "Orientation Day", time: "9:00 AM" },
              ].map((event, index) => (
                <Box
                  key={index}
                  display="flex"
                  alignItems="center"
                  gap={2}
                  py={1.5}
                  sx={{
                    borderBottom: index < 2 ? 1 : 0,
                    borderColor: "grey.100",
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      background:
                        "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#FFFFFF",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ fontSize: 10, opacity: 0.8 }}
                    >
                      {event.date.split(" ")[0]}
                    </Typography>
                    <Typography variant="subtitle2" fontWeight={700}>
                      {event.date.split(" ")[1]}
                    </Typography>
                  </Box>
                  <Box flex={1}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {event.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {event.time}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </SectionCard>
        </Grid>

        {/* Program Performance */}
        <Grid item xs={12} lg={6}>
          <SectionCard>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <Typography variant="h6" fontWeight={600}>
                Program Enrollment
              </Typography>
              <Chip
                label="View All"
                size="small"
                variant="outlined"
                sx={{ cursor: "pointer" }}
                onClick={() => navigate("/Admin/programs")}
              />
            </Box>
            {programPerformance.map((program, index) => (
              <Box key={index} mb={2.5}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Typography variant="body2" fontWeight={500}>
                    {program.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {program.enrolled} / {program.capacity}
                  </Typography>
                </Box>
                <ProgressBar
                  variant="determinate"
                  value={program.progress}
                  sx={{
                    "& .MuiLinearProgress-bar": {
                      background:
                        program.progress >= 90
                          ? "linear-gradient(135deg, #EF4444 0%, #F87171 100%)"
                          : program.progress >= 70
                            ? "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)"
                            : "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                    },
                  }}
                />
              </Box>
            ))}
          </SectionCard>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} lg={6}>
          <SectionCard>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6" fontWeight={600}>
                Recent Activity
              </Typography>
              <Chip
                label="View All"
                size="small"
                variant="outlined"
                sx={{ cursor: "pointer" }}
              />
            </Box>
            {recentActivity.map((activity, index) => (
              <ActivityItem key={index}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: alpha(activity.color, 0.1),
                    color: activity.color,
                  }}
                >
                  {activity.icon}
                </Avatar>
                <Box flex={1}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {activity.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {activity.subtitle}
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ whiteSpace: "nowrap" }}
                >
                  {activity.time}
                </Typography>
              </ActivityItem>
            ))}
          </SectionCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminHomePage;
