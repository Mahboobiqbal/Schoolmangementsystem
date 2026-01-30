import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getSubjectList } from "../../../redux/sclassRelated/sclassHandle";
import { deleteUser } from "../../../redux/userRelated/userHandle";
import PostAddIcon from "@mui/icons-material/PostAdd";
import { Paper, Box, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import TableTemplate from "../../../components/TableTemplate";
import { BlueButton, GreenButton } from "../../../components/buttonStyles";
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";
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
    { id: "sclassName", label: "Program", minWidth: 170 },
  ];

  const moduleRows = modulesList.map((module) => {
    return {
      subName: module.subName,
      sessions: module.sessions,
      sclassName: module.sclassName.sclassName,
      sclassID: module.sclassName._id,
      id: module._id,
    };
  });

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

  const actions = [
    {
      icon: <PostAddIcon color="primary" />,
      name: "Add New Module",
      action: () => navigate("/Admin/modules/chooseprogram"),
    },
    {
      icon: <DeleteIcon color="error" />,
      name: "Delete All Modules",
      action: () => deleteHandler(currentUser._id, "Subjects"),
    },
  ];

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {response ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "16px",
              }}
            >
              <GreenButton
                variant="contained"
                onClick={() => navigate("/Admin/modules/chooseprogram")}
              >
                Add Modules
              </GreenButton>
            </Box>
          ) : (
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              {Array.isArray(modulesList) && modulesList.length > 0 && (
                <TableTemplate
                  buttonHaver={ModulesButtonHaver}
                  columns={moduleColumns}
                  rows={moduleRows}
                />
              )}
              <SpeedDialTemplate actions={actions} />
            </Paper>
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
