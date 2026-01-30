import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addStuff } from "../../../redux/userRelated/userHandle";
import { underControl } from "../../../redux/userRelated/userSlice";
import Popup from "../../../components/Popup";

const ModuleForm = () => {
  const [modules, setModules] = useState([
    { subName: "", subCode: "", sessions: "" },
  ]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const userState = useSelector((state) => state.user);
  const { status, currentUser, response, error } = userState;

  const programName = params.id;
  const adminID = currentUser._id;
  const address = "Subject";

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);

  const handleModuleNameChange = (index) => (event) => {
    const newModules = [...modules];
    newModules[index].subName = event.target.value;
    setModules(newModules);
  };

  const handleModuleCodeChange = (index) => (event) => {
    const newModules = [...modules];
    newModules[index].subCode = event.target.value;
    setModules(newModules);
  };

  const handleSessionsChange = (index) => (event) => {
    const newModules = [...modules];
    newModules[index].sessions = event.target.value || 0;
    setModules(newModules);
  };

  const handleAddModule = () => {
    setModules([...modules, { subName: "", subCode: "" }]);
  };

  const handleRemoveModule = (index) => () => {
    const newModules = [...modules];
    newModules.splice(index, 1);
    setModules(newModules);
  };

  const fields = {
    sclassName: programName,
    subjects: modules.map((module) => ({
      subName: module.subName,
      subCode: module.subCode,
      sessions: module.sessions,
    })),
    adminID,
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setLoader(true);
    dispatch(addStuff(fields, address));
  };

  useEffect(() => {
    if (status === "added") {
      navigate("/Admin/modules");
      dispatch(underControl());
      setLoader(false);
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
    <form onSubmit={submitHandler}>
      <Box mb={2}>
        <Typography variant="h6">Add Modules</Typography>
      </Box>
      <Grid container spacing={2}>
        {modules.map((module, index) => (
          <React.Fragment key={index}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Module Name"
                variant="outlined"
                value={module.subName}
                onChange={handleModuleNameChange(index)}
                sx={styles.inputField}
                required
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Module Code"
                variant="outlined"
                value={module.subCode}
                onChange={handleModuleCodeChange(index)}
                sx={styles.inputField}
                required
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Sessions"
                variant="outlined"
                type="number"
                inputProps={{ min: 0 }}
                value={module.sessions}
                onChange={handleSessionsChange(index)}
                sx={styles.inputField}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <Box display="flex" alignItems="flex-end">
                {index === 0 ? (
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleAddModule}
                  >
                    Add Module
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleRemoveModule(index)}
                  >
                    Remove
                  </Button>
                )}
              </Box>
            </Grid>
          </React.Fragment>
        ))}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loader}
            >
              {loader ? <CircularProgress size={24} color="inherit" /> : "Save"}
            </Button>
          </Box>
        </Grid>
        <Popup
          message={message}
          setShowPopup={setShowPopup}
          showPopup={showPopup}
        />
      </Grid>
    </form>
  );
};

export default ModuleForm;

const styles = {
  inputField: {
    "& .MuiInputLabel-root": {
      color: "#838080",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#838080",
    },
  },
};
