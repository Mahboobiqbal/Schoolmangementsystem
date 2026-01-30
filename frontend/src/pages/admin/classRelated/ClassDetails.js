import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getClassDetails,
  getClassStudents,
  getSubjectList,
} from "../../../redux/sclassRelated/sclassHandle";
import { deleteUser } from "../../../redux/userRelated/userHandle";
import { Box, Container, Typography, Tab, IconButton } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { resetSubjects } from "../../../redux/sclassRelated/sclassSlice";
import {
  BlueButton,
  GreenButton,
  PurpleButton,
} from "../../../components/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";
import Popup from "../../../components/Popup";
import DeleteIcon from "@mui/icons-material/Delete";
import PostAddIcon from "@mui/icons-material/PostAdd";

const ClassDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    subjectsList: modulesList,
    sclassStudents: programLearners,
    sclassDetails: programDetails,
    loading,
    error,
    response,
    getresponse,
  } = useSelector((state) => state.sclass);

  const programID = params.id;

  useEffect(() => {
    dispatch(getClassDetails(programID, "Sclass"));
    dispatch(getSubjectList(programID, "ClassSubjects"));
    dispatch(getClassStudents(programID));
  }, [dispatch, programID]);

  if (error) {
    console.log(error);
  }

  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const deleteHandler = (deleteID, address) => {
    console.log(deleteID);
    console.log(address);
    setMessage("Sorry the delete function has been disabled for now.");
    setShowPopup(true);
    // dispatch(deleteUser(deleteID, address))
    //     .then(() => {
    //         dispatch(getClassStudents(programID));
    //         dispatch(resetSubjects())
    //         dispatch(getSubjectList(programID, "ClassSubjects"))
    //     })
  };

  const moduleColumns = [
    { id: "name", label: "Module Name", minWidth: 170 },
    { id: "code", label: "Module Code", minWidth: 100 },
  ];

  const moduleRows =
    modulesList &&
    modulesList.length > 0 &&
    modulesList.map((module) => {
      return {
        name: module.subName,
        code: module.subCode,
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
          onClick={() => {
            navigate(`/Admin/program/module/${programID}/${row.id}`);
          }}
        >
          View
        </BlueButton>
      </>
    );
  };

  const moduleActions = [
    {
      icon: <PostAddIcon color="primary" />,
      name: "Add New Module",
      action: () => navigate("/Admin/addmodule/" + programID),
    },
    {
      icon: <DeleteIcon color="error" />,
      name: "Delete All Modules",
      action: () => deleteHandler(programID, "SubjectsClass"),
    },
  ];

  const ProgramModulesSection = () => {
    return (
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
              onClick={() => navigate("/Admin/addmodule/" + programID)}
            >
              Add Modules
            </GreenButton>
          </Box>
        ) : (
          <>
            <Typography variant="h5" gutterBottom>
              Modules List:
            </Typography>

            <TableTemplate
              buttonHaver={ModulesButtonHaver}
              columns={moduleColumns}
              rows={moduleRows}
            />
            <SpeedDialTemplate actions={moduleActions} />
          </>
        )}
      </>
    );
  };

  const learnerColumns = [
    { id: "name", label: "Name", minWidth: 170 },
    { id: "enrollmentId", label: "Enrollment ID", minWidth: 100 },
  ];

  const learnerRows = programLearners.map((learner) => {
    return {
      name: learner.name,
      enrollmentId: learner.rollNum,
      id: learner._id,
    };
  });

  const LearnersButtonHaver = ({ row }) => {
    return (
      <>
        <IconButton onClick={() => deleteHandler(row.id, "Student")}>
          <PersonRemoveIcon color="error" />
        </IconButton>
        <BlueButton
          variant="contained"
          onClick={() => navigate("/Admin/learners/learner/" + row.id)}
        >
          View
        </BlueButton>
        <PurpleButton
          variant="contained"
          onClick={() =>
            navigate("/Admin/learners/learner/participation/" + row.id)
          }
        >
          Participation
        </PurpleButton>
      </>
    );
  };

  const learnerActions = [
    {
      icon: <PersonAddAlt1Icon color="primary" />,
      name: "Add New Learner",
      action: () => navigate("/Admin/program/addlearners/" + programID),
    },
    {
      icon: <PersonRemoveIcon color="error" />,
      name: "Delete All Learners",
      action: () => deleteHandler(programID, "StudentsClass"),
    },
  ];

  const ProgramLearnersSection = () => {
    return (
      <>
        {getresponse ? (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "16px",
              }}
            >
              <GreenButton
                variant="contained"
                onClick={() =>
                  navigate("/Admin/program/addlearners/" + programID)
                }
              >
                Add Learners
              </GreenButton>
            </Box>
          </>
        ) : (
          <>
            <Typography variant="h5" gutterBottom>
              Learners List:
            </Typography>

            <TableTemplate
              buttonHaver={LearnersButtonHaver}
              columns={learnerColumns}
              rows={learnerRows}
            />
            <SpeedDialTemplate actions={learnerActions} />
          </>
        )}
      </>
    );
  };

  const ProgramFacultySection = () => {
    return <>Faculty</>;
  };

  const ProgramDetailsSection = () => {
    const numberOfModules = modulesList.length;
    const numberOfLearners = programLearners.length;

    return (
      <>
        <Typography variant="h4" align="center" gutterBottom>
          Program Details
        </Typography>
        <Typography variant="h5" gutterBottom>
          This is Program {programDetails && programDetails.sclassName}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Number of Modules: {numberOfModules}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Number of Learners: {numberOfLearners}
        </Typography>
        {getresponse && (
          <GreenButton
            variant="contained"
            onClick={() => navigate("/Admin/program/addlearners/" + programID)}
          >
            Add Learners
          </GreenButton>
        )}
        {response && (
          <GreenButton
            variant="contained"
            onClick={() => navigate("/Admin/addmodule/" + programID)}
          >
            Add Modules
          </GreenButton>
        )}
      </>
    );
  };

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChange}
                  sx={{
                    position: "fixed",
                    width: "100%",
                    bgcolor: "background.paper",
                    zIndex: 1,
                  }}
                >
                  <Tab label="Details" value="1" />
                  <Tab label="Modules" value="2" />
                  <Tab label="Learners" value="3" />
                  <Tab label="Faculty" value="4" />
                </TabList>
              </Box>
              <Container sx={{ marginTop: "3rem", marginBottom: "4rem" }}>
                <TabPanel value="1">
                  <ProgramDetailsSection />
                </TabPanel>
                <TabPanel value="2">
                  <ProgramModulesSection />
                </TabPanel>
                <TabPanel value="3">
                  <ProgramLearnersSection />
                </TabPanel>
                <TabPanel value="4">
                  <ProgramFacultySection />
                </TabPanel>
              </Container>
            </TabContext>
          </Box>
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

export default ClassDetails;
