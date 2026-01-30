import axios from "axios";
import {
  getRequest,
  getSuccess,
  getFailed,
  getError,
  getLearnersSuccess,
  getModulesSuccess,
  detailsSuccess,
  getStatsSuccess,
  getFailedTwo,
  getModuleDetailsSuccess,
  getModuleDetailsRequest,
} from "./programSlice";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const getAllPrograms = (id, address) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.get(`${BASE_URL}/${address}/${id}`);
    if (result.data.message) {
      dispatch(getFailedTwo(result.data.message));
    } else {
      dispatch(getSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error.message));
  }
};

export const getProgramDetails = (id) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.get(`${BASE_URL}/Program/${id}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(detailsSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error.message));
  }
};

export const getProgramStats = (id) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.get(`${BASE_URL}/ProgramStats/${id}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getStatsSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error.message));
  }
};

export const getProgramLearners = (id) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.get(`${BASE_URL}/Program/Learners/${id}`);
    if (result.data.message) {
      dispatch(getFailedTwo(result.data.message));
    } else {
      dispatch(getLearnersSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error.message));
  }
};

export const getModulesList = (id, address) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.get(`${BASE_URL}/${address}/${id}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getModulesSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error.message));
  }
};

export const getFreeModuleList = (id) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.get(`${BASE_URL}/FreeModules/${id}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getModulesSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error.message));
  }
};

export const getModuleDetails = (id, address) => async (dispatch) => {
  dispatch(getModuleDetailsRequest());
  try {
    const result = await axios.get(`${BASE_URL}/${address}/${id}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getModuleDetailsSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error.message));
  }
};

export const deleteProgram = (id) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.delete(`${BASE_URL}/Program/${id}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    }
  } catch (error) {
    dispatch(getError(error.message));
  }
};

export const deleteModule = (id) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.delete(`${BASE_URL}/Module/${id}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    }
  } catch (error) {
    dispatch(getError(error.message));
  }
};
