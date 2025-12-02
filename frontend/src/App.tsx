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
import { startGuestSession, updateGuestSessionStatus, syncUser, type QuestionDTO } from './api/pomoApi';
import { useAuthSync } from './hooks/useAuthSync'; 
import { auth } from './firebaseConfig';

type AppView = 'HOME' | 'LOGIN' | 'ONBOARDING' | 'FOCUS_TIMER' | 'RELAX_TIMER' | 'RESULTS';

function App() {
  
  // --- LUCKA 1 ---
  // Hämta ut backendUser, isAuthLoading, logout och refreshUser från vår nya hook.
  const { backendUser, isAuthLoading, logout, refreshUser} = useAuthSync();


  // --- UI STATE (Detta får du gratis av mig) ---
  const [currentView, setCurrentView] = useState<AppView>('HOME');
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<QuestionDTO[]>([]);
  const [_, setTopic] = useState(""); 


  // --- LUCKA 2 & 3: ROUTING EFFECT ---
  // Det är här "hjärnan" sitter. 
  useEffect(() => {
    
    // Om vi fortfarande laddar (isAuthLoading är true), gör ingenting (return).
    // ??? Skriv koden här ???
    if(isAuthLoading === true) return;


    // Om vi har en backendUser...
    if (backendUser) {
        
        // ...och användaren saknar educationLevel...
        // ...då ska vi tvinga vyn till 'ONBOARDING'.
        // ??? Skriv if-satsen här ???
        if(backendUser.educationLevel === null){
          setCurrentView("ONBOARDING")
        }else{
          // ...ANNARS (om educationLevel finns)...
          // ...och vi just nu står på 'LOGIN' eller 'ONBOARDING'...
          // ...då ska vi skicka användaren till 'HOME'.
           // ??? Skriv else-satsen här ???
          if(currentView === "LOGIN" || currentView === "ONBOARDING"){
            setCurrentView("HOME")
          }
        }
    }

  }, [backendUser, isAuthLoading]); 


  // --- ACTIONS (Dessa är samma som förut, så jag döljer dem för att spara plats) ---
  const handleOnboardingSubmit = async (displayName: string, educationLevel: string) => {
    if (!auth.currentUser) return;
    try {
        const token = await auth.currentUser.getIdToken();
        const email = auth.currentUser.email || "";
        const updatedUser = await syncUser(token, email, displayName, educationLevel);
        
        // VIKTIGT: Berätta för hooken att vi har ny data!
        refreshUser(updatedUser); 
        
    } catch (error) { console.error("Onboarding failed", error); }
  };

  const handleStartSession = async (incomingTopic: string) => { /* ...samma som förut... */ 
      setTopic(incomingTopic);
      try {
        const data = await startGuestSession(incomingTopic);
        setSessionId(data.sessionId);
        setCurrentView('FOCUS_TIMER');
      } catch (error) { console.error(error); }
  };

  const handleTimerFinished = async () => { /* ...samma som förut... */ 
      if (!sessionId) return;
      setCurrentView('RELAX_TIMER');
      try {
        const fetchedQuestions = await updateGuestSessionStatus("COMPLETED", sessionId);
        setQuestions(fetchedQuestions);
      } catch (error) { console.error(error); }
  };

  // --- RENDER ---
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