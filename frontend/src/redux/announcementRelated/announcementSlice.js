import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  announcementsList: [],
  urgentAnnouncements: [],
  announcementDetails: null,
  loading: false,
  error: null,
  response: null,
};

const announcementSlice = createSlice({
  name: "announcement",
  initialState,
  reducers: {
    getRequest: (state) => {
      state.loading = true;
    },
    getSuccess: (state, action) => {
      state.announcementsList = action.payload;
      state.loading = false;
      state.error = null;
      state.response = null;
    },
    getUrgentSuccess: (state, action) => {
      state.urgentAnnouncements = action.payload;
      state.loading = false;
      state.error = null;
    },
    getDetailsSuccess: (state, action) => {
      state.announcementDetails = action.payload;
      state.loading = false;
      state.error = null;
    },
    getFailed: (state, action) => {
      state.response = action.payload;
      state.loading = false;
      state.error = null;
    },
    getError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    postDone: (state) => {
      state.loading = false;
      state.error = null;
      state.response = null;
    },
  },
});

export const {
  getRequest,
  getSuccess,
  getUrgentSuccess,
  getDetailsSuccess,
  getFailed,
  getError,
  postDone,
} = announcementSlice.actions;

export const announcementReducer = announcementSlice.reducer;
