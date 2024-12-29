import axios from "axios";
import { deleteToken, getToken } from "../storage/localStorage";

const baseUrlLocal = process.env.EXPO_PUBLIC_API_URL_LOCAL;
const baseUrlProduction = process.env.EXPO_PUBLIC_API_URL_PRODUCTION;
const production = process.env.EXPO_PUBLIC_APP;

const api = axios.create({
    baseURL: `${
        production === "PRODUCTION" ? baseUrlProduction : baseUrlLocal
    }`,
});

console.log(production === "PRODUCTION" ? baseUrlProduction : baseUrlLocal);

api.interceptors.request.use(async (config) => {
    const token = await getToken("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export { api };
