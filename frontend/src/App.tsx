import './App.css'
import { useState } from 'react'
import GuestStartView from './components/GuestStartView';
import FocusTimerView from './components/FocusTimerView';
import QuestionResultView from './components/QuestionResultView';
import { startGuestSession, updateGuestSessionStatus, type QuestionDTO } from './api/pomoApi';

function App({}) {

  const [currentView, setCurrentView] = useState<"guestStart" | "focusTimer" | "questionResult">("guestStart");
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
      setQuestions(await updateGuestSessionStatus("COMPLETED", sessionId));
      setCurrentView("questionResult")
    } catch (error) {
      console.error("Failed to update status on Pomo Session", error)
    }
  }
  
  return (
      <>
      {currentView === "guestStart" && <GuestStartView onStart={handleStartSession}/>}
      {currentView === "focusTimer" && <FocusTimerView onTimerFinished={() => handleTimerFinished(sessionId)}/>}
      {currentView === "questionResult" && <QuestionResultView questions={questions} onReset={() => setCurrentView("guestStart")}/>}
      </>

  )
}

export default App
