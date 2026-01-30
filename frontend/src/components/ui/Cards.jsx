import React from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Tooltip,
  Skeleton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CountUp from "react-countup";

// Styled Components
const StyledCard = styled(Box)(({ theme, gradient }) => ({
  position: "relative",
  padding: theme.spacing(3),
  borderRadius: 16,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.grey[100]}`,
  boxShadow:
    "0px 1px 3px rgba(15, 23, 42, 0.08), 0px 1px 2px rgba(15, 23, 42, 0.06)",
  transition: "all 0.3s ease-in-out",
  overflow: "hidden",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0px 10px 40px rgba(15, 23, 42, 0.12)",
  },
  ...(gradient && {
    background: gradient,
    color: "#FFFFFF",
    border: "none",
    "& .MuiTypography-root": {
      color: "#FFFFFF",
    },
  }),
}));

const IconWrapper = styled(Avatar)(({ theme, bgcolor }) => ({
  width: 56,
  height: 56,
  backgroundColor: bgcolor || theme.palette.primary.main,
  boxShadow: `0 4px 14px 0 ${bgcolor ? bgcolor + "40" : theme.palette.primary.main + "40"}`,
}));

const TrendBadge = styled(Box)(({ theme, trend }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  padding: "4px 10px",
  borderRadius: 20,
  fontSize: "0.75rem",
  fontWeight: 600,
  backgroundColor:
    trend > 0 ? theme.palette.success.light : theme.palette.error.light,
  color: trend > 0 ? theme.palette.success.dark : theme.palette.error.dark,
}));

// Stats Card Component
export const StatsCard = ({
  title,
  value,
  icon,
  trend,
  trendLabel,
  subtitle,
  prefix,
  suffix,
  decimals = 0,
  duration = 2.5,
  gradient,
  iconBg,
  loading = false,
}) => {
  if (loading) {
    return (
      <StyledCard>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box flex={1}>
            <Skeleton width={100} height={20} />
            <Skeleton width={80} height={48} sx={{ my: 1 }} />
            <Skeleton width={120} height={16} />
          </Box>
          <Skeleton variant="circular" width={56} height={56} />
        </Box>
      </StyledCard>
    );
  }

  return (
    <StyledCard gradient={gradient}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Box flex={1}>
          <Typography
            variant="body2"
            sx={{
              color: gradient ? "rgba(255,255,255,0.8)" : "text.secondary",
              fontWeight: 500,
              mb: 1,
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 1,
              fontSize: { xs: "1.75rem", md: "2rem" },
            }}
          >
            <CountUp
              start={0}
              end={value}
              duration={duration}
              prefix={prefix}
              suffix={suffix}
              decimals={decimals}
              separator=","
            />
          </Typography>
          {trend !== undefined && (
            <TrendBadge trend={trend}>
              {trend > 0 ? (
                <TrendingUpIcon sx={{ fontSize: 14 }} />
              ) : (
                <TrendingDownIcon sx={{ fontSize: 14 }} />
              )}
              {Math.abs(trend)}%
              {trendLabel && (
                <span style={{ opacity: 0.8, marginLeft: 4 }}>
                  {trendLabel}
                </span>
              )}
            </TrendBadge>
          )}
          {subtitle && (
            <Typography
              variant="caption"
              sx={{
                color: gradient ? "rgba(255,255,255,0.7)" : "text.secondary",
                mt: 1,
                display: "block",
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
        <IconWrapper bgcolor={iconBg}>{icon}</IconWrapper>
      </Box>
    </StyledCard>
  );
};

// Info Card Component
export const InfoCard = ({
  title,
  subtitle,
  children,
  action,
  headerAction,
  elevation = 0,
  noPadding = false,
}) => {
  return (
    <StyledCard sx={{ p: noPadding ? 0 : 3 }}>
      {(title || headerAction) && (
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2, px: noPadding ? 3 : 0, pt: noPadding ? 3 : 0 }}
        >
          <Box>
            {title && (
              <Typography variant="h6" fontWeight={600}>
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          {headerAction && <Box>{headerAction}</Box>}
        </Box>
      )}
      <Box sx={{ px: noPadding ? 0 : 0 }}>{children}</Box>
      {action && (
        <Box sx={{ mt: 2, px: noPadding ? 3 : 0, pb: noPadding ? 3 : 0 }}>
          {action}
        </Box>
      )}
    </StyledCard>
  );
};

// Profile Card Component
export const ProfileCard = ({
  name,
  role,
  email,
  avatar,
  stats,
  actions,
  loading = false,
}) => {
  if (loading) {
    return (
      <StyledCard>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          textAlign="center"
        >
          <Skeleton variant="circular" width={80} height={80} sx={{ mb: 2 }} />
          <Skeleton width={120} height={28} sx={{ mb: 1 }} />
          <Skeleton width={80} height={20} sx={{ mb: 1 }} />
          <Skeleton width={160} height={16} />
        </Box>
      </StyledCard>
    );
  }

  return (
    <StyledCard>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        textAlign="center"
      >
        <Avatar
          src={avatar}
          sx={{
            width: 80,
            height: 80,
            mb: 2,
            fontSize: "2rem",
            background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
          }}
        >
          {name?.charAt(0)}
        </Avatar>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          {name}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "primary.main",
            backgroundColor: "primary.50",
            px: 2,
            py: 0.5,
            borderRadius: 10,
            fontWeight: 500,
            mb: 1,
          }}
        >
          {role}
        </Typography>
        {email && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {email}
          </Typography>
        )}
        {stats && (
          <Box
            display="flex"
            gap={3}
            mt={2}
            pt={2}
            borderTop={1}
            borderColor="grey.100"
            width="100%"
          >
            {stats.map((stat, index) => (
              <Box key={index} flex={1} textAlign="center">
                <Typography variant="h6" fontWeight={700} color="primary.main">
                  {stat.value}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
        {actions && (
          <Box display="flex" gap={1} mt={3} width="100%">
            {actions}
          </Box>
        )}
      </Box>
    </StyledCard>
  );
};

// Quick Action Card Component
export const QuickActionCard = ({
  icon,
  title,
  description,
  onClick,
  color = "primary",
}) => {
  return (
    <StyledCard
      onClick={onClick}
      sx={{
        cursor: "pointer",
        textAlign: "center",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0px 10px 40px rgba(15, 23, 42, 0.12)",
          "& .action-icon": {
            transform: "scale(1.1)",
          },
        },
      }}
    >
      <Avatar
        className="action-icon"
        sx={{
          width: 64,
          height: 64,
          mx: "auto",
          mb: 2,
          background: `linear-gradient(135deg, ${color === "primary" ? "#4F46E5" : color} 0%, ${color === "primary" ? "#7C3AED" : color} 100%)`,
          transition: "transform 0.2s ease-in-out",
        }}
      >
        {icon}
      </Avatar>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      )}
    </StyledCard>
  );
};

export default StatsCard;
