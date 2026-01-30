import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  facultyList: [],
  facultyDetails: null,
  facultyWorkload: null,
  loading: false,
  error: null,
  response: null,
};

const facultySlice = createSlice({
  name: "faculty",
  initialState,
  reducers: {
    getRequest: (state) => {
      state.loading = true;
    },
    doneSuccess: (state, action) => {
      state.facultyDetails = action.payload;
      state.loading = false;
      state.error = null;
      state.response = null;
    },
    getSuccess: (state, action) => {
      state.facultyList = action.payload;
      state.loading = false;
      state.error = null;
      state.response = null;
    },
    getWorkloadSuccess: (state, action) => {
      state.facultyWorkload = action.payload;
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
    resetFacultyDetails: (state) => {
      state.facultyDetails = null;
      state.facultyWorkload = null;
    },
  },
});

export const {
  getRequest,
  getSuccess,
  getFailed,
  getError,
  doneSuccess,
  getWorkloadSuccess,
  postDone,
  resetFacultyDetails,
} = facultySlice.actions;

export const facultyReducer = facultySlice.reducer;
