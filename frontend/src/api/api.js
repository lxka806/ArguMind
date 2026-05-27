import axions from "axios"

const API_URL = import.meta.env.VITE_API_URL


const API = axions.create({
    baseURL:`${API_URL}/api/v1`,
    withCredentials: true
})


API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default API