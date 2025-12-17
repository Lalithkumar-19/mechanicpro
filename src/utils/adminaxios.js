import axios from "axios";

const adminaxiosInstance = axios.create({
    baseURL: "https://mechpro-backend-production.up.railway.app/api",//"https://mechpro-backend.vercel.app/api",//"https://backend.mechanicpro.in/api",
    headers: {
        "Content-Type": "application/json"
    }
});

// Add a request interceptor to dynamically set the token
adminaxiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("admin_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default adminaxiosInstance;
