import type { QuestionDTO, StartSessionRequest, StartSessionResponse } from "./types";

const BASE_URL = import.meta.env.VITE_API_URL_DEV || "http://localhost:8080/api/";

export const startUserSessionApi = async (
    token : string,
    request: StartSessionRequest
): Promise<StartSessionResponse> => {
    const url = BASE_URL + "session/generate"

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(request)
    });
    
        if(!response.ok){
            const errorData = await response.json()
            const errorMessage = errorData.detail || errorData.message || "Failed to start session";
            throw new Error(errorMessage)
        }

        return response.json();
}

export const updateSessionStatusApi = async (
    token : string,
    status : string,
    sessionId : number
) : Promise<QuestionDTO[]> => {
    const url = BASE_URL + "session/" + sessionId

    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
            status: status,
        })
    });

    if(!response.ok){
        throw new Error("Failed to update status on Pomo Session");
    };

    const result = await response.json();

    return result.questions;
}

export const finishSessionApi = async(token : string,
    sessionId : number,
    correctCount : number
) : Promise<void> => {
    const url = BASE_URL + "session/finish/" + sessionId;

    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            correctCount: correctCount,
        })
    });

    if(!response.ok){
        throw new Error("Failed to update data on Pomo Session.")
    };
    
}