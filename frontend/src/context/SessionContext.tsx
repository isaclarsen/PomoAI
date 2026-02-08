import { createContext, useContext, useState, type ReactNode } from "react";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import type { QuestionDTO } from "../api/types";
import { finishSessionApi, startUserSessionApi, updateSessionStatusApi } from "../api/sessionApi";
import { useUser } from "./UserContext";

interface SessionContextType{
    //Data
    sessionId : number | null;
    questions : QuestionDTO[];
    topic : string;

    //Functions
    startSession: (topic : string) => Promise<void>;
    updateSession: () => Promise<void>;
    finishSession: (correctCount : number) => Promise<void>;
    finishRelax: () => void;
    resetSession: (correctCount : number) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children } : { children : ReactNode }){
    const [sessionId, setSessionId] = useState<number | null>(null);
    const [questions, setQuestions] = useState<QuestionDTO[]>([]);
    const [topic, setTopic] = useState("");

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
    
    
    //All values to be sent out
    const value = {
        sessionId,
        topic,
        questions,
        startSession,
        updateSession,
        finishSession,
        finishRelax,
        resetSession
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