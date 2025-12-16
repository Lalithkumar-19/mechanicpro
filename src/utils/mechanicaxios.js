import axios from "axios";

const mechanicaxiosInstance = axios.create({
    baseURL: "https://mechpro-backend-production.up.railway.app/api/mechanic",//"https://mechpro-backend.vercel.app/api/mechanic",//"https://backend.mechanicpro.in/api/mechanic",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("mechanic_token")}`
    }
});

export default mechanicaxiosInstance;
