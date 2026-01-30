import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  programsList: [],
  programLearners: [],
  programDetails: null,
  programStats: null,
  modulesList: [],
  moduleDetails: null,
  loading: false,
  subloading: false,
  error: null,
  response: null,
  getresponse: null,
};

const programSlice = createSlice({
  name: "program",
  initialState,
  reducers: {
    getRequest: (state) => {
      state.loading = true;
    },
    getModuleDetailsRequest: (state) => {
      state.subloading = true;
    },
    getSuccess: (state, action) => {
      state.programsList = action.payload;
      state.loading = false;
      state.error = null;
      state.getresponse = null;
    },
    getLearnersSuccess: (state, action) => {
      state.programLearners = action.payload;
      state.loading = false;
      state.error = null;
      state.getresponse = null;
    },
    getModulesSuccess: (state, action) => {
      state.modulesList = action.payload;
      state.loading = false;
      state.error = null;
      state.response = null;
    },
    getFailed: (state, action) => {
      state.modulesList = [];
      state.response = action.payload;
      state.loading = false;
      state.error = null;
    },
    getFailedTwo: (state, action) => {
      state.programsList = [];
      state.programLearners = [];
      state.getresponse = action.payload;
      state.loading = false;
      state.error = null;
    },
    getError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    detailsSuccess: (state, action) => {
      state.programDetails = action.payload;
      state.loading = false;
      state.error = null;
    },
    getStatsSuccess: (state, action) => {
      state.programStats = action.payload;
      state.loading = false;
      state.error = null;
    },
    getModuleDetailsSuccess: (state, action) => {
      state.moduleDetails = action.payload;
      state.subloading = false;
      state.error = null;
    },
    resetModules: (state) => {
      state.modulesList = [];
      state.programsList = [];
    },
    resetProgramDetails: (state) => {
      state.programDetails = null;
      state.programStats = null;
      state.moduleDetails = null;
    },
  },
});

export const {
  getRequest,
  getSuccess,
  getFailed,
  getError,
  getLearnersSuccess,
  getModulesSuccess,
  detailsSuccess,
  getStatsSuccess,
  getFailedTwo,
  resetModules,
  getModuleDetailsSuccess,
  getModuleDetailsRequest,
  resetProgramDetails,
} = programSlice.actions;

export const programReducer = programSlice.reducer;
