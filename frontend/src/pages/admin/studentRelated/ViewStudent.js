import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserDetails,
  updateUser,
} from "../../../redux/userRelated/userHandle";
import { useNavigate, useParams } from "react-router-dom";
import { getSubjectList } from "../../../redux/sclassRelated/sclassHandle";
import {
  Box,
  Button,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableHead,
  Typography,
  Tab,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  Container,
} from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import {
  KeyboardArrowUp,
  KeyboardArrowDown,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import {
  removeStuff,
  updateStudentFields,
} from "../../../redux/studentRelated/studentHandle";
import {
  calculateOverallAttendancePercentage,
  calculateSubjectAttendancePercentage,
  groupAttendanceBySubject,
} from "../../../components/attendanceCalculator";
import CustomBarChart from "../../../components/CustomBarChart";
import CustomPieChart from "../../../components/CustomPieChart";
import { StyledTableCell, StyledTableRow } from "../../../components/styles";

import InsertChartIcon from "@mui/icons-material/InsertChart";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import TableChartIcon from "@mui/icons-material/TableChart";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import Popup from "../../../components/Popup";

const ViewLearner = () => {
  const [showTab, setShowTab] = useState(false); // eslint-disable-line no-unused-vars

  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const { userDetails, response, loading, error } = useSelector(
    (state) => state.user,
  );

  const learnerID = params.id;
  const address = "Student";

  useEffect(() => {
    dispatch(getUserDetails(learnerID, address));
  }, [dispatch, learnerID]);

  useEffect(() => {
    if (
      userDetails &&
      userDetails.sclassName &&
      userDetails.sclassName._id !== undefined
    ) {
      dispatch(getSubjectList(userDetails.sclassName._id, "ClassSubjects"));
    }
  }, [dispatch, userDetails]);

  if (response) {
    console.log(response);
  } else if (error) {
    console.log(error);
  }

  const [name, setName] = useState("");
  const [enrollmentId, setEnrollmentId] = useState("");
  const [password, setPassword] = useState(""); // eslint-disable-line no-unused-vars
  const [programName, setProgramName] = useState("");
  const [learnerInstitution, setLearnerInstitution] = useState("");
  const [moduleMarks, setModuleMarks] = useState("");
  const [moduleParticipation, setModuleParticipation] = useState([]);

  const [openStates, setOpenStates] = useState({});

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const handleOpen = (subId) => {
    setOpenStates((prevState) => ({
      ...prevState,
      [subId]: !prevState[subId],
    }));
  };

  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [selectedSection, setSelectedSection] = useState("table");
  const handleSectionChange = (event, newSection) => {
    setSelectedSection(newSection);
  };

  const fields =
    password === ""
      ? { name, rollNum: enrollmentId }
      : { name, rollNum: enrollmentId, password };

  useEffect(() => {
    if (userDetails) {
      setName(userDetails.name || "");
      setEnrollmentId(userDetails.rollNum || "");
      setProgramName(userDetails.sclassName || "");
      setLearnerInstitution(userDetails.school || "");
      setModuleMarks(userDetails.examResult || "");
      setModuleParticipation(userDetails.attendance || []);
    }
  }, [userDetails]);

  const submitHandler = (event) => {
    // eslint-disable-line no-unused-vars
    event.preventDefault();
    dispatch(updateUser(fields, learnerID, address))
      .then(() => {
        dispatch(getUserDetails(learnerID, address));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const deleteHandler = () => {
    setMessage("Sorry the delete function has been disabled for now.");
    setShowPopup(true);

    // dispatch(deleteUser(learnerID, address))
    //     .then(() => {
    //         navigate(-1)
    //     })
  };

  const removeHandler = (id, deladdress) => {
    dispatch(removeStuff(id, deladdress)).then(() => {
      dispatch(getUserDetails(learnerID, address));
    });
  };

  const removeModuleParticipation = (modId) => {
    dispatch(
      updateStudentFields(learnerID, { subId: modId }, "RemoveStudentSubAtten"),
    ).then(() => {
      dispatch(getUserDetails(learnerID, address));
    });
  };

  const overallParticipationPercentage =
    calculateOverallAttendancePercentage(moduleParticipation);
  const overallAbsentPercentage = 100 - overallParticipationPercentage;

  const chartData = [
    { name: "Present", value: overallParticipationPercentage },
    { name: "Absent", value: overallAbsentPercentage },
  ];

  const moduleData = Object.entries(
    groupAttendanceBySubject(moduleParticipation),
  ).map(([modName, { subCode, present, sessions }]) => {
    const moduleParticipationPercentage = calculateSubjectAttendancePercentage(
      present,
      sessions,
    );
    return {
      subject: modName,
      attendancePercentage: moduleParticipationPercentage,
      totalClasses: sessions,
      attendedClasses: present,
    };
  });

  const LearnerParticipationSection = () => {
    const renderTableSection = () => {
      return (
        <>
          <h3>Participation:</h3>
          <Table>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>Module</StyledTableCell>
                <StyledTableCell>Present</StyledTableCell>
                <StyledTableCell>Total Sessions</StyledTableCell>
                <StyledTableCell>Participation Percentage</StyledTableCell>
                <StyledTableCell align="center">Actions</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            {Object.entries(groupAttendanceBySubject(moduleParticipation)).map(
              ([modName, { present, allData, subId, sessions }], index) => {
                const moduleParticipationPercentage =
                  calculateSubjectAttendancePercentage(present, sessions);
                return (
                  <TableBody key={index}>
                    <StyledTableRow>
                      <StyledTableCell>{modName}</StyledTableCell>
                      <StyledTableCell>{present}</StyledTableCell>
                      <StyledTableCell>{sessions}</StyledTableCell>
                      <StyledTableCell>
                        {moduleParticipationPercentage}%
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Button
                          variant="contained"
                          onClick={() => handleOpen(subId)}
                        >
                          {openStates[subId] ? (
                            <KeyboardArrowUp />
                          ) : (
                            <KeyboardArrowDown />
                          )}
                          Details
                        </Button>
                        <IconButton
                          onClick={() => removeModuleParticipation(subId)}
                        >
                          <DeleteIcon color="error" />
                        </IconButton>
                        <Button
                          variant="contained"
                          sx={styles.participationButton}
                          onClick={() =>
                            navigate(
                              `/Admin/module/learner/participation/${learnerID}/${subId}`,
                            )
                          }
                        >
                          Change
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                    <StyledTableRow>
                      <StyledTableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={6}
                      >
                        <Collapse
                          in={openStates[subId]}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box sx={{ margin: 1 }}>
                            <Typography
                              variant="h6"
                              gutterBottom
                              component="div"
                            >
                              Participation Details
                            </Typography>
                            <Table size="small" aria-label="purchases">
                              <TableHead>
                                <StyledTableRow>
                                  <StyledTableCell>Date</StyledTableCell>
                                  <StyledTableCell align="right">
                                    Status
                                  </StyledTableCell>
                                </StyledTableRow>
                              </TableHead>
                              <TableBody>
                                {allData.map((data, index) => {
                                  const date = new Date(data.date);
                                  const dateString =
                                    date.toString() !== "Invalid Date"
                                      ? date.toISOString().substring(0, 10)
                                      : "Invalid Date";
                                  return (
                                    <StyledTableRow key={index}>
                                      <StyledTableCell
                                        component="th"
                                        scope="row"
                                      >
                                        {dateString}
                                      </StyledTableCell>
                                      <StyledTableCell align="right">
                                        {data.status}
                                      </StyledTableCell>
                                    </StyledTableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </StyledTableCell>
                    </StyledTableRow>
                  </TableBody>
                );
              },
            )}
          </Table>
          <div>
            Overall Participation Percentage:{" "}
            {overallParticipationPercentage.toFixed(2)}%
          </div>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => removeHandler(learnerID, "RemoveStudentAtten")}
          >
            Delete All
          </Button>
          <Button
            variant="contained"
            sx={styles.styledButton}
            onClick={() =>
              navigate("/Admin/learners/learner/participation/" + learnerID)
            }
          >
            Add Participation
          </Button>
        </>
      );
    };
    const renderChartSection = () => {
      return (
        <>
          <CustomBarChart
            chartData={moduleData}
            dataKey="attendancePercentage"
          />
        </>
      );
    };
    return (
      <>
        {moduleParticipation &&
        Array.isArray(moduleParticipation) &&
        moduleParticipation.length > 0 ? (
          <>
            {selectedSection === "table" && renderTableSection()}
            {selectedSection === "chart" && renderChartSection()}

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
                  label="Table"
                  value="table"
                  icon={
                    selectedSection === "table" ? (
                      <TableChartIcon />
                    ) : (
                      <TableChartOutlinedIcon />
                    )
                  }
                />
                <BottomNavigationAction
                  label="Chart"
                  value="chart"
                  icon={
                    selectedSection === "chart" ? (
                      <InsertChartIcon />
                    ) : (
                      <InsertChartOutlinedIcon />
                    )
                  }
                />
              </BottomNavigation>
            </Paper>
          </>
        ) : (
          <Button
            variant="contained"
            sx={styles.styledButton}
            onClick={() =>
              navigate("/Admin/learners/learner/participation/" + learnerID)
            }
          >
            Add Participation
          </Button>
        )}
      </>
    );
  };

  const LearnerMarksSection = () => {
    const renderTableSection = () => {
      return (
        <>
          <h3>Module Marks:</h3>
          <Table>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>Module</StyledTableCell>
                <StyledTableCell>Marks</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {moduleMarks.map((result, index) => {
                if (!result.subName || !result.marksObtained) {
                  return null;
                }
                return (
                  <StyledTableRow key={index}>
                    <StyledTableCell>{result.subName.subName}</StyledTableCell>
                    <StyledTableCell>{result.marksObtained}</StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
          <Button
            variant="contained"
            sx={styles.styledButton}
            onClick={() =>
              navigate("/Admin/learners/learner/marks/" + learnerID)
            }
          >
            Add Marks
          </Button>
        </>
      );
    };
    const renderChartSection = () => {
      return (
        <>
          <CustomBarChart chartData={moduleMarks} dataKey="marksObtained" />
        </>
      );
    };
    return (
      <>
        {moduleMarks && Array.isArray(moduleMarks) && moduleMarks.length > 0 ? (
          <>
            {selectedSection === "table" && renderTableSection()}
            {selectedSection === "chart" && renderChartSection()}

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
                  label="Table"
                  value="table"
                  icon={
                    selectedSection === "table" ? (
                      <TableChartIcon />
                    ) : (
                      <TableChartOutlinedIcon />
                    )
                  }
                />
                <BottomNavigationAction
                  label="Chart"
                  value="chart"
                  icon={
                    selectedSection === "chart" ? (
                      <InsertChartIcon />
                    ) : (
                      <InsertChartOutlinedIcon />
                    )
                  }
                />
              </BottomNavigation>
            </Paper>
          </>
        ) : (
          <Button
            variant="contained"
            sx={styles.styledButton}
            onClick={() =>
              navigate("/Admin/learners/learner/marks/" + learnerID)
            }
          >
            Add Marks
          </Button>
        )}
      </>
    );
  };

  const LearnerDetailsSection = () => {
    return (
      <div>
        Name: {userDetails.name}
        <br />
        Enrollment ID: {userDetails.rollNum}
        <br />
        Program: {programName.sclassName}
        <br />
        Institution: {learnerInstitution.schoolName}
        {moduleParticipation &&
          Array.isArray(moduleParticipation) &&
          moduleParticipation.length > 0 && <CustomPieChart data={chartData} />}
        <Button
          variant="contained"
          sx={styles.styledButton}
          onClick={deleteHandler}
        >
          Delete
        </Button>
        <br />
        {/* <Button variant="contained" sx={styles.styledButton} className="show-tab" onClick={() => { setShowTab(!showTab) }}>
                    {
                        showTab
                            ? <KeyboardArrowUp />
                            : <KeyboardArrowDown />
                    }
                    Edit Learner
                </Button>
                <Collapse in={showTab} timeout="auto" unmountOnExit>
                    <div className="register">
                        <form className="registerForm" onSubmit={submitHandler}>
                            <span className="registerTitle">Edit Details</span>
                            <label>Name</label>
                            <input className="registerInput" type="text" placeholder="Enter user's name..."
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                autoComplete="name" required />

                            <label>Enrollment ID</label>
                            <input className="registerInput" type="number" placeholder="Enter user's Enrollment ID..."
                                value={enrollmentId}
                                onChange={(event) => setEnrollmentId(event.target.value)}
                                required />

                            <label>Password</label>
                            <input className="registerInput" type="password" placeholder="Enter user's password..."
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                autoComplete="new-password" />

                            <button className="registerButton" type="submit" >Update</button>
                        </form>
                    </div>
                </Collapse> */}
      </div>
    );
  };

  return (
    <>
      {loading ? (
        <>
          <div>Loading...</div>
        </>
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
                  <Tab label="Participation" value="2" />
                  <Tab label="Marks" value="3" />
                </TabList>
              </Box>
              <Container sx={{ marginTop: "3rem", marginBottom: "4rem" }}>
                <TabPanel value="1">
                  <LearnerDetailsSection />
                </TabPanel>
                <TabPanel value="2">
                  <LearnerParticipationSection />
                </TabPanel>
                <TabPanel value="3">
                  <LearnerMarksSection />
                </TabPanel>
              </Container>
            </TabContext>
          </Box>
        </>
      )}
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </>
  );
};

export default ViewLearner;

const styles = {
  participationButton: {
    marginLeft: "20px",
    backgroundColor: "#270843",
    "&:hover": {
      backgroundColor: "#3f1068",
    },
  },
  styledButton: {
    margin: "20px",
    backgroundColor: "#02250b",
    "&:hover": {
      backgroundColor: "#106312",
    },
  },
};
