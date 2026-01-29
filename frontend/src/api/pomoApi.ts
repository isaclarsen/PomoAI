export interface QuestionDTO{
    id: number,
    text: string
    options: string[]
    correctAnswer: string
}

export interface SessionResponse{
    sessionId: number,
    questions: QuestionDTO[],
    status: string,
    accessToken: string
}

export interface DemoResponse{
    topicText: string,
    questions: QuestionDTO[]
}

export interface User{
    userId: number,
    firebaseId: string,
    email: string,
    displayName?: string
    educationLevel?: string | null
}

const BASE_URL = import.meta.env.VITE_API_URL_DEV || "http://localhost:8080/api";

export const startDemoSessionApi = async (topic : string): Promise<DemoResponse> => {
    const url = BASE_URL + "/demo/generate"

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

        console.log("Successfully started a Pomo Demo Session!")

        return response.json();
}

export const startUserSessionApi = async (token: string, topic : string): Promise<SessionResponse> => {
    const url = BASE_URL + "/session/generate"

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ topic: topic })
    });
    
        if(!response.ok){
            const errorData = await response.json()
            const errorMessage = errorData.detail || errorData.message || "Failed to start session";
            throw new Error(errorMessage)
        }

        console.log("Successfully started a Pomo Session!")

        return response.json();
}

export const updateSessionStatusApi = async (status : string, sessionToken: string, sessionId : number) : Promise<QuestionDTO[]> => {
    const url = BASE_URL + "/session/" + sessionId

    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({ 
            status: status,
            accessToken: sessionToken 
        })
    });

    if(!response.ok){
        throw new Error("Failed to update status on Pomo Session");
    }

    const result = await response.json();

    return result.questions;
}

export const syncUser = async(token : string, email : string, displayName: string, educationLevel: string) : Promise<User> => {
    const url = BASE_URL + "/user/auth"

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            email,
            displayName,
            educationLevel
        })
    });

    if(!response.ok){
        throw new Error("Failed to fetch user")
    }

    const result = await response.json()

    return result;
}