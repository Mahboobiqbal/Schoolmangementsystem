import React, { useState } from "react";
import { Box, CssBaseline, useMediaQuery, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import Sidebar, { DRAWER_WIDTH, DRAWER_WIDTH_COLLAPSED } from "./Sidebar";
import Navbar from "./Navbar";

// Main Content Area
const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  flexGrow: 1,
  minHeight: "100vh",
  backgroundColor: theme.palette.grey[50],
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
  paddingTop: 70, // Navbar height
  [theme.breakpoints.up("sm")]: {
    marginLeft: open ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED,
    width: `calc(100% - ${open ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED}px)`,
  },
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  [theme.breakpoints.up("lg")]: {
    padding: theme.spacing(5),
  },
}));

// Main Layout Component
const MainLayout = ({
  children,
  menuItems = [],
  sections = [],
  user,
  onLogout,
  onProfileClick,
  onSettingsClick,
  notifications = [],
  pageTitle,
  logo,
  appTitle = "AMS",
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onToggle={handleToggleSidebar}
        menuItems={menuItems}
        sections={sections}
        user={user}
        logo={logo}
        title={appTitle}
      />

      {/* Navbar */}
      <Navbar
        open={sidebarOpen}
        onMenuClick={handleToggleSidebar}
        user={user}
        onLogout={onLogout}
        onProfileClick={onProfileClick}
        onSettingsClick={onSettingsClick}
        notifications={notifications}
        pageTitle={pageTitle}
      />

      {/* Main Content */}
      <Main open={sidebarOpen}>
        <ContentWrapper>{children}</ContentWrapper>
      </Main>
    </Box>
  );
};

export default MainLayout;
export { Sidebar, Navbar, DRAWER_WIDTH, DRAWER_WIDTH_COLLAPSED };
