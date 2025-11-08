import axios from "axios";

const API_URL = "/api/sessions"; //endpoint di Express. La parte iniziale è stata inserita nel proxy di Vite, ossia il file vite.config.js

export const getSessions = () => axios.get(API_URL);
export const createSession = (data) => axios.post(API_URL, data);
export const updateSession = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteSession = (id) => axios.delete(`${API_URL}/${id}`);
