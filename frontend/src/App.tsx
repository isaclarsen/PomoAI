import './App.css';
import { useEffect, useState } from 'react';

// Components
import LandingPage from './views/LandingPage';
import OnboardingModal from './components/OnBoardingModal';
import FocusTimerView from './views/FocusTimerView';
import RelaxTimerView from './views/RelaxTimerView';
import QuestionResultView from './views/QuestionResultView';
import LoginModal from './components/LoginModal';
import Dashboard from './views/Dashboard';

// API & Hooks
import { startGuestSession, updateSessionStatus, startUserSession, type QuestionDTO } from './api/pomoApi';
import { useAuthSync } from './hooks/useAuthSync'; 
import { auth } from './firebaseConfig';

type AppView = 'HOME' | 'LOGIN' | 'ONBOARDING' | 'FOCUS_TIMER' | 'RELAX_TIMER' | 'RESULTS';

function App() {
  //Get data from useAuthSync hook
  const { backendUser, isAuthLoading, logout, refreshUser} = useAuthSync();

  const [currentView, setCurrentView] = useState<AppView>('HOME');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [sessionToken, setSessionToken] = useState<string>("");
  const [questions, setQuestions] = useState<QuestionDTO[]>([]);
  const [_, setTopic] = useState(""); 

  useEffect(() => {
    if(isAuthLoading === true) return;

    if(backendUser){
      //User is missing educationLevel, meaning that user has not completed onboarding process
      if(backendUser.educationLevel === null){
        setCurrentView("ONBOARDING")
      }else{
        if(currentView === "LOGIN" || currentView === "ONBOARDING"){
          setCurrentView("HOME")
        }
      }
    }

  }, [backendUser, isAuthLoading])

  const handleStartSession = async (incomingTopic: string) => {
      setTopic(incomingTopic);
      try {
        if(!auth.currentUser){
          const data = await startGuestSession(incomingTopic);
          setSessionId(data.sessionId);
          setSessionToken(data.accessToken);
        }else{
          const token = await auth.currentUser.getIdToken()
          const data = await startUserSession(token, incomingTopic);  
          setSessionId(data.sessionId);
          setSessionToken(data.accessToken);
        }
        setCurrentView('FOCUS_TIMER')
      } catch (error) { console.error(error); }
  };

  const handleTimerFinished = async () => {
      if (!sessionId) return;
      setCurrentView('RELAX_TIMER');
      try {
        const fetchedQuestions = await updateSessionStatus("COMPLETED", sessionToken, sessionId);
        setQuestions(fetchedQuestions);
      } catch (error) { console.error(error); }
  };

  if (isAuthLoading) {
    return <div></div>;
  }

  return (
    <>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {currentView === 'ONBOARDING' && (
        <>
          <LandingPage 
            onStart={handleStartSession} 
            onLoginClick={() => {}}
          />
          <OnboardingModal 
            onComplete={refreshUser}
          />
      </>
      )}

      {currentView === 'HOME' && (
        backendUser ? (
          <Dashboard
            user={backendUser}
            onStart={handleStartSession}
            onLogoutClick={logout}
          />
        ) : (
          <LandingPage
            onStart={handleStartSession}
            onLoginClick={() => setIsLoginModalOpen(true)}
          />
        )
      )}

      {currentView === 'FOCUS_TIMER' && <FocusTimerView onTimerFinished={handleTimerFinished} />}
      {currentView === 'RELAX_TIMER' && <RelaxTimerView onTimerFinished={() => setCurrentView('RESULTS')} />}
      {currentView === 'RESULTS' && <QuestionResultView questions={questions} onReset={() => setCurrentView('HOME')} />}
    </>
  );
}

export default App;