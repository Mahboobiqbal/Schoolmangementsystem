import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from "../../redux/userRelated/userHandle";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Collapse,
  Table,
  TableBody,
  TableHead,
  Typography,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import {
  calculateOverallAttendancePercentage,
  calculateSubjectAttendancePercentage,
  groupAttendanceBySubject,
} from "../../components/attendanceCalculator";
import CustomPieChart from "../../components/CustomPieChart";
import { PurpleButton } from "../../components/buttonStyles";
import { StyledTableCell, StyledTableRow } from "../../components/styles";

const FacultyViewLearner = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const { currentUser, userDetails, response, loading, error } = useSelector(
    (state) => state.user,
  );

  const address = "Student";
  const learnerID = params.id;
  const teachModule = currentUser.teachSubject?.subName;
  const teachModuleID = currentUser.teachSubject?._id;

  useEffect(() => {
    dispatch(getUserDetails(learnerID, address));
  }, [dispatch, learnerID]);

  if (response) {
    console.log(response);
  } else if (error) {
    console.log(error);
  }

  const [programName, setProgramName] = useState("");
  const [learnerInstitution, setLearnerInstitution] = useState("");
  const [moduleMarks, setModuleMarks] = useState("");
  const [moduleParticipation, setModuleParticipation] = useState([]);

  const [openStates, setOpenStates] = useState({});

  const handleOpen = (modId) => {
    setOpenStates((prevState) => ({
      ...prevState,
      [modId]: !prevState[modId],
    }));
  };

  useEffect(() => {
    if (userDetails) {
      setProgramName(userDetails.sclassName || "");
      setLearnerInstitution(userDetails.school || "");
      setModuleMarks(userDetails.examResult || "");
      setModuleParticipation(userDetails.attendance || []);
    }
  }, [userDetails]);

  const overallParticipationPercentage =
    calculateOverallAttendancePercentage(moduleParticipation);
  const overallAbsentPercentage = 100 - overallParticipationPercentage;

  const chartData = [
    { name: "Present", value: overallParticipationPercentage },
    { name: "Absent", value: overallAbsentPercentage },
  ];

  return (
    <>
      {loading ? (
        <>
          <div>Loading...</div>
        </>
      ) : (
        <div>
          Name: {userDetails.name}
          <br />
          Enrollment ID: {userDetails.rollNum}
          <br />
          Program: {programName.sclassName}
          <br />
          Institution: {learnerInstitution.schoolName}
          <br />
          <br />
          <h3>Participation:</h3>
          {moduleParticipation &&
            Array.isArray(moduleParticipation) &&
            moduleParticipation.length > 0 && (
              <>
                {Object.entries(
                  groupAttendanceBySubject(moduleParticipation),
                ).map(
                  ([modName, { present, allData, subId, sessions }], index) => {
                    if (modName === teachModule) {
                      const moduleParticipationPercentage =
                        calculateSubjectAttendancePercentage(present, sessions);

                      return (
                        <Table key={index}>
                          <TableHead>
                            <StyledTableRow>
                              <StyledTableCell>Module</StyledTableCell>
                              <StyledTableCell>Present</StyledTableCell>
                              <StyledTableCell>Total Sessions</StyledTableCell>
                              <StyledTableCell>
                                Participation Percentage
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                Actions
                              </StyledTableCell>
                            </StyledTableRow>
                          </TableHead>

                          <TableBody>
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
                                          <StyledTableCell>
                                            Date
                                          </StyledTableCell>
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
                                              ? date
                                                  .toISOString()
                                                  .substring(0, 10)
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
                        </Table>
                      );
                    } else {
                      return null;
                    }
                  },
                )}
                <div>
                  Overall Participation Percentage:{" "}
                  {overallParticipationPercentage.toFixed(2)}%
                </div>

                <CustomPieChart data={chartData} />
              </>
            )}
          <br />
          <br />
          <Button
            variant="contained"
            onClick={() =>
              navigate(
                `/Faculty/program/learner/participation/${learnerID}/${teachModuleID}`,
              )
            }
          >
            Add Participation
          </Button>
          <br />
          <br />
          <br />
          <h3>Module Marks:</h3>
          {moduleMarks &&
            Array.isArray(moduleMarks) &&
            moduleMarks.length > 0 && (
              <>
                {moduleMarks.map((result, index) => {
                  if (result.subName.subName === teachModule) {
                    return (
                      <Table key={index}>
                        <TableHead>
                          <StyledTableRow>
                            <StyledTableCell>Module</StyledTableCell>
                            <StyledTableCell>Marks</StyledTableCell>
                          </StyledTableRow>
                        </TableHead>
                        <TableBody>
                          <StyledTableRow>
                            <StyledTableCell>
                              {result.subName.subName}
                            </StyledTableCell>
                            <StyledTableCell>
                              {result.marksObtained}
                            </StyledTableCell>
                          </StyledTableRow>
                        </TableBody>
                      </Table>
                    );
                  } else if (!result.subName || !result.marksObtained) {
                    return null;
                  }
                  return null;
                })}
              </>
            )}
          <PurpleButton
            variant="contained"
            onClick={() =>
              navigate(
                `/Faculty/program/learner/marks/${learnerID}/${teachModuleID}`,
              )
            }
          >
            Add Marks
          </PurpleButton>
          <br />
          <br />
          <br />
        </div>
      )}
    </>
  );
};

export default FacultyViewLearner;
