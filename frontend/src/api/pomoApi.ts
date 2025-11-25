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

const BASE_URL = "http://localhost:8080/api/pomo/sessions";

export const startGuestSession = async (topic : string): Promise<SessionResponse> => {
    const url = BASE_URL + "/guest/generate"

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
    const url = BASE_URL + "/" + sessionId

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