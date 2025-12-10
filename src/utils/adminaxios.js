import axios from "axios";

const adminaxiosInstance = axios.create({
    baseURL: "http://localhost:3000/api",//"https://mechpro-backend.vercel.app/api",//"https://backend.mechanicpro.in/api",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("admin_token")}`
    }
});

export default adminaxiosInstance;
