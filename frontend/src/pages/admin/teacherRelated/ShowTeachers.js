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
import SchoolIcon from "@mui/icons-material/School";
import { getAllTeachers } from "../../../redux/teacherRelated/teacherHandle";
import { DataTable, EmptyState } from "../../../components/ui";
import { PrimaryButton } from "../../../components/ui/Buttons";
import Popup from "../../../components/Popup";

const ShowTeachers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { teachersList: facultyList, loading } = useSelector(
    (state) => state.teacher,
  );
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (!currentUser?._id) return;
    dispatch(getAllTeachers(currentUser._id));
  }, [currentUser, dispatch]);

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const deleteHandler = (deleteID, address) => {
    setMessage("Sorry the delete function has been disabled for now.");
    setShowPopup(true);
  };

  const columns = [
    {
      field: "name",
      headerName: "Faculty Name",
      label: "Faculty Name",
      flex: 1.2,
      minWidth: 180,
      renderCell: (params) => (
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: "secondary.main", width: 32, height: 32 }}>
            <SchoolIcon fontSize="small" />
          </Avatar>
          <Typography variant="body2">{params.value}</Typography>
        </Stack>
      ),
    },
    {
      field: "teachProgram",
      headerName: "Program",
      label: "Program",
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
      label: "Actions",
      flex: 0.8,
      minWidth: 120,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5}>
          <IconButton
            size="small"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/Admin/faculty/member/${params.row.id}`);
            }}
            title="View Details"
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              deleteHandler(params.row.id, "Teacher");
            }}
            title="Remove"
          >
            <PersonRemoveIcon fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  const rows =
    facultyList && facultyList.length > 0
      ? facultyList.map((faculty) => ({
          id: faculty._id,
          name: faculty.name,
          teachProgram: faculty.teachSclass?.sclassName || "N/A",
        }))
      : [];

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <Typography>Loading faculty...</Typography>
      </Box>
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
          Faculty Members
        </Typography>
        <PrimaryButton
          startIcon={<AddIcon />}
          onClick={() => navigate("/Admin/faculty/chooseprogram")}
        >
          Add Faculty
        </PrimaryButton>
      </Box>

      {rows.length > 0 ? (
        <DataTable columns={columns} rows={rows} />
      ) : (
        <EmptyState
          title="No Faculty Found"
          description="Get started by adding your first faculty member"
          actionLabel="Add Faculty"
          onAction={() => navigate("/Admin/faculty/chooseprogram")}
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

export default ShowTeachers;
