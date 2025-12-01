import './App.css'
import { useState } from 'react'
import GuestStartView from './components/HomePage';
import FocusTimerView from './components/FocusTimerView';
import QuestionResultView from './components/QuestionResultView';
import LoginView, { type UserRegistrationData } from './components/LoginView';
import { startGuestSession, syncUser, updateGuestSessionStatus, type QuestionDTO } from './api/pomoApi';
import RelaxTimerView from './components/RelaxTimerView';
import type { User } from 'firebase/auth';
import HomePage from './components/HomePage';

function App({}) {

  const [user, setUser] = useState<User | null>(null)
  const [currentView, setCurrentView] = useState<"homePage" | "focusTimer" | "relaxTimer" | "questionResult" | "login">("homePage");
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
      setCurrentView("homePage");
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
      {currentView === "homePage" && (
          <HomePage
              onStart={handleStartSession}
              onLoginClick={() => setCurrentView("login")}
              />
            )}

      {currentView === "login" && (
        <LoginView onLoginSuccess={handleLoginSuccess}/>
      )}



      {currentView === "focusTimer" && <FocusTimerView onTimerFinished={() => handleTimerFinished(sessionId)}/>}
      {currentView === "relaxTimer" && <RelaxTimerView onTimerFinished={() => handleRelaxTimerFinished()}/>}
      {currentView === "questionResult" && <QuestionResultView questions={questions} onReset={() => setCurrentView("homePage")}/>}
    </>

  )
}

export default App
