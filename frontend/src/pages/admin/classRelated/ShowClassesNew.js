import { useEffect, useState } from "react";
import { IconButton, Box, Typography, Chip, Stack } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllSclasses } from "../../../redux/sclassRelated/sclassHandle";
import { DataTable, EmptyState } from "../../../components/ui";
import { PrimaryButton } from "../../../components/ui/Buttons";
import Popup from "../../../components/Popup";

const ShowClasses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    sclassesList: programsList,
    loading,
    error,
    getresponse,
  } = useSelector((state) => state.sclass);
  const { currentUser } = useSelector((state) => state.user);
  const adminID = currentUser._id;

  useEffect(() => {
    dispatch(getAllSclasses(adminID, "Sclass"));
  }, [adminID, dispatch]);

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const deleteHandler = (deleteID, address) => {
    setMessage("Sorry the delete function has been disabled for now.");
    setShowPopup(true);
  };

  const columns = [
    {
      field: "programName",
      headerName: "Program Name",
      flex: 1.5,
      minWidth: 200,
    },
    {
      field: "programCode",
      headerName: "Code",
      flex: 0.7,
      minWidth: 100,
    },
    {
      field: "studentCount",
      headerName: "Learners",
      flex: 0.7,
      minWidth: 100,
      renderCell: (params) => (
        <Chip
          label={params.value || 0}
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
            onClick={() => navigate(`/Admin/programs/program/${params.row.id}`)}
            title="View Details"
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="success"
            onClick={() => navigate(`/Admin/addmodule/${params.row.id}`)}
            title="Add Modules"
          >
            <AddIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="info"
            onClick={() =>
              navigate(`/Admin/program/addlearners/${params.row.id}`)
            }
            title="Add Learner"
          >
            <PersonAddIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => deleteHandler(params.row.id, "Sclass")}
            title="Delete"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  const rows =
    programsList && programsList.length > 0
      ? programsList.map((program) => ({
          id: program._id,
          programName: program.sclassName || program.programName || "N/A",
          programCode: program.programCode || "N/A",
          studentCount: program.students?.length || 0,
        }))
      : [];

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <Typography>Loading programs...</Typography>
      </Box>
    );
  }

  if (getresponse) {
    return (
      <EmptyState
        title="No Programs Found"
        description="Get started by creating your first academic program"
        actionLabel="Add Program"
        onAction={() => navigate("/Admin/addprogram")}
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
          Academic Programs
        </Typography>
        <PrimaryButton
          startIcon={<AddIcon />}
          onClick={() => navigate("/Admin/addprogram")}
        >
          Add Program
        </PrimaryButton>
      </Box>

      {rows.length > 0 ? (
        <DataTable columns={columns} rows={rows} />
      ) : (
        <EmptyState
          title="No Programs Found"
          description="Get started by creating your first academic program"
          actionLabel="Add Program"
          onAction={() => navigate("/Admin/addprogram")}
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

export default ShowClasses;
