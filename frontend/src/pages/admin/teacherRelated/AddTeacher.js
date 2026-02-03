import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getSubjectDetails } from "../../../redux/sclassRelated/sclassHandle";
import Popup from "../../../components/Popup";
import { registerUser } from "../../../redux/userRelated/userHandle";
import { underControl } from "../../../redux/userRelated/userSlice";
import { CircularProgress } from "@mui/material";

const AddFaculty = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const moduleID = params.id;

  console.log("AddTeacher mounted with moduleID:", moduleID);
  console.log("Params object:", params);

  const { status, response, error } = useSelector((state) => state.user);
  const { subjectDetails: moduleDetails, loading: moduleLoading } = useSelector(
    (state) => state.sclass,
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (moduleID && moduleID !== "undefined" && moduleID !== "null") {
      console.log("Loading module details for ID:", moduleID);
      dispatch(getSubjectDetails(moduleID, "Subject"));
    }
  }, [dispatch, moduleID]);

  useEffect(() => {
    if (status === "added") {
      dispatch(underControl());
      navigate("/Admin/faculty");
    } else if (status === "failed") {
      setMessage(response);
      setShowPopup(true);
      setLoader(false);
    } else if (status === "error") {
      setMessage("Network Error");
      setShowPopup(true);
      setLoader(false);
    }
  }, [status, navigate, error, response, dispatch]);

  // Validate moduleID before fetching
  if (!moduleID || moduleID === "undefined" || moduleID === "null") {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Error: Invalid Module ID</h2>
        <p>The module ID is missing or invalid.</p>
        <p>Module ID received: "{moduleID}"</p>
        <button
          onClick={() => navigate("/Admin/faculty/chooseprogram")}
          style={{
            padding: "10px 20px",
            marginTop: "20px",
            cursor: "pointer",
            backgroundColor: "#4F46E5",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Go Back to Program Selection
        </button>
      </div>
    );
  }

  // Check if module details has an error message
  if (moduleDetails && moduleDetails.message) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Error Loading Module</h2>
        <p>Module not found. The module ID might be invalid.</p>
        <p>Module ID: {moduleID}</p>
        <p>Error: {moduleDetails.message}</p>
        <button
          onClick={() => navigate("/Admin/faculty/chooseprogram")}
          style={{
            padding: "10px 20px",
            marginTop: "20px",
            cursor: "pointer",
            backgroundColor: "#4F46E5",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Go Back to Program Selection
        </button>
      </div>
    );
  }

  if (moduleLoading) {
    return <div style={{ padding: "20px" }}>Loading module details...</div>;
  }

  const role = "Faculty";
  const institution =
    moduleDetails && (moduleDetails.institution || moduleDetails.school);
  const assignedModule = moduleDetails && moduleDetails._id;
  const assignedProgram =
    moduleDetails &&
    moduleDetails.programName &&
    (typeof moduleDetails.programName === "object"
      ? moduleDetails.programName._id
      : moduleDetails.programName);

  const fields = {
    name,
    email,
    password,
    role,
    institution,
    assignedModule,
    assignedProgram,
  };

  const submitHandler = (event) => {
    event.preventDefault();
    console.log("Submitting faculty registration with fields:", fields);
    console.log("Module Details:", moduleDetails);

    if (!institution) {
      setMessage("Error: Institution ID is missing. Please try again.");
      setShowPopup(true);
      return;
    }
    if (!assignedModule) {
      setMessage("Error: Module ID is missing. Please try again.");
      setShowPopup(true);
      return;
    }
    if (!assignedProgram) {
      setMessage("Error: Program ID is missing. Please try again.");
      setShowPopup(true);
      return;
    }

    setLoader(true);
    dispatch(registerUser(fields, role));
  };

  return (
    <div>
      <div className="register">
        <form className="registerForm" onSubmit={submitHandler}>
          <span className="registerTitle">Add Faculty</span>
          <br />
          <label>
            Module:{" "}
            {moduleDetails &&
              (moduleDetails.moduleName ||
                moduleDetails.subName ||
                "Loading...")}
          </label>
          <label>
            Program:{" "}
            {moduleDetails &&
              moduleDetails.programName &&
              (moduleDetails.programName.programName ||
                moduleDetails.programName.sclassName ||
                "Loading...")}
          </label>
          <label>Name</label>
          <input
            className="registerInput"
            type="text"
            placeholder="Enter faculty member's name..."
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            required
          />

          <label>Email</label>
          <input
            className="registerInput"
            type="email"
            placeholder="Enter faculty member's email..."
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />

          <label>Password</label>
          <input
            className="registerInput"
            type="password"
            placeholder="Enter faculty member's password..."
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            required
          />

          <button className="registerButton" type="submit" disabled={loader}>
            {loader ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Register"
            )}
          </button>
        </form>
      </div>
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </div>
  );
};

export default AddFaculty;
