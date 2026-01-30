import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  Stack,
  Card,
  CardContent,
  CardActions,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { getAllNotices } from "../../../redux/noticeRelated/noticeHandle";
import { deleteUser } from "../../../redux/userRelated/userHandle";
import { EmptyState } from "../../../components/ui";
import { PrimaryButton, SecondaryButton } from "../../../components/ui/Buttons";
import Popup from "../../../components/Popup";

const ShowNotices = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { noticesList, loading, error, response } = useSelector(
    (state) => state.notice,
  );
  const { currentUser } = useSelector((state) => state.user);

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    dispatch(getAllNotices(currentUser._id, "Notice"));
  }, [currentUser._id, dispatch]);

  const deleteHandler = (deleteID, address) => {
    setMessage("Sorry the delete function has been disabled for now.");
    setShowPopup(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toString() !== "Invalid Date"
      ? date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "Invalid Date";
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <Typography>Loading notices...</Typography>
      </Box>
    );
  }

  if (response) {
    return (
      <EmptyState
        title="No Notices Found"
        description="Get started by creating your first notice announcement"
        actionLabel="Add Notice"
        onAction={() => navigate("/Admin/addnotice")}
      />
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight="600">
          Notices
        </Typography>
        <PrimaryButton
          startIcon={<AddIcon />}
          onClick={() => navigate("/Admin/addnotice")}
        >
          Add Notice
        </PrimaryButton>
      </Box>

      {noticesList && noticesList.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: 3,
          }}
        >
          {noticesList.map((notice) => (
            <Card key={notice._id} sx={{ height: "100%" }}>
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  mb={2}
                >
                  <Typography variant="h6" fontWeight="600" flex={1}>
                    {notice.title}
                  </Typography>
                  <Chip
                    label={formatDate(notice.date)}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {notice.details}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2 }}>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => deleteHandler(notice._id, "Notice")}
                  title="Delete Notice"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </CardActions>
            </Card>
          ))}
        </Box>
      ) : (
        <EmptyState
          title="No Notices Found"
          description="Get started by creating your first notice announcement"
          actionLabel="Add Notice"
          onAction={() => navigate("/Admin/addnotice")}
        />
      )}

      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </Box>
  );
};

export default ShowNotices;
