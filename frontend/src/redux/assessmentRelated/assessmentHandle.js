import axios from "axios";
import {
  getRequest,
  getSuccess,
  getDetailsSuccess,
  getStatsSuccess,
  getFailed,
  getError,
  postDone,
} from "./assessmentSlice";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const getAllAssessments = (id) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.get(`${BASE_URL}/Assessments/${id}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error.message));
  }
};

export const getAssessmentsByModule = (id) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.get(`${BASE_URL}/AssessmentsByModule/${id}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error.message));
  }
};

export const getAssessmentsByProgram = (id) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.get(`${BASE_URL}/AssessmentsByProgram/${id}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error.message));
  }
};

export const getAssessmentDetails = (id) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.get(`${BASE_URL}/Assessment/${id}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getDetailsSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error.message));
  }
};

export const getAssessmentStats = (id) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.get(`${BASE_URL}/AssessmentStats/${id}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getStatsSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error.message));
  }
};

export const createAssessment = (assessmentData) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.post(
      `${BASE_URL}/AssessmentCreate`,
      assessmentData,
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

export const submitAssessment = (id, submissionData) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.put(
      `${BASE_URL}/SubmitAssessment/${id}`,
      submissionData,
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

export const gradeSubmission = (id, gradeData) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.put(
      `${BASE_URL}/GradeSubmission/${id}`,
      gradeData,
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

export const deleteAssessment = (id) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.delete(`${BASE_URL}/Assessment/${id}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(postDone());
    }
  } catch (error) {
    dispatch(getError(error.message));
  }
};
