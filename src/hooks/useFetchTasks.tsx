import React, { useState, useEffect } from 'react';
import { TodoItem, TodoState } from '../utils/utils';
import axios from "axios";
import authServices from '../services/auth.services';

const useFetchTasks = () => {
    const [tasks, setTasks] = useState<TodoState["type"]>([]);

    const addTask = (task: TodoItem["value"]) => {
        setTasks(prev => [...prev, task]);
    }

    useEffect(() => {
        const getTasks = async () => {
            const response = await axios.get(`${authServices.API_URL}task/all`);
            const allTasks: TodoState["type"] = response.data;
            setTasks(allTasks);
        }
        getTasks();
    }, []);

    return [tasks, addTask] as const;
};

export default useFetchTasks;