import './App.css'
import { useState } from 'react'
import GuestStartView from './components/GuestStartView';
import FocusTimerView from './components/FocusTimerView';
import QuestionResultView from './components/QuestionResultView';
import { startGuestSession, type QuestionDTO } from './api/pomoApi';

function App({}) {

  const [currentView, setCurrentView] = useState<"guestStart" | "focusTimer" | "questionResult">("guestStart");
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState<QuestionDTO[]>([])

  const handleStartSession = async (incomingTopic: string) => {
      setTopic(incomingTopic)
    try {
      const data = await startGuestSession(incomingTopic);

      setQuestions(data.questions)

      setCurrentView("focusTimer")

    } catch (error) {
        console.error("Failed to start Pomo Session", error)
    }

  }

  return (
      <>
      {currentView === "guestStart" && <GuestStartView onStart={handleStartSession}/>}
      {currentView === "focusTimer" && <FocusTimerView onTimerFinished={() => setCurrentView("questionResult")}/>}
      {currentView === "questionResult" && <QuestionResultView onReset={() => setCurrentView("guestStart")}/>}
      </>

  )
}

export default App
