import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  Box,
  Typography,
  Skeleton,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";

// Styled Components
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 16,
  border: `1px solid ${theme.palette.grey[100]}`,
  boxShadow: "0px 1px 3px rgba(15, 23, 42, 0.08)",
  overflow: "hidden",
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.grey[50],
  "& .MuiTableCell-head": {
    color: theme.palette.text.primary,
    fontWeight: 600,
    fontSize: "0.8125rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    borderBottom: `2px solid ${theme.palette.grey[200]}`,
    padding: "16px",
    whiteSpace: "nowrap",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  transition: "background-color 0.15s ease-in-out",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
  },
  "&:last-child td": {
    borderBottom: 0,
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: "16px",
  borderBottom: `1px solid ${theme.palette.grey[100]}`,
}));

const SearchField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 10,
    backgroundColor: theme.palette.background.paper,
    "& fieldset": {
      borderColor: theme.palette.grey[200],
    },
    "&:hover fieldset": {
      borderColor: theme.palette.grey[300],
    },
  },
}));

// Data Table Component
export const DataTable = ({
  columns,
  rows,
  loading = false,
  page = 0,
  rowsPerPage = 10,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
  onSort,
  sortBy,
  sortOrder,
  searchable = false,
  onSearch,
  searchPlaceholder = "Search...",
  emptyMessage = "No data available",
  onRowClick,
  actions,
  stickyHeader = true,
}) => {
  const handleSort = (column) => {
    if (onSort && column.sortable !== false) {
      const isAsc = sortBy === column.field && sortOrder === "asc";
      onSort(column.field, isAsc ? "desc" : "asc");
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <StyledTableContainer component={Paper}>
        <Table>
          <StyledTableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.field}>
                  <Skeleton width={80} />
                </TableCell>
              ))}
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column.field}>
                    <Skeleton />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
    );
  }

  return (
    <Box>
      {/* Search and Filter Bar */}
      {searchable && (
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <SearchField
            size="small"
            placeholder={searchPlaceholder}
            onChange={(e) => onSearch?.(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
          />
          <Tooltip title="Filter">
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      <StyledTableContainer component={Paper}>
        <Table stickyHeader={stickyHeader}>
          <StyledTableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.field}
                  align={column.align || "left"}
                  style={{
                    minWidth: column.minWidth,
                    width: column.flex ? `${column.flex * 100}px` : "auto",
                  }}
                >
                  {column.sortable !== false ? (
                    <TableSortLabel
                      active={sortBy === column.field}
                      direction={sortBy === column.field ? sortOrder : "asc"}
                      onClick={() => handleSort(column)}
                    >
                      {column.headerName || column.label}
                    </TableSortLabel>
                  ) : (
                    column.headerName || column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <StyledTableCell
                  colSpan={columns.length + (actions ? 1 : 0)}
                  align="center"
                >
                  <Box py={4}>
                    <Typography variant="body2" color="text.secondary">
                      {emptyMessage}
                    </Typography>
                  </Box>
                </StyledTableCell>
              </TableRow>
            ) : (
              rows.map((row, index) => (
                <StyledTableRow
                  key={row.id || index}
                  onClick={() => onRowClick?.(row)}
                  sx={{ cursor: onRowClick ? "pointer" : "default" }}
                >
                  {columns.map((column) => {
                    const cellContent = column.renderCell
                      ? column.renderCell({ value: row[column.field], row })
                      : row[column.field];

                    return (
                      <StyledTableCell
                        key={column.field}
                        align={column.align || "left"}
                      >
                        {cellContent}
                      </StyledTableCell>
                    );
                  })}
                  {actions && (
                    <StyledTableCell align="right">
                      {actions(row)}
                    </StyledTableCell>
                  )}
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>

      {/* Pagination */}
      {totalCount > 0 && onPageChange && (
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={(e, newPage) => onPageChange(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) =>
            onRowsPerPageChange?.(parseInt(e.target.value, 10))
          }
          rowsPerPageOptions={[5, 10, 25, 50]}
          sx={{
            borderTop: 1,
            borderColor: "grey.100",
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
              {
                fontSize: "0.875rem",
              },
          }}
        />
      )}
    </Box>
  );
};

// Simple Table for quick displays
export const SimpleTable = ({ headers, data, loading = false }) => {
  if (loading) {
    return (
      <Box>
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} height={48} sx={{ mb: 1 }} />
        ))}
      </Box>
    );
  }

  return (
    <StyledTableContainer component={Paper}>
      <Table size="small">
        <StyledTableHead>
          <TableRow>
            {headers.map((header, index) => (
              <TableCell key={index}>{header}</TableCell>
            ))}
          </TableRow>
        </StyledTableHead>
        <TableBody>
          {data.map((row, rowIndex) => (
            <StyledTableRow key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <StyledTableCell key={cellIndex}>{cell}</StyledTableCell>
              ))}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
};

// Status Badge Component
export const StatusBadge = ({ status, variant = "filled" }) => {
  const statusConfig = {
    active: { color: "success", label: "Active" },
    inactive: { color: "error", label: "Inactive" },
    pending: { color: "warning", label: "Pending" },
    completed: { color: "success", label: "Completed" },
    graded: { color: "info", label: "Graded" },
    enrolled: { color: "primary", label: "Enrolled" },
  };

  const config = statusConfig[status?.toLowerCase()] || {
    color: "default",
    label: status,
  };

  return (
    <Chip
      label={config.label}
      color={config.color}
      size="small"
      variant={variant}
      sx={{ fontWeight: 500 }}
    />
  );
};

// Avatar Cell Component
export const AvatarCell = ({ name, subtitle, avatar }) => {
  return (
    <Box display="flex" alignItems="center" gap={1.5}>
      <Avatar
        src={avatar}
        sx={{
          width: 40,
          height: 40,
          backgroundColor: "primary.100",
          color: "primary.main",
          fontWeight: 600,
        }}
      >
        {name?.charAt(0)}
      </Avatar>
      <Box>
        <Typography variant="body2" fontWeight={600}>
          {name}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default DataTable;
