import { createContext, useContext, useState, type ReactNode } from "react";
import { auth } from "../../../shared/config/firebaseConfig";
import { useNavigate } from "react-router-dom";
import type { GetUserSessionsResponse, QuestionDTO } from "../../../shared/api/types";
import { finishSessionApi, startUserSessionApi, updateSessionStatusApi, getUserSessionHistoryApi } from "../api/sessionApi";
import { useUser } from "../../../domains/user/context/UserContext";
import { ApiError } from "../../../shared/api/errors";

interface SessionContextType{
    //Data
    sessionId: number | null;
    questions: QuestionDTO[];
    topic: string;
    sessionError: string;
    history: GetUserSessionsResponse[];
    isHistoryLoading: boolean;
    historyError: string | null;

    //Functions
    startSession: (topic : string) => Promise<void>;
    updateSession: () => Promise<void>;
    finishSession: (correctCount : number) => Promise<void>;
    finishRelax: () => Promise<void>;
    resetSession: (correctCount : number) => Promise<void>;
    fetchHistory: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children } : { children : ReactNode }){
    // Sessions
    const [sessionId, setSessionId] = useState<number | null>(null);
    const [questions, setQuestions] = useState<QuestionDTO[]>([]);
    const [topic, setTopic] = useState("");
    const [sessionError, setSessionError] = useState<string>("");

    // History
    const [history, setHistory] = useState<GetUserSessionsResponse[]>([]);
    const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(false);
    const [historyError, setHistoryError] = useState<string>("");

    const navigate = useNavigate();
    const { pomoSettings } = useUser();

    const startSession = async (incomingTopic: string) => {
        setSessionError("");
        setTopic(incomingTopic);
        try {
            let data;
            if(!auth.currentUser){
                navigate('/')
                return;
            }else{
                const token = await auth.currentUser.getIdToken()
                data = await startUserSessionApi(token, {
                    topic: incomingTopic,
                    pomoSettings: pomoSettings
                });  
                setSessionId(data.sessionId);
            }
            navigate('/focus');
        } catch (error) {
            if(error instanceof ApiError){
                setSessionError(error.detail);
            }else{
                setSessionError("Something went wrong. Please try again.")
            }
        }
    }; 

    const updateSession = async () => {
        setSessionError("");
        if (!sessionId) return;
        try {
            if(!auth.currentUser){
                navigate('/');
                return;
            }else{
                const token = await auth.currentUser.getIdToken();
                const fetchedQuestions = await updateSessionStatusApi(token, "COMPLETED", sessionId);
                setQuestions(fetchedQuestions);
            }
        }  catch (error) {
            if(error instanceof ApiError){
                setSessionError(error.detail);
            }else{
                setSessionError("Something went wrong. Please try again.")
            }
        }
        navigate('/relax')
    };

    const finishSession = async (correctCount : number) => {
        setSessionError("");
        if (!sessionId) return;
        try {
            if(!auth.currentUser){
                navigate('/');
                return;
            }else{
                const token = await auth.currentUser.getIdToken();
                await finishSessionApi(token, sessionId, correctCount);
            }
        } catch (error) {
            if(error instanceof ApiError){
                setSessionError(error.detail);
            }else{
                setSessionError("Something went wrong. Please try again.")
            }
        }
    };

    const finishRelax = async () => {
        setSessionError("");
        navigate('/questions');
    }
    
    const resetSession = async (correctCount : number) => {
        await finishSession(correctCount);
        setSessionError("");
        setQuestions([]);
        setSessionId(null);
        setTopic("");
        navigate('/dashboard')
    };
    
    const fetchHistory = async() => {
        if(!auth.currentUser) return;
        setHistory([]);
        setHistoryError("");

        try{
            setIsHistoryLoading(true);
            const token = await auth.currentUser.getIdToken();
            const fetchedHistory = await getUserSessionHistoryApi(token)
            setHistory(fetchedHistory);
        } catch (error){
            setHistoryError("Failed to fetch session history.")
        }finally{
            setIsHistoryLoading(false);
        }
    }
    
    //All values to be sent out
    const value = {
        sessionId,
        topic,
        questions,
        sessionError,
        history,
        isHistoryLoading,
        historyError,
        startSession,
        updateSession,
        finishSession,
        finishRelax,
        resetSession,
        fetchHistory
    };

    return(
        <SessionContext.Provider value={value}>
            {children}
        </SessionContext.Provider>
    )
}

//Custom hook to implement context
export function useSession(){
        const context = useContext(SessionContext)
        if(context === undefined){
            throw new Error("SessionProvider tag is missing")
        }
        return context
    }