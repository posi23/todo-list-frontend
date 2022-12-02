import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import authServices from "../services/auth.services";
import { TodoItem } from "../utils/utils";

export type UserType = {
    uid: number;
    fullname: string;
}

const useFetchAllUsers = () => {
    const [users, setUsers] = useState<UserType[]>([]);


    useEffect(() => {
        const getTasks = async () => {
            try {
                const response = await axios.get(`${authServices.API_URL}user/all`);
                const allUsers: UserType[] = response.data;
                console.log(allUsers);
                setUsers(allUsers);
            } catch (error: any | AxiosError) {
                if (axios.isAxiosError(error)) {
                    console.log(error.message, error.status);
                }
                else {
                    console.log(error);
                }
            }
        }
        getTasks();
    }, []);

    return [users, setUsers] as const;
}

export default useFetchAllUsers;