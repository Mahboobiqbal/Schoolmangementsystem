import React, { useEffect } from "react";
import { getTeacherDetails } from "../../../redux/teacherRelated/teacherHandle";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Container, Typography } from "@mui/material";

const FacultyDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const {
    loading,
    teacherDetails: facultyDetails,
    error,
  } = useSelector((state) => state.teacher);

  const facultyID = params.id;

  useEffect(() => {
    dispatch(getTeacherDetails(facultyID));
  }, [dispatch, facultyID]);

  if (error) {
    console.log(error);
  }

  const isModuleNamePresent = facultyDetails?.teachSubject?.subName;

  const handleAddModule = () => {
    navigate(
      `/Admin/faculty/choosemodule/${facultyDetails?.teachSclass?._id}/${facultyDetails?._id}`,
    );
  };

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Container>
          <Typography variant="h4" align="center" gutterBottom>
            Faculty Details
          </Typography>
          <Typography variant="h6" gutterBottom>
            Faculty Name: {facultyDetails?.name}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Program Name: {facultyDetails?.teachSclass?.sclassName}
          </Typography>
          {isModuleNamePresent ? (
            <>
              <Typography variant="h6" gutterBottom>
                Module Name: {facultyDetails?.teachSubject?.subName}
              </Typography>
              <Typography variant="h6" gutterBottom>
                Module Sessions: {facultyDetails?.teachSubject?.sessions}
              </Typography>
            </>
          ) : (
            <Button variant="contained" onClick={handleAddModule}>
              Add Module
            </Button>
          )}
        </Container>
      )}
    </>
  );
};

export default FacultyDetails;
