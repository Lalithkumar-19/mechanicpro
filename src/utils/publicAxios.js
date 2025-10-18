import axios from "axios";

const publicAxios = axios.create({
    baseURL: "https://backend.mechanicpro.in/api",
    headers: {
        "Content-Type": "application/json"
    }
});

export default publicAxios;