/** @format */

// src/api/api.js
import axios from "axios";

const instance = axios.create({
  baseURL: "https://leaderboard-backend-1-qe97.onrender.com/api", // backend server URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
