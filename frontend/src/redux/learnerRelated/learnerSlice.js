import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  learnersList: [],
  learnerDetails: null,
  learnerTranscript: null,
  learnerPerformance: null,
  loading: false,
  error: null,
  response: null,
  statestatus: "idle",
};

const learnerSlice = createSlice({
  name: "learner",
  initialState,
  reducers: {
    getRequest: (state) => {
      state.loading = true;
    },
    stuffDone: (state) => {
      state.loading = false;
      state.error = null;
      state.response = null;
      state.statestatus = "added";
    },
    getSuccess: (state, action) => {
      state.learnersList = action.payload;
      state.loading = false;
      state.error = null;
      state.response = null;
    },
    getDetailsSuccess: (state, action) => {
      state.learnerDetails = action.payload;
      state.loading = false;
      state.error = null;
      state.response = null;
    },
    getTranscriptSuccess: (state, action) => {
      state.learnerTranscript = action.payload;
      state.loading = false;
      state.error = null;
    },
    getPerformanceSuccess: (state, action) => {
      state.learnerPerformance = action.payload;
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
    underLearnerControl: (state) => {
      state.loading = false;
      state.response = null;
      state.error = null;
      state.statestatus = "idle";
    },
    resetLearnerDetails: (state) => {
      state.learnerDetails = null;
      state.learnerTranscript = null;
      state.learnerPerformance = null;
    },
  },
});

export const {
  getRequest,
  getSuccess,
  getDetailsSuccess,
  getTranscriptSuccess,
  getPerformanceSuccess,
  getFailed,
  getError,
  underLearnerControl,
  stuffDone,
  resetLearnerDetails,
} = learnerSlice.actions;

export const learnerReducer = learnerSlice.reducer;
