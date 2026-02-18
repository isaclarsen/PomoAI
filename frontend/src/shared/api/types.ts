//---------- Auth/User types ----------
export interface User{
    userId: number;
    firebaseId: string;
    email: string;
    displayName?: string;
    educationLevel?: string | null;
    pomoSettings: PomoSettings;
}

export interface PomoSettings{
    focusMinutes: number;
    relaxMinutes: number;
    questionCount: number;
}

//---------- Pomo Session types ----------
export interface StartSessionRequest{
    topic: string;
    pomoSettings?: PomoSettings;
}

export interface StartSessionResponse{
    sessionId: number;
    pomoSettings: PomoSettings;
    status: string;
}

export interface StartDemoResponse{
    topicText: string;
    questions: QuestionDTO[];
}

export interface QuestionDTO{
    id: number;
    text: string;
    options: string[];
    correctAnswer: string;
}

export interface GetUserSessionsResponse{
    topic: string;
    wrongCount: number;
    correctCount: number;
    createdAt: Date;
    durationSeconds: number;
    pomoSettings: PomoSettings;
}