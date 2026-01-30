import React from "react";
import {
  Box,
  Typography,
  Skeleton,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";

// Animations
const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// Styled Components
const LoaderOverlay = styled(Box)(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(4px)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
  animation: `${fadeIn} 0.2s ease-out`,
}));

const GradientCircularProgress = styled(CircularProgress)(({ theme }) => ({
  "& .MuiCircularProgress-circle": {
    strokeLinecap: "round",
  },
}));

const SkeletonCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.grey[100]}`,
}));

const ShimmerBox = styled(Box)(({ theme }) => ({
  background: `linear-gradient(
    90deg,
    ${theme.palette.grey[200]} 0%,
    ${theme.palette.grey[100]} 50%,
    ${theme.palette.grey[200]} 100%
  )`,
  backgroundSize: "200% 100%",
  animation: `${shimmer} 1.5s infinite`,
  borderRadius: 8,
}));

// Page Loader Component
export const PageLoader = ({ message = "Loading..." }) => {
  return (
    <LoaderOverlay>
      <Box sx={{ position: "relative", display: "inline-flex", mb: 3 }}>
        <GradientCircularProgress
          size={60}
          thickness={4}
          sx={{
            color: "primary.main",
          }}
        />
      </Box>
      <Typography variant="body1" color="text.secondary" fontWeight={500}>
        {message}
      </Typography>
    </LoaderOverlay>
  );
};

// Inline Loader Component
export const InlineLoader = ({ size = 24, color = "primary" }) => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" py={2}>
      <CircularProgress size={size} color={color} />
    </Box>
  );
};

// Progress Bar Loader
export const ProgressLoader = ({ value, label, showPercentage = true }) => {
  return (
    <Box sx={{ width: "100%" }}>
      {label && (
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          {showPercentage && (
            <Typography variant="body2" color="primary.main" fontWeight={600}>
              {value}%
            </Typography>
          )}
        </Box>
      )}
      <LinearProgress
        variant="determinate"
        value={value}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: "grey.100",
          "& .MuiLinearProgress-bar": {
            borderRadius: 4,
            background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
          },
        }}
      />
    </Box>
  );
};

// Card Skeleton Component
export const CardSkeleton = ({ variant = "stats" }) => {
  if (variant === "stats") {
    return (
      <SkeletonCard>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box flex={1}>
            <Skeleton width={100} height={20} sx={{ mb: 1 }} />
            <Skeleton width={80} height={40} sx={{ mb: 1 }} />
            <Skeleton width={60} height={24} />
          </Box>
          <Skeleton variant="circular" width={56} height={56} />
        </Box>
      </SkeletonCard>
    );
  }

  if (variant === "profile") {
    return (
      <SkeletonCard>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Skeleton variant="circular" width={80} height={80} sx={{ mb: 2 }} />
          <Skeleton width={120} height={28} sx={{ mb: 1 }} />
          <Skeleton width={80} height={20} sx={{ mb: 1 }} />
          <Skeleton width={160} height={16} />
        </Box>
      </SkeletonCard>
    );
  }

  if (variant === "list") {
    return (
      <SkeletonCard>
        {[...Array(5)].map((_, i) => (
          <Box key={i} display="flex" alignItems="center" gap={2} py={1.5}>
            <Skeleton variant="circular" width={40} height={40} />
            <Box flex={1}>
              <Skeleton width="60%" height={20} />
              <Skeleton width="40%" height={16} />
            </Box>
            <Skeleton width={60} height={24} />
          </Box>
        ))}
      </SkeletonCard>
    );
  }

  return (
    <SkeletonCard>
      <Skeleton width="100%" height={200} />
    </SkeletonCard>
  );
};

// Table Skeleton Component
export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <Box
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        border: 1,
        borderColor: "grey.100",
      }}
    >
      {/* Header */}
      <Box sx={{ bgcolor: "grey.50", p: 2, display: "flex", gap: 2 }}>
        {[...Array(columns)].map((_, i) => (
          <Skeleton key={i} width={100} height={20} />
        ))}
      </Box>
      {/* Rows */}
      {[...Array(rows)].map((_, rowIndex) => (
        <Box
          key={rowIndex}
          sx={{
            p: 2,
            display: "flex",
            gap: 2,
            borderTop: 1,
            borderColor: "grey.100",
          }}
        >
          {[...Array(columns)].map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              width={colIndex === 0 ? 150 : 100}
              height={20}
            />
          ))}
        </Box>
      ))}
    </Box>
  );
};

// Chart Skeleton Component
export const ChartSkeleton = ({ height = 300 }) => {
  return (
    <SkeletonCard>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Skeleton width={120} height={24} />
        <Skeleton width={80} height={32} />
      </Box>
      <Skeleton
        variant="rectangular"
        width="100%"
        height={height}
        sx={{ borderRadius: 2 }}
      />
    </SkeletonCard>
  );
};

// Empty State Component
export const EmptyState = ({
  icon,
  title = "No data found",
  description = "There are no items to display at the moment.",
  action,
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      py={8}
      px={3}
      textAlign="center"
    >
      {icon && (
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            backgroundColor: "grey.100",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 3,
            color: "grey.400",
          }}
        >
          {icon}
        </Box>
      )}
      <Typography variant="h6" fontWeight={600} gutterBottom>
        {title}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ maxWidth: 400, mb: 3 }}
      >
        {description}
      </Typography>
      {action}
    </Box>
  );
};

// Shimmer Placeholder
export const ShimmerPlaceholder = ({ width, height, borderRadius = 8 }) => {
  return (
    <ShimmerBox
      sx={{
        width: width || "100%",
        height: height || 20,
        borderRadius: `${borderRadius}px`,
      }}
    />
  );
};

export default PageLoader;
