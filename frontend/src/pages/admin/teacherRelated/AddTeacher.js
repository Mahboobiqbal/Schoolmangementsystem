import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getClassDetails } from "../../../redux/sclassRelated/sclassHandle";
import Popup from "../../../components/Popup";
import { registerUser } from "../../../redux/userRelated/userHandle";
import { underControl } from "../../../redux/userRelated/userSlice";
import { CircularProgress } from "@mui/material";

const AddFaculty = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const programID = params.id;

  const { status, response, error, currentUser } = useSelector(
    (state) => state.user,
  );
  const { sclassDetails: programDetails } = useSelector(
    (state) => state.sclass,
  );

  useEffect(() => {
    dispatch(getClassDetails(programID, "Sclass"));
  }, [dispatch, programID]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);

  const role = "Teacher";
  const school = currentUser._id;
  const teachSclass = programDetails && programDetails._id;

  const fields = {
    name,
    email,
    password,
    role,
    school,
    teachSclass,
  };

  const submitHandler = (event) => {
    event.preventDefault();
    console.log("Submitting teacher registration with fields:", fields);
    console.log("Program Details:", programDetails);
    setLoader(true);
    dispatch(registerUser(fields, role));
  };

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

  return (
    <div>
      <div className="register">
        <form className="registerForm" onSubmit={submitHandler}>
          <span className="registerTitle">Add Faculty</span>
          <br />
          <label>Program : {programDetails && programDetails.sclassName}</label>
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
