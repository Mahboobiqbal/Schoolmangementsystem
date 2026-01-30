import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  InputBase,
  Divider,
  ListItemIcon,
  Tooltip,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Button,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { DRAWER_WIDTH, DRAWER_WIDTH_COLLAPSED } from "./Sidebar";

// Styled Components
const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  backgroundColor: "#FFFFFF",
  color: theme.palette.text.primary,
  boxShadow: "none",
  borderBottom: `1px solid ${theme.palette.grey[100]}`,
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: open ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED,
  width: `calc(100% - ${open ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED}px)`,
}));

const SearchWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  borderRadius: 12,
  backgroundColor: theme.palette.grey[50],
  border: `1px solid ${theme.palette.grey[100]}`,
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: theme.palette.grey[100],
  },
  "&:focus-within": {
    backgroundColor: "#FFFFFF",
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  maxWidth: 400,
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.grey[400],
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1.25, 1.25, 1.25, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    fontSize: "0.9375rem",
    [theme.breakpoints.up("md")]: {
      width: "24ch",
      "&:focus": {
        width: "32ch",
      },
    },
  },
}));

const IconButtonStyled = styled(IconButton)(({ theme }) => ({
  borderRadius: 12,
  padding: 10,
  backgroundColor: theme.palette.grey[50],
  border: `1px solid ${theme.palette.grey[100]}`,
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: theme.palette.grey[100],
  },
}));

const ProfileButton = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  padding: theme.spacing(0.75, 1.5),
  borderRadius: 12,
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: theme.palette.grey[100],
  },
}));

const NotificationItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 12,
  margin: theme.spacing(0.5, 1),
  transition: "background-color 0.2s",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: theme.palette.grey[50],
  },
}));

// Navbar Component
const Navbar = ({
  open,
  onMenuClick,
  user,
  onLogout,
  onProfileClick,
  onSettingsClick,
  notifications = [],
  pageTitle,
}) => {
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);

  const handleProfileOpen = (event) => setProfileAnchor(event.currentTarget);
  const handleProfileClose = () => setProfileAnchor(null);
  const handleNotificationOpen = (event) =>
    setNotificationAnchor(event.currentTarget);
  const handleNotificationClose = () => setNotificationAnchor(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <StyledAppBar position="fixed" open={open}>
      <Toolbar sx={{ minHeight: 70, px: { xs: 2, sm: 3 } }}>
        {/* Menu Button (Mobile) */}
        <IconButton
          color="inherit"
          aria-label="toggle menu"
          onClick={onMenuClick}
          edge="start"
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Page Title */}
        {pageTitle && (
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ fontWeight: 600, display: { xs: "none", sm: "block" } }}
          >
            {pageTitle}
          </Typography>
        )}

        {/* Search Bar */}
        <SearchWrapper sx={{ display: { xs: "none", md: "block" } }}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search programs, learners, modules..."
            inputProps={{ "aria-label": "search" }}
          />
        </SearchWrapper>

        <Box sx={{ flexGrow: 1 }} />

        {/* Right Side Actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {/* Help */}
          <Tooltip title="Help" arrow>
            <IconButtonStyled size="medium">
              <HelpOutlineIcon sx={{ fontSize: 20 }} />
            </IconButtonStyled>
          </Tooltip>

          {/* Theme Toggle */}
          <Tooltip title="Toggle theme" arrow>
            <IconButtonStyled size="medium">
              <DarkModeIcon sx={{ fontSize: 20 }} />
            </IconButtonStyled>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notifications" arrow>
            <IconButtonStyled size="medium" onClick={handleNotificationOpen}>
              <Badge
                badgeContent={unreadCount}
                color="error"
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: "0.65rem",
                    height: 18,
                    minWidth: 18,
                  },
                }}
              >
                <NotificationsIcon sx={{ fontSize: 20 }} />
              </Badge>
            </IconButtonStyled>
          </Tooltip>

          <Divider
            orientation="vertical"
            flexItem
            sx={{ mx: 1, height: 32, my: "auto" }}
          />

          {/* Profile Menu */}
          <ProfileButton onClick={handleProfileOpen}>
            <Avatar
              src={user?.avatar}
              sx={{
                width: 36,
                height: 36,
                fontSize: "0.9rem",
                background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
              }}
            >
              {user?.name?.charAt(0)}
            </Avatar>
            <Box sx={{ display: { xs: "none", md: "block" } }}>
              <Typography variant="body2" fontWeight={600} lineHeight={1.2}>
                {user?.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.role}
              </Typography>
            </Box>
            <KeyboardArrowDownIcon
              sx={{
                fontSize: 18,
                color: "text.secondary",
                display: { xs: "none", md: "block" },
              }}
            />
          </ProfileButton>
        </Box>

        {/* Profile Dropdown Menu */}
        <Menu
          anchorEl={profileAnchor}
          open={Boolean(profileAnchor)}
          onClose={handleProfileClose}
          onClick={handleProfileClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 4px 20px rgba(0,0,0,0.1))",
              mt: 1.5,
              minWidth: 200,
              borderRadius: 3,
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 20,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2" fontWeight={600}>
              {user?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
          <Divider sx={{ my: 1 }} />
          <MenuItem
            onClick={onProfileClick}
            sx={{ py: 1.25, borderRadius: 2, mx: 1 }}
          >
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            My Profile
          </MenuItem>
          <MenuItem
            onClick={onSettingsClick}
            sx={{ py: 1.25, borderRadius: 2, mx: 1 }}
          >
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
          <Divider sx={{ my: 1 }} />
          <MenuItem
            onClick={onLogout}
            sx={{ py: 1.25, borderRadius: 2, mx: 1, color: "error.main" }}
          >
            <ListItemIcon>
              <LogoutIcon fontSize="small" color="error" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>

        {/* Notifications Popover */}
        <Popover
          anchorEl={notificationAnchor}
          open={Boolean(notificationAnchor)}
          onClose={handleNotificationClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            sx: {
              mt: 1.5,
              width: 360,
              maxHeight: 480,
              borderRadius: 3,
              boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
            },
          }}
        >
          <Box
            sx={{
              px: 3,
              py: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Typography
                variant="caption"
                color="primary"
                sx={{ cursor: "pointer" }}
              >
                Mark all as read
              </Typography>
            )}
          </Box>
          <Divider />
          <List sx={{ py: 1, maxHeight: 360, overflow: "auto" }}>
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <NotificationItem key={index}>
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        backgroundColor: notification.read
                          ? "grey.100"
                          : "primary.100",
                      }}
                    >
                      {notification.icon || (
                        <NotificationsIcon
                          color={notification.read ? "disabled" : "primary"}
                        />
                      )}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        fontWeight={notification.read ? 400 : 600}
                      >
                        {notification.title}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {notification.time}
                      </Typography>
                    }
                  />
                </NotificationItem>
              ))
            ) : (
              <Box py={4} textAlign="center">
                <Typography variant="body2" color="text.secondary">
                  No notifications yet
                </Typography>
              </Box>
            )}
          </List>
          <Divider />
          <Box sx={{ p: 2, textAlign: "center" }}>
            <Button size="small" sx={{ textTransform: "none" }}>
              View all notifications
            </Button>
          </Box>
        </Popover>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar;
