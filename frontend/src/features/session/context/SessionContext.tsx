import { createContext, useContext, useState, type ReactNode } from "react";
import { auth } from "../../../shared/config/firebaseConfig";
import { useNavigate } from "react-router-dom";
import type { GetUserSessionsResponse, QuestionDTO } from "../../../shared/api/types";
import { finishSessionApi, startUserSessionApi, updateSessionStatusApi, getUserSessionHistoryApi } from "../api/sessionApi";
import { useUser } from "../../../domains/user/context/UserContext";

interface SessionContextType{
    //Data
    sessionId : number | null;
    questions : QuestionDTO[];
    topic : string;
    history : GetUserSessionsResponse[];
    isHistoryLoading : boolean;
    historyError : string | null;

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
    const [sessionId, setSessionId] = useState<number | null>(null);
    const [questions, setQuestions] = useState<QuestionDTO[]>([]);
    const [topic, setTopic] = useState("");

    // History
    const [history, setHistory] = useState<GetUserSessionsResponse[]>([]);
    const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(false);
    const [historyError, setHistoryError] = useState<string>("");

    const navigate = useNavigate();
    const { pomoSettings } = useUser();

    const startSession = async (incomingTopic: string) => {
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
            console.error(error);
            throw error;
        }
    }; 

    const updateSession = async () => {
        if (!sessionId) return;
        navigate('/relax')
        try {
            if(!auth.currentUser){
                navigate('/');
                return;
            }else{
                const token = await auth.currentUser.getIdToken();
                const fetchedQuestions = await updateSessionStatusApi(token, "COMPLETED", sessionId);
                setQuestions(fetchedQuestions);
            }
        } catch (error) { console.error(error); }
    };

    const finishSession = async (correctCount : number) => {
        if (!sessionId) return;
        try {
            if(!auth.currentUser){
                navigate('/');
                return;
            }else{
                const token = await auth.currentUser.getIdToken();
                await finishSessionApi(token, sessionId, correctCount);
            }
        } catch (error) { console.error(error); }
    };

    const finishRelax = async () => {
        navigate('/questions');
    }
    
    const resetSession = async (correctCount : number) => {
        await finishSession(correctCount);
        setQuestions([]);
        setSessionId(null);
        setTopic("");
        navigate('/')
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
            console.error("Failed to fetch session history.", error);
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