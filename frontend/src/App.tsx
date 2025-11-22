import './App.css'
import { useState } from 'react'
import GuestStartView from './components/GuestStartView';
import FocusTimerView from './components/FocusTimerView';
import QuestionResultView from './components/QuestionResultView';

function App() {

  const [currentView, setCurrentView] = useState<"guestStart" | "focusTimer" | "questionResult">("guestStart");
  const [topic, setTopic] = useState("");

  const handleStartSession = (incomingTopic: string) => {
      setTopic(incomingTopic)
      setCurrentView("focusTimer")
  }

  {console.log(topic)}

  return (
      <>
      {currentView === "guestStart" && <GuestStartView onStart={handleStartSession}/>}
      {currentView === "focusTimer" && <FocusTimerView onTimerFinished={() => setCurrentView("questionResult")}/>}
      {currentView === "questionResult" && <QuestionResultView onReset={() => setCurrentView("guestStart")}/>}
      </>

  )
}

export default App
