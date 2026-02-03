import React, { useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Avatar,
  Card,
  CardContent,
  Skeleton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import CountUp from "react-countup";

// Icons
import PeopleIcon from "@mui/icons-material/People";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

// Components
import SeeNotice from "../../components/SeeNotice";
import {
  getSubjectDetails,
  getClassStudents,
} from "../../redux/sclassRelated/sclassHandle";

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

const SectionCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.grey[100]}`,
  boxShadow: "0px 1px 3px rgba(15, 23, 42, 0.08)",
  height: "100%",
}));

const TeacherHomePage = () => {
  const dispatch = useDispatch();

  const { currentUser, loading } = useSelector((state) => state.user);
  const { subjectDetails, sclassStudents } = useSelector(
    (state) => state.sclass,
  );

  const classID = currentUser?.teachSclass?._id;
  const subjectID = currentUser?.teachSubject?._id;

  useEffect(() => {
    if (subjectID) dispatch(getSubjectDetails(subjectID, "Subject"));
    if (classID) dispatch(getClassStudents(classID));
  }, [dispatch, subjectID, classID]);

  const numberOfStudents = sclassStudents?.length || 0;
  const numberOfSessions = subjectDetails?.sessions || 0;

  const statsData = [
    {
      title: "Class Students",
      value: numberOfStudents,
      icon: <PeopleIcon sx={{ fontSize: 28 }} />,
      iconBg: "#4F46E5",
    },
    {
      title: "Total Lessons",
      value: numberOfSessions,
      icon: <MenuBookIcon sx={{ fontSize: 28 }} />,
      iconBg: "#14B8A6",
    },
    {
      title: "Tests Taken",
      value: 24,
      icon: <AssignmentIcon sx={{ fontSize: 28 }} />,
      iconBg: "#F59E0B",
    },
    {
      title: "Total Hours",
      value: 30,
      suffix: "hrs",
      icon: <AccessTimeIcon sx={{ fontSize: 28 }} />,
      iconBg: "#10B981",
    },
  ];

  return (
    <Box>
      {/* Page Header */}
      <PageHeader>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Welcome back, {currentUser?.name?.split(" ")[0] || "Faculty"} 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's your teaching activity and student performance overview.
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
                        {typeof stat.value === "number" ? (
                          <CountUp
                            start={0}
                            end={stat.value}
                            duration={2.5}
                            suffix={stat.suffix || ""}
                          />
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

      {/* Announcements Section */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <SectionCard>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
              📢 Announcements
            </Typography>
            <SeeNotice />
          </SectionCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TeacherHomePage;
