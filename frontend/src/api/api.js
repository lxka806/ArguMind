import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL


const API = axios.create({
    baseURL: `${API_URL}/api/v1`,
});

// 🔥 attach token to every request
API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");

    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
});

export default API;