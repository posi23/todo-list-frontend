import axios, { AxiosError } from "axios";

const API_URL = process.env.API_URL || "http://localhost:8080/";

const login = async (username: string, password: string) => {
    const response = await axios.post(`${API_URL}login`, {
        username,
        password
    });
    if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data
}

const logout = () => {
    localStorage.removeItem("user");
}

const register = async (username: string, email: string, password: string) => {
    await axios.post(`${API_URL}signup`, {
        username,
        email,
        password
    });
}

const getCurrentUser = () => {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr);
    return null;
}

export default {
    API_URL,
    login,
    logout,
    register,
    getCurrentUser,
};  