import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllNotices } from "../redux/noticeRelated/noticeHandle";
import { Box, Paper, Typography } from "@mui/material";
import TableViewTemplate from "./TableViewTemplate";

const SeeNotice = () => {
  const dispatch = useDispatch();

  const { currentUser, currentRole } = useSelector((state) => state.user);
  const {
    noticesList: announcementsList,
    loading,
    error,
    response,
  } = useSelector((state) => state.notice);

  useEffect(() => {
    if (!currentUser) return;
    if (currentRole === "Admin") {
      dispatch(getAllNotices(currentUser._id, "Notice"));
    } else {
      dispatch(getAllNotices(currentUser.school?._id, "Notice"));
    }
  }, [dispatch, currentRole, currentUser?._id, currentUser?.school?._id]);

  if (error) {
    console.log(error);
  }

  const announcementColumns = [
    { id: "title", label: "Title", minWidth: 170 },
    { id: "details", label: "Details", minWidth: 100 },
    { id: "date", label: "Date", minWidth: 170 },
  ];

  const announcementRows = announcementsList.map((announcement) => {
    const date = new Date(announcement.date);
    const dateString =
      date.toString() !== "Invalid Date"
        ? date.toISOString().substring(0, 10)
        : "Invalid Date";
    return {
      title: announcement.title,
      details: announcement.details,
      date: dateString,
      id: announcement._id,
    };
  });
  return (
    <>
      {loading ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography>Loading announcements...</Typography>
        </Box>
      ) : response ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography color="text.secondary">
            No Announcements to Show Right Now
          </Typography>
        </Box>
      ) : (
        <>
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            {Array.isArray(announcementsList) &&
              announcementsList.length > 0 && (
                <TableViewTemplate
                  columns={announcementColumns}
                  rows={announcementRows}
                />
              )}
          </Paper>
        </>
      )}
    </>
  );
};

export default SeeNotice;
