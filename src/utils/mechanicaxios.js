import axios from "axios";

const mechanicaxiosInstance = axios.create({
    baseURL: "https://mechpro-backend-production-7f3d.up.railway.app/api/mechanic",//"https://mechpro-backend.vercel.app/api/mechanic",//"https://backend.mechanicpro.in/api/mechanic",
    headers: {
        "Content-Type": "application/json"
    }
});

// Add a request interceptor to dynamically set the token
mechanicaxiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("mechanic_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default mechanicaxiosInstance;
