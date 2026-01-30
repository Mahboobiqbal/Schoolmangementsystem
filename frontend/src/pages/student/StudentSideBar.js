import * as React from "react";
import {
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";

import HomeIcon from "@mui/icons-material/Home";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import FeedbackOutlinedIcon from "@mui/icons-material/FeedbackOutlined";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";

const StudentSideBar = () => {
  const location = useLocation();
  return (
    <>
      <React.Fragment>
        <ListItemButton component={Link} to="/">
          <ListItemIcon>
            <HomeIcon
              color={
                location.pathname ===
                ("/" || "/Student/dashboard" || "/Learner/dashboard")
                  ? "primary"
                  : "inherit"
              }
            />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItemButton>
        <ListItemButton component={Link} to="/Learner/modules">
          <ListItemIcon>
            <MenuBookIcon
              color={
                location.pathname.startsWith("/Learner/modules") ||
                location.pathname.startsWith("/Student/subjects")
                  ? "primary"
                  : "inherit"
              }
            />
          </ListItemIcon>
          <ListItemText primary="Modules" />
        </ListItemButton>
        <ListItemButton component={Link} to="/Learner/participation">
          <ListItemIcon>
            <TrackChangesIcon
              color={
                location.pathname.startsWith("/Learner/participation") ||
                location.pathname.startsWith("/Student/attendance")
                  ? "primary"
                  : "inherit"
              }
            />
          </ListItemIcon>
          <ListItemText primary="Participation" />
        </ListItemButton>
        <ListItemButton component={Link} to="/Learner/feedback">
          <ListItemIcon>
            <FeedbackOutlinedIcon
              color={
                location.pathname.startsWith("/Learner/feedback") ||
                location.pathname.startsWith("/Student/complain")
                  ? "primary"
                  : "inherit"
              }
            />
          </ListItemIcon>
          <ListItemText primary="Feedback" />
        </ListItemButton>
      </React.Fragment>
      <Divider sx={{ my: 1 }} />
      <React.Fragment>
        <ListSubheader component="div" inset>
          Learner
        </ListSubheader>
        <ListItemButton component={Link} to="/Learner/profile">
          <ListItemIcon>
            <AccountCircleOutlinedIcon
              color={
                location.pathname.startsWith("/Learner/profile") ||
                location.pathname.startsWith("/Student/profile")
                  ? "primary"
                  : "inherit"
              }
            />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItemButton>
        <ListItemButton component={Link} to="/logout">
          <ListItemIcon>
            <ExitToAppIcon
              color={
                location.pathname.startsWith("/logout") ? "primary" : "inherit"
              }
            />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </React.Fragment>
    </>
  );
};

export default StudentSideBar;
