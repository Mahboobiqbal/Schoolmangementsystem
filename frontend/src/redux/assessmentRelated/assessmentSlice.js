import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  assessmentsList: [],
  assessmentDetails: null,
  assessmentStats: null,
  loading: false,
  error: null,
  response: null,
};

const assessmentSlice = createSlice({
  name: "assessment",
  initialState,
  reducers: {
    getRequest: (state) => {
      state.loading = true;
    },
    getSuccess: (state, action) => {
      state.assessmentsList = action.payload;
      state.loading = false;
      state.error = null;
      state.response = null;
    },
    getDetailsSuccess: (state, action) => {
      state.assessmentDetails = action.payload;
      state.loading = false;
      state.error = null;
    },
    getStatsSuccess: (state, action) => {
      state.assessmentStats = action.payload;
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
    resetAssessmentDetails: (state) => {
      state.assessmentDetails = null;
      state.assessmentStats = null;
    },
  },
});

export const {
  getRequest,
  getSuccess,
  getDetailsSuccess,
  getStatsSuccess,
  getFailed,
  getError,
  postDone,
  resetAssessmentDetails,
} = assessmentSlice.actions;

export const assessmentReducer = assessmentSlice.reducer;
