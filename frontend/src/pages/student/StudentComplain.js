import { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Container,
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
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            📝 Feedback
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Share your feedback or raise a concern
          </Typography>
        </Box>
        <Box
          sx={{
            bgcolor: "background.paper",
            borderRadius: 3,
            border: "1px solid #e5e7eb",
            p: 4,
          }}
        >
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
                "Submit"
              )}
            </BlueButton>
          </form>
        </Box>
      </Container>
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </>
  );
};

export default LearnerFeedback;
