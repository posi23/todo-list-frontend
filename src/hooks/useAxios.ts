import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import authServices from "../services/auth.services";

type ResultType = {
    message: any,
    status: number
}

export const useAxios = (method: string, url: string) => {
    const [result, setResult] = useState<ResultType>();

    useEffect(() => {
        const run = async () => {
            switch (method) {
                case "DELETE":
                    try {
                        const response = await axios.delete(`${authServices.API_URL}${url}`);
                        const status = response.status;
                        const data = response.data
                        setResult({ message: data, status });
                    }
                    catch (error: any | AxiosError) {
                        if (axios.isAxiosError(error)) {
                            console.log(error.message, error.status);
                        }
                        else {
                            console.log(error);
                        }
                    }
                    break;
            }
        }

        run()
    }, [url, method]);

    return result;
}

// export default useAxios;