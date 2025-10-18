import axios from "axios";

const mechanicaxiosInstance = axios.create({
    baseURL: "https://backend.mechanicpro.in/api/mechanic",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("mechanic_token")}`
    }
});

export default mechanicaxiosInstance;
