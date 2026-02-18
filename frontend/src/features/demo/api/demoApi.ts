import type { StartDemoResponse } from "../../../shared/api/types";

const BASE_URL = import.meta.env.VITE_API_URL_DEV || "http://localhost:8080/api/";

export const startDemoSessionApi = async (
    topic: string,
): Promise<StartDemoResponse> => {
    const url = BASE_URL + "demo/generate"

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({ topic: topic })
    });
    
        if(!response.ok){
            const errorData = await response.json()
            const errorMessage = errorData.detail || errorData.message || "Failed to start demo session";
            throw new Error(errorMessage)
        }

        return response.json();
}
