import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Typography,
  Paper,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { getTeacherFreeClassSubjects } from "../../../redux/sclassRelated/sclassHandle";
import { updateTeachSubject } from "../../../redux/teacherRelated/teacherHandle";
import { GreenButton, PurpleButton } from "../../../components/buttonStyles";
import { StyledTableCell, StyledTableRow } from "../../../components/styles";

const ChooseModule = ({ situation }) => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [facultyID, setFacultyID] = useState("");
  const [loader, setLoader] = useState(false);

  const {
    subjectsList: modulesList,
    loading,
    error,
    response,
  } = useSelector((state) => state.sclass);

  useEffect(() => {
    if (situation === "Norm") {
      const programId = params.id;
      dispatch(getTeacherFreeClassSubjects(programId));
    } else if (situation === "Teacher") {
      const {
        classID,
        teacherID,
        programID: programIdParam,
        facultyID: facultyIdParam,
      } = params;
      setFacultyID(teacherID || facultyIdParam);
      dispatch(getTeacherFreeClassSubjects(classID || programIdParam));
    }
  }, [situation, params, dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  } else if (response) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
          p: 4,
        }}
      >
        <Typography variant="h5" gutterBottom color="text.secondary">
          No Available Modules
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          There are no modules without faculty in this program. Please add
          modules first or check if all modules already have faculty assigned.
        </Typography>
        <PurpleButton
          variant="contained"
          onClick={() => navigate("/Admin/modules/chooseprogram")}
        >
          Add Modules
        </PurpleButton>
      </Box>
    );
  } else if (error) {
    console.log(error);
  }

  const updateModuleHandler = (facultyId, teachModule) => {
    setLoader(true);
    dispatch(updateTeachSubject(facultyId, teachModule));
    navigate("/Admin/faculty");
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Typography variant="h6" gutterBottom component="div">
        Choose a module
      </Typography>
      <>
        <TableContainer>
          <Table aria-label="modules table">
            <TableHead>
              <StyledTableRow>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell align="center">Module Name</StyledTableCell>
                <StyledTableCell align="center">Module Code</StyledTableCell>
                <StyledTableCell align="center">Actions</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(modulesList) &&
                modulesList.length > 0 &&
                modulesList.map((module, index) => (
                  <StyledTableRow key={module._id}>
                    <StyledTableCell
                      component="th"
                      scope="row"
                      style={{ color: "white" }}
                    >
                      {index + 1}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {module.moduleName || module.subName || "N/A"}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {module.moduleCode || module.subCode || "N/A"}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {situation === "Norm" ? (
                        <GreenButton
                          variant="contained"
                          onClick={() =>
                            navigate("/Admin/faculty/addfaculty/" + module._id)
                          }
                        >
                          Choose
                        </GreenButton>
                      ) : (
                        <GreenButton
                          variant="contained"
                          disabled={loader}
                          onClick={() =>
                            updateModuleHandler(facultyID, module._id)
                          }
                        >
                          {loader ? (
                            <div className="load"></div>
                          ) : (
                            "Choose Module"
                          )}
                        </GreenButton>
                      )}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    </Paper>
  );
};

export default ChooseModule;
