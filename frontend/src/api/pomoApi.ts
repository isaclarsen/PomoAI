export interface QuestionDTO{
    id: number,
    text: string
    options: string[]
    correctAnswer: string
}

export interface SessionResponse{
    sessionId: number,
    questions: QuestionDTO[],
    status: string
}

export interface User{
    userId: number,
    firebaseId: string,
    email: string,
    displayName?: string
    educationLevel?: string | null
}

const BASE_URL = "http://localhost:8080/api";

export const startGuestSession = async (topic : string): Promise<SessionResponse> => {
    const url = BASE_URL + "/guest/sessions/generate"

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({ topicText: topic })
    });
    
        if(!response.ok){
            throw new Error("Failed to start session");
        }

        console.log("Successfully started a Pomo Session!")

        return response.json();
}

export const updateGuestSessionStatus = async (status : string, sessionId : number) : Promise<QuestionDTO[]> => {
    const url = BASE_URL + "/guest/sessions/" + sessionId

    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({ status: status })
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