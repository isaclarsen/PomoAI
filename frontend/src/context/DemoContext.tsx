import { createContext, useContext, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import type { QuestionDTO } from "../api/types";
import { startDemoSessionApi } from "../api/demoApi";

interface DemoContextType{
    //Data
    questions : QuestionDTO[],
    topic : string
    topicText : string

    // Functions
    startDemoSession: (topic : string) => Promise<void>;
    finishDemoSession: () => Promise<void>;
    resetDemoSession: () => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export function DemoProvider({ children } : { children : ReactNode }){
    const [questions, setQuestions] = useState<QuestionDTO[]>([]);
    const [topic, setTopic] = useState("");
    const [topicText, setTopicText] = useState<string>("");

    const navigate = useNavigate();

    const startDemoSession = async (incomingTopic: string) => {
        setTopic(incomingTopic);
        try {
            if(auth.currentUser){
                navigate('/dashboard')
                return;
            }
            navigate('/demo/text')
            const data = await startDemoSessionApi(incomingTopic);
            setTopicText(data.topicText);
            setQuestions(data.questions);
            //TODO:
            // - Skapa demoTextView som renderar ut topic text
            // - Återanvänd questions view för att svara frågorna baserad på texten.
        } catch (error) { console.error(error); }
    }; 

    const finishDemoSession = async () => {
        navigate('/demo/questions')
    };

    const resetDemoSession = () => {
        setQuestions([]);
        setTopic("")
        setTopicText("");
        navigate('/')
    };

    //All values to be sent out
    const value = {
        topic,
        questions,
        topicText,
        startDemoSession,
        finishDemoSession,
        resetDemoSession
    };

    return(
        <DemoContext.Provider value={value}>
            {children}
        </DemoContext.Provider>
    )
}

//Custom hook to implement context
export function useDemo(){
        const context = useContext(DemoContext)
        if(context === undefined){
            throw new Error("DemoProvider tag is missing")
        }
        return context
    }