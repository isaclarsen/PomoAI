//---------- Auth/User types ----------
export interface User{
    userId: number;
    firebaseId: string;
    email: string;
    displayName?: string | null;
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

export type TopicCategory =
    | "HISTORY"
    | "SCIENCE"
    | "TECHNOLOGY"
    | "MATHEMATICS"
    | "LANGUAGE"
    | "LITERATURE"
    | "BUSINESS"
    | "ECONOMICS"
    | "POLITICS"
    | "GEOGRAPHY"
    | "ART"
    | "HEALTH"
    | "OTHER";


export interface GetUserSessionsResponse{
    topic: string;
    wrongCount: number;
    topicCategory?: TopicCategory | null;
    correctCount: number;
    createdAt: Date;
    durationSeconds: number;
    pomoSettings: PomoSettings;
}

export type SessionMode = "speed"| "pomo";

//---------- Error types ----------
export interface ProblemDetail {
    detail?: string;
}