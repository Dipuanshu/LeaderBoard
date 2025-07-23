/** @format */

// src/api/api.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api", // backend server URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
