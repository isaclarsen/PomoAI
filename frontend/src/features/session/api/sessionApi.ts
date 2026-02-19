import { toApiError } from "../../../shared/api/errors";
import type { GetUserSessionsResponse, QuestionDTO, StartSessionRequest, StartSessionResponse } from "../../../shared/api/types";

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
            await toApiError(response, `Failed to start Pomo Session: ${response.status}`)
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
        await toApiError(response, `Failed to update status on Pomo Session: ${response.status}`);
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
        await toApiError(response, `Failed to update data on Pomo Session: ${response.status}`);
    };
}

export const getUserSessionHistoryApi = async(token: string) : Promise<GetUserSessionsResponse[]> => {
    const url = BASE_URL + "session/history";

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });

    if(!response.ok){
        await toApiError(response, `Failed to fetch user pomo history: ${response.status}`)
    }

    const result = response.json();

    return result;
}
