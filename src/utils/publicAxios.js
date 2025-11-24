import axios from "axios";

const publicAxios = axios.create({
    baseURL: "https://mechpro-backend.vercel.app/api",//"https://backend.mechanicpro.in/api",
    headers: {
        "Content-Type": "application/json"
    }
});

export default publicAxios;