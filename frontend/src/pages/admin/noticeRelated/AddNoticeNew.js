import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  CircularProgress,
  Stack,
} from "@mui/material";
import { addStuff } from "../../../redux/userRelated/userHandle";
import { underControl } from "../../../redux/userRelated/userSlice";
import { PrimaryButton, SecondaryButton } from "../../../components/ui/Buttons";
import Popup from "../../../components/Popup";

const AddNotice = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, response, error } = useSelector((state) => state.user);
  const { currentUser } = useSelector((state) => state.user);

  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [date, setDate] = useState("");
  const adminID = currentUser._id;

  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const fields = { title, details, date, adminID };
  const address = "Notice";

  const submitHandler = (event) => {
    event.preventDefault();
    setLoader(true);
    dispatch(addStuff(fields, address));
  };

  useEffect(() => {
    if (status === "added") {
      navigate("/Admin/notices");
      dispatch(underControl());
    } else if (status === "error") {
      setMessage("Network Error");
      setShowPopup(true);
      setLoader(false);
    }
  }, [status, navigate, error, response, dispatch]);

  return (
    <Box>
      <Typography variant="h5" fontWeight="600" mb={3}>
        Create Notice
      </Typography>

      <Card sx={{ maxWidth: 600 }}>
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={submitHandler}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Notice Title"
                placeholder="Enter notice title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                variant="outlined"
              />

              <TextField
                fullWidth
                label="Details"
                placeholder="Enter notice details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                required
                multiline
                rows={4}
                variant="outlined"
              />

              <TextField
                fullWidth
                label="Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
              />

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <SecondaryButton
                  onClick={() => navigate("/Admin/notices")}
                  disabled={loader}
                >
                  Cancel
                </SecondaryButton>
                <PrimaryButton type="submit" disabled={loader}>
                  {loader ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Create Notice"
                  )}
                </PrimaryButton>
              </Stack>
            </Stack>
          </form>
        </CardContent>
      </Card>

      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </Box>
  );
};

export default AddNotice;
