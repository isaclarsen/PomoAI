import './App.css'
import { useState } from 'react'
import GuestStartView from './components/GuestStartView';
import FocusTimerView from './components/FocusTimerView';
import QuestionResultView from './components/QuestionResultView';
import { startGuestSession, updateGuestSessionStatus, type QuestionDTO } from './api/pomoApi';
import RelaxTimerView from './components/RelaxTimerView';

function App({}) {

  const [currentView, setCurrentView] = useState<"guestStart" | "focusTimer" | "relaxTimer" | "questionResult">("guestStart");
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState<QuestionDTO[]>([]);
  const [sessionId, setSessionId] = useState<number>(0);

  const handleStartSession = async (incomingTopic: string) => {
      setTopic(incomingTopic)

    try {
      const data = await startGuestSession(incomingTopic);
      setSessionId(data.sessionId)
      setCurrentView("focusTimer")
    } catch (error) {
        console.error("Failed to start Pomo Session", error)
    }
  }

  const handleTimerFinished = async (sessionId : number) => {
    try {
      setCurrentView("relaxTimer")
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
      {currentView === "guestStart" && <GuestStartView onStart={handleStartSession}/>}
      {currentView === "focusTimer" && <FocusTimerView onTimerFinished={() => handleTimerFinished(sessionId)}/>}
      {currentView === "relaxTimer" && <RelaxTimerView onTimerFinished={() => handleRelaxTimerFinished()}/>}
      {currentView === "questionResult" && <QuestionResultView questions={questions} onReset={() => setCurrentView("guestStart")}/>}
      </>

  )
}

export default App
