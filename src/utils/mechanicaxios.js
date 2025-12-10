import axios from "axios";

const mechanicaxiosInstance = axios.create({
    baseURL: "http://localhost:3000/api/mechanic",//"https://mechpro-backend.vercel.app/api/mechanic",//"https://backend.mechanicpro.in/api/mechanic",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("mechanic_token")}`
    }
});

export default mechanicaxiosInstance;
