import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Typography } from "@mui/material";
import { getAllSclasses } from "../../../redux/sclassRelated/sclassHandle";
import { useNavigate } from "react-router-dom";
import { PurpleButton } from "../../../components/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";

const ChooseProgram = ({ situation }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    sclassesList: programsList,
    loading,
    error,
    getresponse,
  } = useSelector((state) => state.sclass);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getAllSclasses(currentUser._id, "Sclass"));
  }, [currentUser._id, dispatch]);

  if (error) {
    console.log(error);
  }

  const navigateHandler = (programID) => {
    if (situation === "Teacher") {
      navigate("/Admin/faculty/choosemodule/" + programID);
    } else if (situation === "Subject") {
      navigate("/Admin/addmodule/" + programID);
    }
  };

  const programColumns = [{ id: "name", label: "Program Name", minWidth: 170 }];

  const programRows =
    programsList &&
    programsList.length > 0 &&
    programsList.map((program) => {
      return {
        name: program.programName || program.sclassName || "Unnamed Program",
        id: program._id,
      };
    });

  const ProgramButtonHaver = ({ row }) => {
    return (
      <>
        <PurpleButton
          variant="contained"
          onClick={() => navigateHandler(row.id)}
        >
          Choose
        </PurpleButton>
      </>
    );
  };

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {getresponse ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "16px",
              }}
            >
              <Button
                variant="contained"
                onClick={() => navigate("/Admin/addprogram")}
              >
                Add Program
              </Button>
            </Box>
          ) : (
            <>
              <Typography variant="h6" gutterBottom component="div">
                Choose a program
              </Typography>
              {Array.isArray(programsList) && programsList.length > 0 && (
                <TableTemplate
                  buttonHaver={ProgramButtonHaver}
                  columns={programColumns}
                  rows={programRows}
                />
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default ChooseProgram;
