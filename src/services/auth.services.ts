import axios, { AxiosError } from "axios";

const API_URL = process.env.NODE_ENV === "development" ? "http://localhost:8080/" : 'https://posi-todo-backend.herokuapp.com/';

const getCurrentUser = () => {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr);
    return null;
}

// from here down is not currently used by the app. Server functionality yet to be implemented

const login = async (username: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}login`, {
            username,
            password
        });
        if (response.data.accessToken) {
            localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data
    } catch (error: any | AxiosError) {
        if (axios.isAxiosError(error)) {
            console.log(error.message, error.status);
        }
        else {
            console.log(error);
        }
    }
}

const logout = () => {
    localStorage.removeItem("user");
}

const register = async (username: string, email: string, password: string) => {
    try {
        await axios.post(`${API_URL}signup`, {
            username,
            email,
            password
        });
    } catch (error: any | AxiosError) {
        if (axios.isAxiosError(error)) {
            console.log(error.message, error.status);
        }
        else {
            console.log(error);
        }
    }
}



export default {
    API_URL,
    login,
    logout,
    register,
    getCurrentUser,
};  