import { createContext, useContext, useState, type ReactNode } from "react";
import { 
    type QuestionDTO, 
    startGuestSession, 
    startUserSession, 
    updateSessionStatus 
} from "../api/pomoApi";
import { auth } from "../firebaseConfig";

interface SessionContextType{
    //Data
    sessionId : number | null,
    sessionToken : string,
    questions : QuestionDTO[],
    topic : string

    //Functions
    startSession: (topic : string) => Promise<void>;
    finishSession: () => Promise<void>;
    resetSession: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children } : { children : ReactNode }){
    const [sessionId, setSessionId] = useState<number | null>(null);
    const [sessionToken, setSessionToken] = useState<string>("");
    const [questions, setQuestions] = useState<QuestionDTO[]>([]);
    const [topic, setTopic] = useState("");

    const startSession = async (incomingTopic: string) => {
        setTopic(incomingTopic);
        try {
            let data;
            if(!auth.currentUser){
                data = await startGuestSession(incomingTopic);
            }else{
                const token = await auth.currentUser.getIdToken()
                data = await startUserSession(token, incomingTopic);  
            }
            setSessionId(data.sessionId);
            setSessionToken(data.accessToken);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }; 

    const finishSession = async () => {
        if (!sessionId) return;
        try {
            const fetchedQuestions = await updateSessionStatus("COMPLETED", sessionToken, sessionId);
            setQuestions(fetchedQuestions);
        } catch (error) { console.error(error); }
    };

    const resetSession = () => {
        setQuestions([]);
        setSessionId(null);
        setSessionToken("");
        setTopic("");
    };

    //All values to be sent out
    const value = {
        sessionId,
        sessionToken,
        topic,
        questions,
        startSession,
        finishSession,
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