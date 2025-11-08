import axios from "axios";

const API_URL = "/api/players"; //endpoint di Express. La parte iniziale è stata inserita nel proxy di Vite, ossia il file vite.config.js

export const getPlayers = () => axios.get(API_URL);
export const createPlayer = (data) => axios.post(API_URL, data);
export const updatePlayer = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deletePlayer = (id) => axios.delete(`${API_URL}/${id}`);
