import axios from "axios";
import {
  fetchUrlsStart,
  fetchUrlsSuccess,
  fetchUrlsFailure,
  createUrlStart,
  createUrlSuccess,
  createUrlFailure,
} from "../slices/urlSlice";
import { toast } from "react-toastify";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const fetchUrls =
  (page = 1, limit = 10, search = "") =>
  async (dispatch, getState) => {
    try {
      dispatch(fetchUrlsStart());
      const {
        auth: { token },
      } = getState();

      const response = await axios.get(`${API_URL}/links`, {
        params: { page, limit, search },
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(fetchUrlsSuccess(response.data));
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch URLs";
      dispatch(fetchUrlsFailure(errorMessage));
      toast.error(errorMessage);
    }
  };

export const createUrl = (urlData) => async (dispatch, getState) => {
  try {
    dispatch(createUrlStart());
    const {
      auth: { token },
    } = getState();

    const response = await axios.post(`${API_URL}/links`, urlData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    dispatch(createUrlSuccess(response.data));
    toast.success("URL shortened successfully!");
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to create short URL";
    dispatch(createUrlFailure(errorMessage));
    toast.error(errorMessage);
    throw error;
  }
};

export const getUrlAnalytics = async (shortId, token) => {
  try {
    const response = await axios.get(`${API_URL}/links/${shortId}/analytics`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to fetch analytics";
    toast.error(errorMessage);
    throw error;
  }
};
