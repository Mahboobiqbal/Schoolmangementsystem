import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getSubjectList } from "../../../redux/sclassRelated/sclassHandle";
import AddIcon from "@mui/icons-material/Add";
import { Paper, Box, IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import TableTemplate from "../../../components/TableTemplate";
import { BlueButton } from "../../../components/buttonStyles";
import { PrimaryButton } from "../../../components/ui/Buttons";
import { EmptyState } from "../../../components/ui";
import Popup from "../../../components/Popup";

const ShowModules = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    subjectsList: modulesList,
    loading,
    error,
    response,
  } = useSelector((state) => state.sclass);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getSubjectList(currentUser._id, "AllSubjects"));
  }, [currentUser._id, dispatch]);

  if (error) {
    console.log(error);
  }

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const deleteHandler = (deleteID, address) => {
    console.log(deleteID);
    console.log(address);
    setMessage("Sorry the delete function has been disabled for now.");
    setShowPopup(true);

    // dispatch(deleteUser(deleteID, address))
    //     .then(() => {
    //         dispatch(getSubjectList(currentUser._id, "AllSubjects"));
    //     })
  };

  const moduleColumns = [
    { id: "subName", label: "Module Name", minWidth: 170 },
    { id: "sessions", label: "Sessions", minWidth: 170 },
    { id: "programName", label: "Program", minWidth: 170 },
  ];

  const moduleRows =
    modulesList && modulesList.length > 0
      ? modulesList.map((module) => {
          const programRef = module.programName || module.sclassName;
          return {
            subName: module.moduleName || module.subName || "N/A",
            sessions: module.sessions || "N/A",
            programName: programRef
              ? programRef.programName || programRef.sclassName || "N/A"
              : "N/A",
            sclassID: programRef ? programRef._id : null,
            id: module._id,
          };
        })
      : [];

  const ModulesButtonHaver = ({ row }) => {
    return (
      <>
        <IconButton onClick={() => deleteHandler(row.id, "Subject")}>
          <DeleteIcon color="error" />
        </IconButton>
        <BlueButton
          variant="contained"
          onClick={() =>
            navigate(`/Admin/modules/module/${row.sclassID}/${row.id}`)
          }
        >
          View
        </BlueButton>
      </>
    );
  };

  return (
    <>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <Typography>Loading modules...</Typography>
        </Box>
      ) : (
        <>
          {response ? (
            <EmptyState
              title="No Modules Found"
              description="Get started by adding your first module to the system"
              action={
                <PrimaryButton
                  startIcon={<AddIcon />}
                  onClick={() => navigate("/Admin/modules/chooseprogram")}
                >
                  Add Module
                </PrimaryButton>
              }
            />
          ) : (
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
                  Modules
                </Typography>
                <PrimaryButton
                  startIcon={<AddIcon />}
                  onClick={() => navigate("/Admin/modules/chooseprogram")}
                >
                  Add Module
                </PrimaryButton>
              </Box>
              <Paper sx={{ width: "100%", overflow: "hidden" }}>
                {Array.isArray(modulesList) && modulesList.length > 0 && (
                  <TableTemplate
                    buttonHaver={ModulesButtonHaver}
                    columns={moduleColumns}
                    rows={moduleRows}
                  />
                )}
              </Paper>
            </Box>
          )}
        </>
      )}
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </>
  );
};

export default ShowModules;
