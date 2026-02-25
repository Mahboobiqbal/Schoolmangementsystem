import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getUserDetails } from "../../../redux/userRelated/userHandle";
import { getSubjectList } from "../../../redux/sclassRelated/sclassHandle";
import { updateStudentFields } from "../../../redux/studentRelated/studentHandle";

import {
  Box,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Stack,
  TextField,
  CircularProgress,
  FormControl,
} from "@mui/material";
import { PurpleButton } from "../../../components/buttonStyles";
import Popup from "../../../components/Popup";

const StudentAttendance = ({ situation }) => {
  const dispatch = useDispatch();
  const { currentUser, userDetails, loading } = useSelector(
    (state) => state.user,
  );
  const { subjectsList: modulesList } = useSelector((state) => state.sclass);
  const { response, error, statestatus } = useSelector(
    (state) => state.student,
  );
  const params = useParams();

  const [learnerID, setLearnerID] = useState("");
  const [moduleName, setModuleName] = useState("");
  const [chosenModuleId, setChosenModuleId] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (situation === "Student") {
      setLearnerID(params.id);
      const stdID = params.id;
      dispatch(getUserDetails(stdID, "Student"));
    } else if (situation === "Subject") {
      const { studentID, subjectID, learnerID, moduleID } = params;
      setLearnerID(studentID || learnerID);
      dispatch(getUserDetails(studentID || learnerID, "Student"));
      setChosenModuleId(subjectID || moduleID);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [situation, dispatch, params]);

  useEffect(() => {
    if (userDetails && userDetails.sclassName && situation === "Student") {
      dispatch(getSubjectList(userDetails.sclassName._id, "ClassSubjects"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, userDetails, situation]);

  const changeHandler = (event) => {
    const selectedModule = modulesList.find(
      (module) => module.subName === event.target.value,
    );
    setModuleName(selectedModule.subName);
    setChosenModuleId(selectedModule._id);
  };

  const fields = { subName: chosenModuleId, status, date };

  const submitHandler = (event) => {
    event.preventDefault();
    setLoader(true);
    dispatch(updateStudentFields(learnerID, fields, "StudentAttendance"));
  };

  useEffect(() => {
    if (response) {
      setLoader(false);
      setShowPopup(true);
      setMessage(response);
    } else if (error) {
      setLoader(false);
      setShowPopup(true);
      setMessage("error");
    } else if (statestatus === "added") {
      setLoader(false);
      setShowPopup(true);
      setMessage("Done Successfully");
    }
  }, [response, statestatus, error]);

  return (
    <>
      {loading ? (
        <>
          <div>Loading...</div>
        </>
      ) : (
        <>
          <Box
            sx={{
              flex: "1 1 auto",
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                maxWidth: 550,
                px: 3,
                py: "100px",
                width: "100%",
              }}
            >
              <Stack spacing={1} sx={{ mb: 3 }}>
                <Typography variant="h4">
                  Learner Name: {userDetails.name}
                </Typography>
                {currentUser.teachSubject && (
                  <Typography variant="h4">
                    Module Name: {currentUser.teachSubject?.subName}
                  </Typography>
                )}
              </Stack>
              <form onSubmit={submitHandler}>
                <Stack spacing={3}>
                  {situation === "Student" && (
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Select Module
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={moduleName}
                        label="Choose an option"
                        onChange={changeHandler}
                        required
                      >
                        {modulesList ? (
                          modulesList.map((module, index) => (
                            <MenuItem key={index} value={module.subName}>
                              {module.subName}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem value="Select Module">
                            Add Modules For Participation
                          </MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  )}
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Participation Status
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={status}
                      label="Choose an option"
                      onChange={(event) => setStatus(event.target.value)}
                      required
                    >
                      <MenuItem value="Present">Present</MenuItem>
                      <MenuItem value="Absent">Absent</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <TextField
                      label="Select Date"
                      type="date"
                      value={date}
                      onChange={(event) => setDate(event.target.value)}
                      required
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </FormControl>
                </Stack>

                <PurpleButton
                  fullWidth
                  size="large"
                  sx={{ mt: 3 }}
                  variant="contained"
                  type="submit"
                  disabled={loader}
                >
                  {loader ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Submit"
                  )}
                </PurpleButton>
              </form>
            </Box>
          </Box>
          <Popup
            message={message}
            setShowPopup={setShowPopup}
            showPopup={showPopup}
          />
        </>
      )}
    </>
  );
};

export default StudentAttendance;
