import axios from "axios";
import {
  getRequest,
  getSuccess,
  getDetailsSuccess,
  getTranscriptSuccess,
  getPerformanceSuccess,
  getFailed,
  getError,
  stuffDone,
} from "./learnerSlice";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const getAllLearners = (id) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.get(`${BASE_URL}/Learners/${id}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error.message));
  }
};

export const getLearnerDetails = (id) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.get(`${BASE_URL}/Learner/${id}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getDetailsSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error.message));
  }
};

export const getLearnerTranscript = (id) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.get(`${BASE_URL}/Learner/Transcript/${id}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getTranscriptSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error.message));
  }
};

export const getLearnerPerformance = (id) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.get(`${BASE_URL}/Learner/Performance/${id}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getPerformanceSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error.message));
  }
};

export const updateLearnerFields =
  (id, fields, address) => async (dispatch) => {
    dispatch(getRequest());
    try {
      const result = await axios.put(`${BASE_URL}/${address}/${id}`, fields, {
        headers: { "Content-Type": "application/json" },
      });
      if (result.data.message) {
        dispatch(getFailed(result.data.message));
      } else {
        dispatch(stuffDone());
      }
    } catch (error) {
      dispatch(getError(error.message));
    }
  };

export const updateAssessmentResult = (id, fields) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.put(
      `${BASE_URL}/UpdateAssessmentResult/${id}`,
      fields,
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(stuffDone());
    }
  } catch (error) {
    dispatch(getError(error.message));
  }
};

export const updateLearnerParticipation = (id, fields) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.put(
      `${BASE_URL}/LearnerParticipation/${id}`,
      fields,
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(stuffDone());
    }
  } catch (error) {
    dispatch(getError(error.message));
  }
};

export const deleteLearner = (id) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.delete(`${BASE_URL}/Learner/${id}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(stuffDone());
    }
  } catch (error) {
    dispatch(getError(error.message));
  }
};

export const removeParticipation = (id, address) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.put(`${BASE_URL}/${address}/${id}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(stuffDone());
    }
  } catch (error) {
    dispatch(getError(error.message));
  }
};
