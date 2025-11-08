import axios from "axios";

const API_URL = "/api/join";

export const getJoinedData = () => axios.get(API_URL);
export const getGenreByGender = () => axios.get(`${API_URL}/genre-by-gender`);
export const getActivityByLocation = () => axios.get(`${API_URL}/activity-by-location`);