import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Stack,
  Avatar,
} from "@mui/material";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { getAllStudents } from "../../../redux/studentRelated/studentHandle";
import { DataTable, EmptyState } from "../../../components/ui";
import { PrimaryButton } from "../../../components/ui/Buttons";
import Popup from "../../../components/Popup";

const ShowStudents = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    studentsList: learnersList,
    loading,
    error: _error, // eslint-disable-line no-unused-vars
    response,
  } = useSelector((state) => state.student);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getAllStudents(currentUser._id));
  }, [currentUser._id, dispatch]);

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const deleteHandler = (deleteID, address) => {
    setMessage("Sorry the delete function has been disabled for now.");
    setShowPopup(true);
  };

  const columns = [
    {
      field: "name",
      headerName: "Learner Name",
      flex: 1.2,
      minWidth: 180,
      renderCell: (params) => (
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32 }}>
            {params.value?.charAt(0)}
          </Avatar>
          <Typography variant="body2">{params.value}</Typography>
        </Stack>
      ),
    },
    {
      field: "enrollmentId",
      headerName: "Enrollment ID",
      flex: 0.8,
      minWidth: 120,
    },
    {
      field: "programName",
      headerName: "Program",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color="primary"
          variant="outlined"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1.2,
      minWidth: 200,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton
            size="small"
            color="primary"
            onClick={() => navigate("/Admin/learners/learner/" + params.row.id)}
            title="View Details"
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="success"
            onClick={() =>
              navigate("/Admin/learners/learner/participation/" + params.row.id)
            }
            title="Track Participation"
          >
            <CheckCircleIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="info"
            onClick={() =>
              navigate("/Admin/learners/learner/marks/" + params.row.id)
            }
            title="Record Marks"
          >
            <AssignmentIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => deleteHandler(params.row.id, "Student")}
            title="Remove"
          >
            <PersonRemoveIcon fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  const rows =
    learnersList && learnersList.length > 0
      ? learnersList.map((learner) => ({
          id: learner._id,
          name: learner.name,
          enrollmentId: learner.rollNum || learner.enrollmentId,
          programName:
            learner.sclassName?.sclassName ||
            learner.programName?.programName ||
            "N/A",
        }))
      : [];

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <Typography>Loading learners...</Typography>
      </Box>
    );
  }

  if (response) {
    return (
      <EmptyState
        title="No Learners Found"
        description="Get started by adding your first learner to the system"
        actionLabel="Add Learner"
        onAction={() => navigate("/Admin/addlearners")}
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
          Learners
        </Typography>
        <PrimaryButton
          startIcon={<AddIcon />}
          onClick={() => navigate("/Admin/addlearners")}
        >
          Add Learner
        </PrimaryButton>
      </Box>

      {rows.length > 0 ? (
        <DataTable columns={columns} rows={rows} />
      ) : (
        <EmptyState
          title="No Learners Found"
          description="Get started by adding your first learner to the system"
          actionLabel="Add Learner"
          onAction={() => navigate("/Admin/addlearners")}
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

export default ShowStudents;
