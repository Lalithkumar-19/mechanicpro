import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://mechpro-backend-production-7f3d.up.railway.app/api",
    headers: {
        "Content-Type": "application/json"
    }
});

// Add a request interceptor to dynamically set the token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("user_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
