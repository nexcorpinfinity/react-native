import axios from "axios";
import { deleteToken, getToken } from "../storage/localStorage";

const api = axios.create({
    // baseURL: `https://app-passwd.vercel.app/api/v1`,
    baseURL: `http://172.19.177.100:3001/api/v1`,
});

api.interceptors.request.use(async (config) => {
    const token = await getToken("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        // deleta o token para q n tenha token invalido 
        // await deleteToken("token");
    }

    return config;
});

export { api };
