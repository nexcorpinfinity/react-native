import axios from "axios";
import { getToken } from "../storage/localStorage";

const api = axios.create({
  baseURL: `https://app-passwd.vercel.app/api/v1`,
});

api.interceptors.request.use(async (config) => {
  const token = await getToken("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export { api };
