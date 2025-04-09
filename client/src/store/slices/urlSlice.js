import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  urls: [],
  loading: false,
  error: null,
  currentUrl: null,
  analytics: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

const urlSlice = createSlice({
  name: "urls",
  initialState,
  reducers: {
    fetchUrlsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUrlsSuccess: (state, action) => {
      state.loading = false;
      state.urls = action.payload.links;
      state.pagination = {
        page: action.payload.pagination.page,
        limit: action.payload.pagination.limit,
        total: action.payload.pagination.total,
      };
    },
    fetchUrlsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    createUrlStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createUrlSuccess: (state, action) => {
      state.loading = false;
      state.urls = [action.payload.link, ...state.urls];
      state.pagination.total += 1;
    },
    createUrlFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setAnalytics: (state, action) => {
      state.analytics = action.payload;
    },
  },
});

export const {
  fetchUrlsStart,
  fetchUrlsSuccess,
  fetchUrlsFailure,
  createUrlStart,
  createUrlSuccess,
  createUrlFailure,
  setAnalytics,
} = urlSlice.actions;

export default urlSlice.reducer;
