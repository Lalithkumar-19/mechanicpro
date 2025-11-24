import axios from "axios";

const adminaxiosInstance = axios.create({
    baseURL: "https://mechpro-backend.vercel.app/api",//"https://backend.mechanicpro.in/api",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("admin_token")}`
    }
});

export default adminaxiosInstance;
