import React, { useState, useEffect } from 'react';
import { TodoItem } from '../utils/utils';
import axios, { AxiosError } from "axios";
import authServices from '../services/auth.services';

export type newTodoType = {
    taskName: string,
    description: string,
    dueDate: Date,
    assignees: number[]
}

const useFetchTasks = () => {
    const [tasks, setTasks] = useState<TodoItem[]>([]);

    const addTask = async (task: newTodoType) => {
        try {
            const response = await axios.post(`${authServices.API_URL}task/create`, task);
            const newTask: TodoItem = response.data;
            setTasks(prev => [...prev, newTask]);
        } catch (error: any | AxiosError) {
            if (axios.isAxiosError(error)) {
                console.log(error.message, error.status);
            }
            else {
                console.log(error);
            }
        }

    }

    useEffect(() => {
        const getTasks = async () => {
            try {
                const response = await axios.get(`${authServices.API_URL}task/all`);
                const allTasks: TodoItem[] = response.data;
                setTasks(allTasks);
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

    return [tasks, setTasks, addTask] as const;
};

export default useFetchTasks;