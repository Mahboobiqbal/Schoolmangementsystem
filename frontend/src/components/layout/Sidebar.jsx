import React from "react";
import {
  Box,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  IconButton,
  Tooltip,
  Collapse,
  Badge,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import { Link, useLocation } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

// Drawer width constants
export const DRAWER_WIDTH = 280;
export const DRAWER_WIDTH_COLLAPSED = 80;

// Styled Components
const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: open ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  "& .MuiDrawer-paper": {
    width: open ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
    backgroundColor: "#0F172A",
    borderRight: "none",
    backgroundImage: "linear-gradient(180deg, #0F172A 0%, #1E293B 100%)",
  },
}));

const LogoWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(2, 2),
  minHeight: 70,
}));

const Logo = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
}));

const LogoIcon = styled(Avatar)(({ theme }) => ({
  width: 44,
  height: 44,
  background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
  fontSize: "1.25rem",
  fontWeight: 700,
}));

const NavItem = styled(ListItemButton)(({ theme, active }) => ({
  margin: "4px 12px",
  padding: "12px 16px",
  borderRadius: 12,
  color: active ? "#FFFFFF" : alpha("#FFFFFF", 0.7),
  backgroundColor: active ? alpha("#4F46E5", 0.2) : "transparent",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: active ? alpha("#4F46E5", 0.3) : alpha("#FFFFFF", 0.08),
    color: "#FFFFFF",
  },
  "& .MuiListItemIcon-root": {
    color: active ? "#818CF8" : alpha("#FFFFFF", 0.6),
    minWidth: 44,
    transition: "color 0.2s ease-in-out",
  },
  "& .MuiListItemText-primary": {
    fontWeight: active ? 600 : 500,
    fontSize: "0.9375rem",
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: "0.6875rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: alpha("#FFFFFF", 0.4),
  padding: theme.spacing(2, 3, 1, 3),
}));

const CollapseButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: alpha("#FFFFFF", 0.1),
  color: "#FFFFFF",
  width: 28,
  height: 28,
  "&:hover": {
    backgroundColor: alpha("#FFFFFF", 0.2),
  },
}));

const UserSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${alpha("#FFFFFF", 0.1)}`,
  marginTop: "auto",
}));

const UserInfo = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  padding: theme.spacing(1.5),
  borderRadius: 12,
  backgroundColor: alpha("#FFFFFF", 0.05),
  transition: "background-color 0.2s",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: alpha("#FFFFFF", 0.1),
  },
}));

// Sidebar Component
const Sidebar = ({
  open,
  onToggle,
  menuItems = [],
  sections = [],
  user,
  logo,
  title = "AMS",
}) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = React.useState({});

  const handleExpand = (itemId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const isActive = (path) => {
    if (path === "/" || path === "/Admin/dashboard") {
      return (
        location.pathname === "/" || location.pathname === "/Admin/dashboard"
      );
    }
    return location.pathname.startsWith(path);
  };

  const renderNavItem = (item, index) => {
    const active = isActive(item.path);
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems[item.id];

    return (
      <React.Fragment key={item.id || index}>
        <ListItem disablePadding sx={{ display: "block" }}>
          <Tooltip title={!open ? item.label : ""} placement="right" arrow>
            <NavItem
              active={active ? 1 : 0}
              component={hasChildren ? "div" : Link}
              to={hasChildren ? undefined : item.path}
              onClick={hasChildren ? () => handleExpand(item.id) : undefined}
              sx={{
                justifyContent: open ? "initial" : "center",
                px: open ? 2 : 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : "auto",
                  justifyContent: "center",
                }}
              >
                {item.badge ? (
                  <Badge badgeContent={item.badge} color="error" variant="dot">
                    {item.icon}
                  </Badge>
                ) : (
                  item.icon
                )}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{
                  opacity: open ? 1 : 0,
                  display: open ? "block" : "none",
                }}
              />
              {hasChildren &&
                open &&
                (isExpanded ? <ExpandLess /> : <ExpandMore />)}
            </NavItem>
          </Tooltip>
        </ListItem>
        {hasChildren && open && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map((child, childIndex) => (
                <ListItem
                  key={childIndex}
                  disablePadding
                  sx={{ display: "block" }}
                >
                  <NavItem
                    active={isActive(child.path) ? 1 : 0}
                    component={Link}
                    to={child.path}
                    sx={{ pl: 6 }}
                  >
                    <ListItemText primary={child.label} />
                  </NavItem>
                </ListItem>
              ))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  return (
    <StyledDrawer variant="permanent" open={open}>
      {/* Logo Section */}
      <LogoWrapper>
        <Logo sx={{ display: open ? "flex" : "none" }}>
          <LogoIcon>{logo || "A"}</LogoIcon>
          <Box>
            <Typography
              variant="h6"
              sx={{ color: "#FFFFFF", fontWeight: 700, lineHeight: 1.2 }}
            >
              {title}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: alpha("#FFFFFF", 0.5), fontSize: "0.6875rem" }}
            >
              Academic Portal
            </Typography>
          </Box>
        </Logo>
        {!open && <LogoIcon sx={{ mx: "auto" }}>{logo || "A"}</LogoIcon>}
        <CollapseButton
          onClick={onToggle}
          sx={{ display: open ? "flex" : "none" }}
        >
          <ChevronLeftIcon fontSize="small" />
        </CollapseButton>
      </LogoWrapper>

      <Divider sx={{ borderColor: alpha("#FFFFFF", 0.08) }} />

      {/* Navigation */}
      <Box sx={{ flex: 1, overflow: "auto", py: 1 }}>
        {sections.length > 0 ? (
          sections.map((section, sectionIndex) => (
            <React.Fragment key={sectionIndex}>
              {section.title && open && (
                <SectionTitle>{section.title}</SectionTitle>
              )}
              <List>
                {section.items.map((item, itemIndex) =>
                  renderNavItem(item, itemIndex),
                )}
              </List>
            </React.Fragment>
          ))
        ) : (
          <List>
            {menuItems.map((item, index) => renderNavItem(item, index))}
          </List>
        )}
      </Box>

      {/* Expand button when collapsed */}
      {!open && (
        <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
          <CollapseButton onClick={onToggle}>
            <ChevronRightIcon fontSize="small" />
          </CollapseButton>
        </Box>
      )}

      {/* User Section */}
      {user && open && (
        <UserSection>
          <UserInfo>
            <Avatar
              src={user.avatar}
              sx={{
                width: 40,
                height: 40,
                background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
              }}
            >
              {user.name?.charAt(0)}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{
                  color: "#FFFFFF",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user.name}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: alpha("#FFFFFF", 0.5) }}
              >
                {user.role}
              </Typography>
            </Box>
          </UserInfo>
        </UserSection>
      )}
    </StyledDrawer>
  );
};

export default Sidebar;
