import { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Popup from "../../components/Popup";
import { BlueButton } from "../../components/buttonStyles";
import { addStuff } from "../../redux/userRelated/userHandle";
import { useDispatch, useSelector } from "react-redux";

const LearnerFeedback = () => {
  const [complaint, setComplaint] = useState("");
  const [date, setDate] = useState("");
  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const dispatch = useDispatch();

  const { status, currentUser, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (status === "added") {
      setLoader(false);
      setShowPopup(true);
      setMessage("Done Successfully");
    } else if (error) {
      setLoader(false);
      setShowPopup(true);
      setMessage("Failed");
    }
  }, [status, error]);

  // Early return if currentUser is not loaded yet
  if (!currentUser) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
          p: 4,
        }}
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  const user = currentUser._id;
  const school = currentUser.school?._id || currentUser.institution?._id;
  const address = "Complain";

  const fields = {
    user,
    date,
    complaint,
    school,
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setLoader(true);
    dispatch(addStuff(fields, address));
  };

  return (
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
          <div>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="h4">Feedback</Typography>
            </Stack>
            <form onSubmit={submitHandler}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Select Date"
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  fullWidth
                  label="Write your feedback"
                  variant="outlined"
                  value={complaint}
                  onChange={(event) => {
                    setComplaint(event.target.value);
                  }}
                  required
                  multiline
                  maxRows={4}
                />
              </Stack>
              <BlueButton
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
                  "Add"
                )}
              </BlueButton>
            </form>
          </div>
        </Box>
      </Box>
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </>
  );
};

export default LearnerFeedback;
