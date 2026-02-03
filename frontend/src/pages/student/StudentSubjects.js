import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSubjectList } from "../../redux/sclassRelated/sclassHandle";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableHead,
} from "@mui/material";
import { getUserDetails } from "../../redux/userRelated/userHandle";
import { styled } from "@mui/material/styles";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { StyledTableCell, StyledTableRow } from "../../components/styles";

const LearnerModules = () => {
  const dispatch = useDispatch();
  const { subjectsList: modulesList } = useSelector((state) => state.sclass);
  const { userDetails, currentUser, loading, response, error } = useSelector(
    (state) => state.user,
  );

  const [moduleMarks, setModuleMarks] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!currentUser?._id) return;
    dispatch(getUserDetails(currentUser._id, "Student"));
  }, [dispatch, currentUser]);

  useEffect(() => {
    if (userDetails) {
      setModuleMarks(userDetails.examResult || []);
    }
  }, [userDetails]);

  useEffect(() => {
    if (!currentUser) return;

    const classID = currentUser.sclassName?._id || currentUser.programName?._id;
    if (moduleMarks.length === 0 && classID) {
      dispatch(getSubjectList(classID, "ClassSubjects"));
    }
  }, [moduleMarks, dispatch, currentUser]);

  // Early return if currentUser is not loaded yet
  if (!currentUser) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (response) {
    console.log(response);
  } else if (error) {
    console.log(error);
  }

  const handleOpenDialog = (module) => {
    setSelectedModule(module);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedModule(null);
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            📚 My Modules
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View your enrolled modules and track your academic progress
          </Typography>
        </Box>

        {loading ? (
          <Typography variant="h6" align="center">
            Loading modules...
          </Typography>
        ) : modulesList && modulesList.length > 0 ? (
          <>
            {/* Modules Grid */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {modulesList.map((module, index) => {
                const moduleMarksData = moduleMarks.find(
                  (m) => m.subName && m.subName._id === module._id,
                );
                return (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <ModuleCard>
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            mb: 2,
                          }}
                        >
                          <MenuBookIcon
                            sx={{ color: "#4F46E5", mr: 1, mt: 0.5 }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 600,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {module.subName}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {module.subCode}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Chip
                            label={`${module.sessions} Sessions`}
                            size="small"
                            variant="outlined"
                            sx={{ mr: 1 }}
                          />
                          <Chip label="Core" size="small" color="primary" />
                        </Box>

                        {moduleMarksData && (
                          <Box
                            sx={{
                              my: 2,
                              p: 1.5,
                              bgcolor: "#f3f4f6",
                              borderRadius: 1,
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Marks Obtained
                            </Typography>
                            <Typography
                              variant="h5"
                              sx={{
                                fontWeight: 700,
                                color:
                                  moduleMarksData.marksObtained >= 70
                                    ? "#10B981"
                                    : "#F97316",
                              }}
                            >
                              {moduleMarksData.marksObtained}%
                            </Typography>
                          </Box>
                        )}

                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => handleOpenDialog(module)}
                          sx={{ mt: 2 }}
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </ModuleCard>
                  </Grid>
                );
              })}
            </Grid>

            {/* Marks Summary */}
            {moduleMarks && moduleMarks.length > 0 && (
              <Card elevation={0} sx={{ border: "1px solid #e5e7eb" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    📊 Marks Summary
                  </Typography>
                  <Table>
                    <TableHead>
                      <StyledTableRow>
                        <StyledTableCell>Module</StyledTableCell>
                        <StyledTableCell>Code</StyledTableCell>
                        <StyledTableCell>Marks Obtained</StyledTableCell>
                        <StyledTableCell>Grade</StyledTableCell>
                      </StyledTableRow>
                    </TableHead>
                    <TableBody>
                      {moduleMarks.map((result, index) => {
                        if (!result.subName || !result.marksObtained) {
                          return null;
                        }
                        const grade =
                          result.marksObtained >= 90
                            ? "A+"
                            : result.marksObtained >= 80
                              ? "A"
                              : result.marksObtained >= 70
                                ? "B"
                                : "C";
                        return (
                          <StyledTableRow key={index}>
                            <StyledTableCell>
                              {result.subName.subName}
                            </StyledTableCell>
                            <StyledTableCell>
                              {result.subName.subCode}
                            </StyledTableCell>
                            <StyledTableCell>
                              {result.marksObtained}%
                            </StyledTableCell>
                            <StyledTableCell>
                              <Chip
                                label={grade}
                                color={
                                  grade === "A+" || grade === "A"
                                    ? "success"
                                    : grade === "B"
                                      ? "warning"
                                      : "error"
                                }
                                size="small"
                              />
                            </StyledTableCell>
                          </StyledTableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <Card elevation={0} sx={{ textAlign: "center", py: 6 }}>
            <MenuBookIcon sx={{ fontSize: 64, color: "#d1d5db", mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No modules found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You will see your enrolled modules here
            </Typography>
          </Card>
        )}

        {/* Module Details Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          {selectedModule && (
            <>
              <DialogTitle sx={{ fontWeight: 600 }}>
                {selectedModule.subName}
              </DialogTitle>
              <DialogContent>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Code:</strong> {selectedModule.subCode}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    <strong>Sessions:</strong> {selectedModule.sessions}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    <strong>Type:</strong> Core Module
                  </Typography>
                  <Box sx={{ mt: 3 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleCloseDialog}
                      sx={{ mt: 2 }}
                    >
                      Close
                    </Button>
                  </Box>
                </Box>
              </DialogContent>
            </>
          )}
        </Dialog>
      </Container>
    </>
  );
};

const ModuleCard = styled(Card)`
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  height: 100%;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    border-color: #d1d5db;
  }
`;

export default LearnerModules;
