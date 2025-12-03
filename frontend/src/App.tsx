import './App.css';
import { useEffect, useState } from 'react';

// Components
import HomePage from './components/HomePage';
import LoginView from './components/LoginView';
import OnboardingView from './components/OnBoardingView';
import FocusTimerView from './components/FocusTimerView';
import RelaxTimerView from './components/RelaxTimerView';
import QuestionResultView from './components/QuestionResultView';

// API & Hooks
import { startGuestSession, updateSessionStatus, startUserSession, syncUser, type QuestionDTO } from './api/pomoApi';
import { useAuthSync } from './hooks/useAuthSync'; 
import { auth } from './firebaseConfig';

type AppView = 'HOME' | 'LOGIN' | 'ONBOARDING' | 'FOCUS_TIMER' | 'RELAX_TIMER' | 'RESULTS';

function App() {
  //Get data from useAuthSync hook
  const { backendUser, isAuthLoading, logout, refreshUser} = useAuthSync();

  const [currentView, setCurrentView] = useState<AppView>('HOME');
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

  const handleOnboardingSubmit = async (displayName: string, educationLevel: string) => {
    if (!auth.currentUser) return;
    try {
        const token = await auth.currentUser.getIdToken();
        const email = auth.currentUser.email || "";
        const updatedUser = await syncUser(token, email, displayName, educationLevel);
        //Update the user with the new data
        refreshUser(updatedUser); 
        
    } catch (error) { console.error("Onboarding failed", error); }
  };

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
    return <div><h2>Laddar Pomo.AI...</h2></div>;
  }

  return (
    <>
      {currentView === 'HOME' && (
        <HomePage
          onStart={handleStartSession}
          onLoginClick={() => setCurrentView('LOGIN')}
          onLogOutClick={() => logout()} 
          user={backendUser as any} 
        />
      )}

      {currentView === 'LOGIN' && (
        <LoginView onCancel={() => setCurrentView('HOME')} />
      )}

      {currentView === 'ONBOARDING' && (
        <OnboardingView 
            onSubmit={handleOnboardingSubmit} 
            isSubmitting={isAuthLoading} 
        />
      )}

      {/* Timer och Resultat vyer... */}
      {currentView === 'FOCUS_TIMER' && <FocusTimerView onTimerFinished={handleTimerFinished} />}
      {currentView === 'RELAX_TIMER' && <RelaxTimerView onTimerFinished={() => setCurrentView('RESULTS')} />}
      {currentView === 'RESULTS' && <QuestionResultView questions={questions} onReset={() => setCurrentView('HOME')} />}
    </>
  );
}

export default App;