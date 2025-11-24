import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://mechpro-backend.vercel.app/api",//"https://backend.mechanicpro.in/api",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("user_token")}`
    }
});

export default axiosInstance;
