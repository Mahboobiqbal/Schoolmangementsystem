import axios from "axios";
import {
  getRequest,
  getSuccess,
  getFailed,
  getError,
  getStudentsSuccess,
  detailsSuccess,
  getFailedTwo,
  getSubjectsSuccess,
  getSubDetailsSuccess,
  getSubDetailsRequest,
} from "./sclassSlice";

export const getAllSclasses = (id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    // Map old names to new endpoints
    let endpoint = address;
    if (address === "SclassList" || address === "Sclass") {
      endpoint = "Programs";
    }
    const result = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/${endpoint}/${id}`,
    );
    if (result.data.message) {
      dispatch(getFailedTwo(result.data.message));
    } else {
      dispatch(getSuccess(result.data));
    }
  } catch (error) {
    dispatch(
      getError(
        error.response?.data?.message || error.message || "Network Error",
      ),
    );
  }
};

export const getClassStudents = (id) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/Program/Learners/${id}`,
    );
    if (result.data.message) {
      dispatch(getFailedTwo(result.data.message));
    } else {
      dispatch(getStudentsSuccess(result.data));
    }
  } catch (error) {
    dispatch(
      getError(
        error.response?.data?.message || error.message || "Network Error",
      ),
    );
  }
};

export const getClassDetails = (id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    // Map old names to new endpoints
    const endpoint = address === "Sclass" ? "Program" : address;
    const result = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/${endpoint}/${id}`,
    );
    if (result.data) {
      dispatch(detailsSuccess(result.data));
    }
  } catch (error) {
    dispatch(
      getError(
        error.response?.data?.message || error.message || "Network Error",
      ),
    );
  }
};

export const getSubjectList = (id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    // Map old names to new endpoints
    const endpoint = address === "ClassSubjects" ? "ProgramModules" : address;
    const result = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/${endpoint}/${id}`,
    );
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getSubjectsSuccess(result.data));
    }
  } catch (error) {
    dispatch(
      getError(
        error.response?.data?.message || error.message || "Network Error",
      ),
    );
  }
};

export const getTeacherFreeClassSubjects = (id) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/FreeModules/${id}`,
    );
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getSubjectsSuccess(result.data));
    }
  } catch (error) {
    dispatch(
      getError(
        error.response?.data?.message || error.message || "Network Error",
      ),
    );
  }
};

export const getSubjectDetails = (id, address) => async (dispatch) => {
  dispatch(getSubDetailsRequest());

  try {
    // Map old names to new endpoints
    const endpoint = address === "Subject" ? "Module" : address;
    const result = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/${endpoint}/${id}`,
    );
    if (result.data) {
      dispatch(getSubDetailsSuccess(result.data));
    }
  } catch (error) {
    dispatch(
      getError(
        error.response?.data?.message || error.message || "Network Error",
      ),
    );
  }
};
