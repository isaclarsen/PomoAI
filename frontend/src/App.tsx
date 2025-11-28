import './App.css'
import { useState } from 'react'
import GuestStartView from './components/GuestStartView';
import FocusTimerView from './components/FocusTimerView';
import QuestionResultView from './components/QuestionResultView';
import LoginView, { type UserRegistrationData } from './components/LoginView';
import { startGuestSession, syncUser, updateGuestSessionStatus, type QuestionDTO } from './api/pomoApi';
import RelaxTimerView from './components/RelaxTimerView';
import type { User } from 'firebase/auth';

function App({}) {

  const [user, setUser] = useState<User | null>(null)
  const [currentView, setCurrentView] = useState<"guestStart" | "focusTimer" | "relaxTimer" | "questionResult" | "login">("guestStart");
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState<QuestionDTO[]>([]);
  const [sessionId, setSessionId] = useState<number>(0);

  const handleLoginSuccess = async (data: UserRegistrationData) => {
    const {fireBaseUser, displayName, educationLevel} = data;
    
    if(!fireBaseUser){
      console.error("No user found in fireBase")
    }

    try{
      const token = await fireBaseUser.getIdToken();
      const email = fireBaseUser.email || "";

      await syncUser(token, email, displayName, educationLevel)
  
      setUser(fireBaseUser);
      setCurrentView("guestStart");
    }catch(error){
      console.error("Something went wrong")
    }

  }

  const handleStartSession = async (incomingTopic: string) => {
      setTopic(incomingTopic)

    try {
      const data = await startGuestSession(incomingTopic);
      setSessionId(data.sessionId);
      setCurrentView("focusTimer");
    } catch (error) {
        console.error("Failed to start Pomo Session", error)
    }
  }

  const handleTimerFinished = async (sessionId : number) => {
    try {
      setCurrentView("relaxTimer")
      setQuestions([]);
      setQuestions(await updateGuestSessionStatus("COMPLETED", sessionId));
    } catch (error) {
      console.error("Failed to update status on Pomo Session", error)
    }
  }

  const handleRelaxTimerFinished = async () => {
    setCurrentView("questionResult")
  }
  
  return (
    <>
      {currentView === "guestStart" && <GuestStartView onStart={handleStartSession} onLogin={handleLoginSuccess}/>}
      {currentView === "focusTimer" && <FocusTimerView onTimerFinished={() => handleTimerFinished(sessionId)}/>}
      {currentView === "relaxTimer" && <RelaxTimerView onTimerFinished={() => handleRelaxTimerFinished()}/>}
      {currentView === "questionResult" && <QuestionResultView questions={questions} onReset={() => setCurrentView("guestStart")}/>}
    </>

  )
}

export default App
