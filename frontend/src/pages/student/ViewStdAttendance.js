import React, { useEffect, useState } from "react";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
  Collapse,
  Container,
  Paper,
  Table,
  TableBody,
  TableHead,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from "../../redux/userRelated/userHandle";
import {
  calculateOverallAttendancePercentage,
  calculateSubjectAttendancePercentage,
  groupAttendanceBySubject,
} from "../../components/attendanceCalculator";

import CustomBarChart from "../../components/CustomBarChart";

import InsertChartIcon from "@mui/icons-material/InsertChart";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import TableChartIcon from "@mui/icons-material/TableChart";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import { StyledTableCell, StyledTableRow } from "../../components/styles";

const ViewLearnerParticipation = () => {
  const dispatch = useDispatch();

  const [openStates, setOpenStates] = useState({});

  const handleOpen = (modId) => {
    setOpenStates((prevState) => ({
      ...prevState,
      [modId]: !prevState[modId],
    }));
  };

  const { userDetails, currentUser, loading, response, error } = useSelector(
    (state) => state.user,
  );

  const [moduleParticipation, setModuleParticipation] = useState([]);
  const [selectedSection, setSelectedSection] = useState("table");

  useEffect(() => {
    if (!currentUser?._id) return;
    dispatch(getUserDetails(currentUser._id, "Student"));
  }, [dispatch, currentUser]);

  useEffect(() => {
    if (userDetails) {
      setModuleParticipation(userDetails.attendance || []);
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

  if (response) {
    console.log(response);
  } else if (error) {
    console.log(error);
  }

  const participationByModule = groupAttendanceBySubject(moduleParticipation);

  const overallParticipationPercentage =
    calculateOverallAttendancePercentage(moduleParticipation);

  const moduleData = Object.entries(participationByModule).map(
    ([modName, { subCode, present, sessions }]) => {
      const moduleParticipationPercentage =
        calculateSubjectAttendancePercentage(present, sessions);
      return {
        subject: modName,
        attendancePercentage: moduleParticipationPercentage,
        totalClasses: sessions,
        attendedClasses: present,
      };
    },
  );

  const handleSectionChange = (event, newSection) => {
    setSelectedSection(newSection);
  };

  const renderTableSection = () => {
    return (
      <>
        <Box sx={{ mb: 3 }}>
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
            {Object.entries(participationByModule).map(
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
                            <Typography variant="h6" gutterBottom component="div">
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
                                      <StyledTableCell component="th" scope="row">
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
        </Box>
        <Box
          sx={{
            p: 3,
            bgcolor: "#f3f4f6",
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#4F46E5" }}>
            Overall Participation: {overallParticipationPercentage.toFixed(2)}%
          </Typography>
        </Box>
      </>
    );
  };

  const renderChartSection = () => {
    return (
      <>
        <CustomBarChart chartData={moduleData} dataKey="attendancePercentage" />
      </>
    );
  };

  return (
    <>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <Typography>Loading...</Typography>
        </Box>
      ) : (
        <Container maxWidth="lg" sx={{ py: 4, pb: 10 }}>
          {moduleParticipation &&
          Array.isArray(moduleParticipation) &&
          moduleParticipation.length > 0 ? (
            <>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  📊 Participation Overview
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Track your attendance and participation across all modules
                </Typography>
              </Box>

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
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                Currently You Have No Participation Details
              </Typography>
            </Box>
          )}
        </Container>
      )}
    </>
  );
};

export default ViewLearnerParticipation;
