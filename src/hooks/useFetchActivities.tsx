import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import authServices from "../services/auth.services";
import { formattedDateString } from "../utils/utils";

export type ActivityType = {
    activity: string,
    read: boolean,
}

type ReturnedActivity = {
    activity: string,
    read: boolean,
    created_at: string,
}

const useFetchActivities = () => {
    const [activities, setActivities] = useState<ActivityType[]>([]);

    useEffect(() => {
        const run = async () => {
            try {
                const response = await axios.get(`${authServices.API_URL}activity/all`);
                const returnedData: ReturnedActivity[] = response.data

                const allActivities: ActivityType[] = returnedData.map(activity => {
                    let date = formattedDateString(activity.created_at);
                    return { activity: date + ": " + activity.activity, read: activity.read };
                })
                setActivities(allActivities);
            } catch (error: any | AxiosError) {
                if (axios.isAxiosError(error)) {
                    console.log(error.message, error.status);
                }
                else {
                    console.log(error);
                }
            }
        }
        run();
    }, [])

    return [activities, setActivities] as const;
}

export default useFetchActivities;