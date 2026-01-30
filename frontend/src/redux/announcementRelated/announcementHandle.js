import axios from "axios";
import {
  getRequest,
  getSuccess,
  getUrgentSuccess,
  getDetailsSuccess,
  getFailed,
  getError,
  postDone,
} from "./announcementSlice";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const getAllAnnouncements = (id) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.get(`${BASE_URL}/Announcements/${id}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error.message));
  }
};

export const getUrgentAnnouncements = (id) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.get(`${BASE_URL}/UrgentAnnouncements/${id}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getUrgentSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error.message));
  }
};

export const getAnnouncementsByAudience =
  (id, audience) => async (dispatch) => {
    dispatch(getRequest());
    try {
      const result = await axios.get(
        `${BASE_URL}/AnnouncementsByAudience/${id}/${audience}`,
      );
      if (result.data.message) {
        dispatch(getFailed(result.data.message));
      } else {
        dispatch(getSuccess(result.data));
      }
    } catch (error) {
      dispatch(getError(error.message));
    }
  };

export const getAnnouncementDetails = (id) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.get(`${BASE_URL}/Announcement/${id}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getDetailsSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error.message));
  }
};

export const createAnnouncement = (announcementData) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.post(
      `${BASE_URL}/AnnouncementCreate`,
      announcementData,
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

export const updateAnnouncement = (id, updateData) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.put(
      `${BASE_URL}/Announcement/${id}`,
      updateData,
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

export const deleteAnnouncement = (id) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.delete(`${BASE_URL}/Announcement/${id}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(postDone());
    }
  } catch (error) {
    dispatch(getError(error.message));
  }
};
