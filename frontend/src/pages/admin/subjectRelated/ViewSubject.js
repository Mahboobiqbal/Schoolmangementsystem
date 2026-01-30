import React, { useEffect, useState } from "react";
import {
  getClassStudents,
  getSubjectDetails,
} from "../../../redux/sclassRelated/sclassHandle";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Tab,
  Container,
  Typography,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from "@mui/material";
import {
  BlueButton,
  GreenButton,
  PurpleButton,
} from "../../../components/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import InsertChartIcon from "@mui/icons-material/InsertChart";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import TableChartIcon from "@mui/icons-material/TableChart";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";

const ViewModule = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const {
    subloading,
    subjectDetails: moduleDetails,
    sclassStudents: programLearners,
    getresponse,
    error,
  } = useSelector((state) => state.sclass);

  const { classID, subjectID, programID, moduleID } = params;

  useEffect(() => {
    dispatch(getSubjectDetails(subjectID || moduleID, "Subject"));
    dispatch(getClassStudents(classID || programID));
  }, [dispatch, subjectID, classID, programID, moduleID]);

  if (error) {
    console.log(error);
  }

  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [selectedSection, setSelectedSection] = useState("participation");
  const handleSectionChange = (event, newSection) => {
    setSelectedSection(newSection);
  };

  const learnerColumns = [
    { id: "rollNum", label: "Enrollment ID", minWidth: 100 },
    { id: "name", label: "Name", minWidth: 170 },
  ];

  const learnerRows = programLearners.map((learner) => {
    return {
      rollNum: learner.rollNum,
      name: learner.name,
      id: learner._id,
    };
  });

  const LearnersParticipationButtonHaver = ({ row }) => {
    return (
      <>
        <BlueButton
          variant="contained"
          onClick={() => navigate("/Admin/learners/learner/" + row.id)}
        >
          View
        </BlueButton>
        <PurpleButton
          variant="contained"
          onClick={() =>
            navigate(
              `/Admin/module/learner/participation/${row.id}/${subjectID || moduleID}`,
            )
          }
        >
          Track Participation
        </PurpleButton>
      </>
    );
  };

  const LearnersMarksButtonHaver = ({ row }) => {
    return (
      <>
        <BlueButton
          variant="contained"
          onClick={() => navigate("/Admin/learners/learner/" + row.id)}
        >
          View
        </BlueButton>
        <PurpleButton
          variant="contained"
          onClick={() =>
            navigate(
              `/Admin/module/learner/marks/${row.id}/${subjectID || moduleID}`,
            )
          }
        >
          Provide Marks
        </PurpleButton>
      </>
    );
  };

  const ModuleLearnersSection = () => {
    return (
      <>
        {getresponse ? (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "16px",
              }}
            >
              <GreenButton
                variant="contained"
                onClick={() =>
                  navigate(
                    "/Admin/program/addlearners/" + (classID || programID),
                  )
                }
              >
                Add Learners
              </GreenButton>
            </Box>
          </>
        ) : (
          <>
            <Typography variant="h5" gutterBottom>
              Learners List:
            </Typography>

            {selectedSection === "participation" && (
              <TableTemplate
                buttonHaver={LearnersParticipationButtonHaver}
                columns={learnerColumns}
                rows={learnerRows}
              />
            )}
            {selectedSection === "marks" && (
              <TableTemplate
                buttonHaver={LearnersMarksButtonHaver}
                columns={learnerColumns}
                rows={learnerRows}
              />
            )}

            <Paper
              sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
              elevation={3}
            >
              <BottomNavigation
                value={selectedSection}
                onChange={handleSectionChange}
                showLabels
              >
                <BottomNavigationAction
                  label="Participation"
                  value="participation"
                  icon={
                    selectedSection === "participation" ? (
                      <TableChartIcon />
                    ) : (
                      <TableChartOutlinedIcon />
                    )
                  }
                />
                <BottomNavigationAction
                  label="Marks"
                  value="marks"
                  icon={
                    selectedSection === "marks" ? (
                      <InsertChartIcon />
                    ) : (
                      <InsertChartOutlinedIcon />
                    )
                  }
                />
              </BottomNavigation>
            </Paper>
          </>
        )}
      </>
    );
  };

  const ModuleDetailsSection = () => {
    const numberOfLearners = programLearners.length;

    return (
      <>
        <Typography variant="h4" align="center" gutterBottom>
          Module Details
        </Typography>
        <Typography variant="h6" gutterBottom>
          Module Name : {moduleDetails && moduleDetails.subName}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Module Code : {moduleDetails && moduleDetails.subCode}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Module Sessions : {moduleDetails && moduleDetails.sessions}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Number of Learners: {numberOfLearners}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Program Name :{" "}
          {moduleDetails &&
            moduleDetails.sclassName &&
            moduleDetails.sclassName.sclassName}
        </Typography>
        {moduleDetails && moduleDetails.teacher ? (
          <Typography variant="h6" gutterBottom>
            Faculty Name : {moduleDetails.teacher.name}
          </Typography>
        ) : (
          <GreenButton
            variant="contained"
            onClick={() =>
              navigate("/Admin/faculty/addfaculty/" + moduleDetails._id)
            }
          >
            Add Module Faculty
          </GreenButton>
        )}
      </>
    );
  };

  return (
    <>
      {subloading ? (
        <div> Loading...</div>
      ) : (
        <>
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChange}
                  sx={{
                    position: "fixed",
                    width: "100%",
                    bgcolor: "background.paper",
                    zIndex: 1,
                  }}
                >
                  <Tab label="Details" value="1" />
                  <Tab label="Learners" value="2" />
                </TabList>
              </Box>
              <Container sx={{ marginTop: "3rem", marginBottom: "4rem" }}>
                <TabPanel value="1">
                  <ModuleDetailsSection />
                </TabPanel>
                <TabPanel value="2">
                  <ModuleLearnersSection />
                </TabPanel>
              </Container>
            </TabContext>
          </Box>
        </>
      )}
    </>
  );
};

export default ViewModule;
