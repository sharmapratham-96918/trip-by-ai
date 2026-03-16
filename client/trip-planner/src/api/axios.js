import axios from "axios";

const API = axios.create({
  baseURL: "https://trip-by-ai.onrender.com"
});

export default API;