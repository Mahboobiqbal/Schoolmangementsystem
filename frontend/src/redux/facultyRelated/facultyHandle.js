import axios from "axios";
import {
  getRequest,
  getSuccess,
  getFailed,
  getError,
  doneSuccess,
  getWorkloadSuccess,
  postDone,
} from "./facultySlice";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const getAllFaculty = (id) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.get(`${BASE_URL}/Faculty/${id}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error.message));
  }
};

export const getFacultyDetails = (id) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.get(`${BASE_URL}/FacultyDetail/${id}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(doneSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error.message));
  }
};

export const getFacultyWorkload = (id) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.get(`${BASE_URL}/FacultyWorkload/${id}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getWorkloadSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error.message));
  }
};

export const updateFacultyModule =
  (facultyId, moduleId) => async (dispatch) => {
    dispatch(getRequest());
    try {
      const result = await axios.put(
        `${BASE_URL}/FacultyModule`,
        {
          facultyId,
          assignedModule: moduleId,
        },
        {
          headers: { "Content-Type": "application/json" },
        },
      );
      if (result.data.message) {
        dispatch(getFailed(result.data.message));
      } else {
        dispatch(postDone());
      }
    } catch (error) {
      dispatch(getError(error.message));
    }
  };

export const allocateCourse = (allocationData) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.post(
      `${BASE_URL}/AllocateCourse`,
      allocationData,
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(postDone());
    }
  } catch (error) {
    dispatch(getError(error.message));
  }
};

export const removeCourseAllocation = (allocationData) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.put(
      `${BASE_URL}/RemoveCourseAllocation`,
      allocationData,
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(postDone());
    }
  } catch (error) {
    dispatch(getError(error.message));
  }
};

export const deleteFaculty = (id) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.delete(`${BASE_URL}/Faculty/${id}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(postDone());
    }
  } catch (error) {
    dispatch(getError(error.message));
  }
};
