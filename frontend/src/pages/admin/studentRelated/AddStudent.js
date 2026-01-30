import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../../redux/userRelated/userHandle";
import Popup from "../../../components/Popup";
import { underControl } from "../../../redux/userRelated/userSlice";
import { getAllSclasses } from "../../../redux/sclassRelated/sclassHandle";
import {
  CircularProgress,
  TextField,
  MenuItem,
  Box,
  Typography,
  Stack,
  Button,
} from "@mui/material";
import { BlueButton } from "../../../components/buttonStyles";

const AddStudent = ({ situation }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const userState = useSelector((state) => state.user);
  const { status, currentUser, response, error } = userState;
  const { sclassesList: programsList } = useSelector((state) => state.sclass);

  const [name, setName] = useState("");
  const [enrollmentId, setEnrollmentId] = useState("");
  const [password, setPassword] = useState("");
  const [programName, setProgramName] = useState("");
  const [selectedProgramId, setSelectedProgramId] = useState("");

  const adminID = currentUser._id;
  const role = "Student";
  const attendance = [];

  useEffect(() => {
    if (situation === "Class") {
      setSelectedProgramId(params.id);
    }
  }, [params.id, situation]);

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    dispatch(getAllSclasses(adminID, "Sclass"));
  }, [adminID, dispatch]);

  const changeHandler = (event) => {
    const selectedId = event.target.value;
    if (selectedId === "") {
      setProgramName("");
      setSelectedProgramId("");
    } else {
      const selectedProgram = programsList.find(
        (program) => program._id === selectedId,
      );
      setProgramName(
        selectedProgram?.programName || selectedProgram?.sclassName || "",
      );
      setSelectedProgramId(selectedProgram._id);
    }
  };

  const fields = {
    name,
    rollNum: enrollmentId, // Legacy field
    enrollmentId: enrollmentId, // New field for learner schema
    password,
    sclassName: selectedProgramId, // Legacy field
    programName: selectedProgramId, // New field for learner schema
    adminID,
    role,
    attendance,
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (selectedProgramId === "") {
      setMessage("Please select a program");
      setShowPopup(true);
    } else {
      setLoader(true);
      dispatch(registerUser(fields, role));
    }
  };

  useEffect(() => {
    if (status === "added") {
      dispatch(underControl());
      navigate(-1);
    } else if (status === "failed") {
      setMessage(response);
      setShowPopup(true);
      setLoader(false);
    } else if (status === "error") {
      setMessage("Network Error");
      setShowPopup(true);
      setLoader(false);
    }
  }, [status, navigate, error, response, dispatch]);

  return (
    <>
      <Box
        sx={{
          padding: 4,
          maxWidth: 600,
          margin: "0 auto",
          backgroundColor: "#fff",
          borderRadius: 2,
          boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Add Learner
        </Typography>
        <form onSubmit={submitHandler}>
          <Stack spacing={3} sx={{ mt: 3 }}>
            <TextField
              label="Name"
              type="text"
              placeholder="Enter learner's name..."
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              required
              fullWidth
            />

            {situation === "Student" && (
              <TextField
                select
                label="Program"
                value={selectedProgramId}
                onChange={changeHandler}
                required
                fullWidth
                helperText="Select the program for this learner"
              >
                <MenuItem value="">
                  <em>Select Program</em>
                </MenuItem>
                {programsList && programsList.length > 0 ? (
                  programsList.map((program) => (
                    <MenuItem key={program._id} value={program._id}>
                      {program.programName ||
                        program.sclassName ||
                        "Unnamed Program"}
                      {program.programCode && ` (${program.programCode})`}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>
                    <em>No programs available</em>
                  </MenuItem>
                )}
              </TextField>
            )}

            <TextField
              label="Enrollment ID"
              type="text"
              placeholder="Enter learner's Enrollment ID..."
              value={enrollmentId}
              onChange={(event) => setEnrollmentId(event.target.value)}
              required
              fullWidth
            />

            <TextField
              label="Password"
              type="password"
              placeholder="Enter learner's password..."
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              required
              fullWidth
            />

            <BlueButton fullWidth size="large" type="submit" disabled={loader}>
              {loader ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Add Learner"
              )}
            </BlueButton>

            <Button variant="outlined" onClick={() => navigate(-1)} fullWidth>
              Cancel
            </Button>
          </Stack>
        </form>
      </Box>
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </>
  );
};

export default AddStudent;
