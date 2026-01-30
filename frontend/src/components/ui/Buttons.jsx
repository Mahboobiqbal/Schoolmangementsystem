import React from "react";
import {
  Button as MuiButton,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";

// Primary Button with Gradient
export const PrimaryButton = styled(MuiButton)(({ theme }) => ({
  background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
  color: "#FFFFFF",
  fontWeight: 600,
  padding: "12px 24px",
  borderRadius: 10,
  textTransform: "none",
  boxShadow: "0 4px 14px 0 rgba(79, 70, 229, 0.39)",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    background: "linear-gradient(135deg, #4338CA 0%, #6D28D9 100%)",
    boxShadow: "0 6px 20px 0 rgba(79, 70, 229, 0.5)",
    transform: "translateY(-2px)",
  },
  "&:active": {
    transform: "translateY(0)",
  },
  "&:disabled": {
    background: theme.palette.grey[300],
    color: theme.palette.grey[500],
    boxShadow: "none",
  },
}));

// Secondary Button
export const SecondaryButton = styled(MuiButton)(({ theme }) => ({
  background: "linear-gradient(135deg, #14B8A6 0%, #0EA5E9 100%)",
  color: "#FFFFFF",
  fontWeight: 600,
  padding: "12px 24px",
  borderRadius: 10,
  textTransform: "none",
  boxShadow: "0 4px 14px 0 rgba(20, 184, 166, 0.39)",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    background: "linear-gradient(135deg, #0F766E 0%, #0284C7 100%)",
    boxShadow: "0 6px 20px 0 rgba(20, 184, 166, 0.5)",
    transform: "translateY(-2px)",
  },
}));

// Outline Button
export const OutlineButton = styled(MuiButton)(({ theme }) => ({
  backgroundColor: "transparent",
  color: theme.palette.primary.main,
  fontWeight: 600,
  padding: "11px 23px",
  borderRadius: 10,
  textTransform: "none",
  border: `2px solid ${theme.palette.primary.main}`,
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    borderColor: theme.palette.primary.dark,
    transform: "translateY(-2px)",
  },
}));

// Ghost Button
export const GhostButton = styled(MuiButton)(({ theme }) => ({
  backgroundColor: "transparent",
  color: theme.palette.text.secondary,
  fontWeight: 500,
  padding: "10px 20px",
  borderRadius: 10,
  textTransform: "none",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: theme.palette.grey[100],
    color: theme.palette.text.primary,
  },
}));

// Success Button
export const SuccessButton = styled(MuiButton)(({ theme }) => ({
  background: "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
  color: "#FFFFFF",
  fontWeight: 600,
  padding: "12px 24px",
  borderRadius: 10,
  textTransform: "none",
  boxShadow: "0 4px 14px 0 rgba(16, 185, 129, 0.39)",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    background: "linear-gradient(135deg, #059669 0%, #10B981 100%)",
    boxShadow: "0 6px 20px 0 rgba(16, 185, 129, 0.5)",
    transform: "translateY(-2px)",
  },
}));

// Danger Button
export const DangerButton = styled(MuiButton)(({ theme }) => ({
  background: "linear-gradient(135deg, #EF4444 0%, #F87171 100%)",
  color: "#FFFFFF",
  fontWeight: 600,
  padding: "12px 24px",
  borderRadius: 10,
  textTransform: "none",
  boxShadow: "0 4px 14px 0 rgba(239, 68, 68, 0.39)",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    background: "linear-gradient(135deg, #DC2626 0%, #EF4444 100%)",
    boxShadow: "0 6px 20px 0 rgba(239, 68, 68, 0.5)",
    transform: "translateY(-2px)",
  },
}));

// Warning Button
export const WarningButton = styled(MuiButton)(({ theme }) => ({
  background: "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)",
  color: "#1E293B",
  fontWeight: 600,
  padding: "12px 24px",
  borderRadius: 10,
  textTransform: "none",
  boxShadow: "0 4px 14px 0 rgba(245, 158, 11, 0.39)",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    background: "linear-gradient(135deg, #D97706 0%, #F59E0B 100%)",
    boxShadow: "0 6px 20px 0 rgba(245, 158, 11, 0.5)",
    transform: "translateY(-2px)",
  },
}));

// Icon Button Styled
export const StyledIconButton = styled(IconButton)(({ theme }) => ({
  borderRadius: 10,
  padding: 10,
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
  },
}));

// Loading Button Component
export const LoadingButton = ({ loading, children, startIcon, ...props }) => {
  return (
    <PrimaryButton
      {...props}
      disabled={loading || props.disabled}
      startIcon={loading ? null : startIcon}
    >
      {loading ? (
        <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
      ) : null}
      {children}
    </PrimaryButton>
  );
};

// Action Button with Tooltip
export const ActionButton = ({
  tooltip,
  icon,
  onClick,
  color = "primary",
  size = "medium",
}) => {
  return (
    <Tooltip title={tooltip} arrow>
      <StyledIconButton onClick={onClick} color={color} size={size}>
        {icon}
      </StyledIconButton>
    </Tooltip>
  );
};

// Button Group Wrapper
export const ButtonGroup = styled("div")(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  flexWrap: "wrap",
}));

// Legacy Button Exports (for backward compatibility)
export const BlueButton = PrimaryButton;
export const GreenButton = SuccessButton;
export const RedButton = DangerButton;
export const BlackButton = styled(MuiButton)(({ theme }) => ({
  backgroundColor: "#1E293B",
  color: "#FFFFFF",
  fontWeight: 600,
  padding: "12px 24px",
  borderRadius: 10,
  textTransform: "none",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: "#0F172A",
    transform: "translateY(-2px)",
  },
}));

export const PurpleButton = styled(MuiButton)(({ theme }) => ({
  background: "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
  color: "#FFFFFF",
  fontWeight: 600,
  padding: "12px 24px",
  borderRadius: 10,
  textTransform: "none",
  boxShadow: "0 4px 14px 0 rgba(139, 92, 246, 0.39)",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    background: "linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)",
    boxShadow: "0 6px 20px 0 rgba(139, 92, 246, 0.5)",
    transform: "translateY(-2px)",
  },
}));

export const LightPurpleButton = PurpleButton;
export const DarkRedButton = DangerButton;
