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
import LoadingView from './views/LoadingView';

// API & Hooks
import { startGuestSession, updateSessionStatus, startUserSession, type QuestionDTO } from './api/pomoApi';
import { useAuthSync } from './hooks/useAuthSync'; 
import { auth } from './firebaseConfig';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';

function App() {
  //Get data from useAuthSync hook
  const { backendUser, isAuthLoading, logout, refreshUser} = useAuthSync();
  const navigate = useNavigate();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [sessionToken, setSessionToken] = useState<string>("");
  const [questions, setQuestions] = useState<QuestionDTO[]>([]);
  const [topic, setTopic] = useState(""); 

  useEffect(() => {
    if(isAuthLoading === true) return;

    if(backendUser){
      //User is missing educationLevel, send to onboarding
      if(backendUser.educationLevel === null){
        if(location.pathname !== '/onboarding'){
          navigate('/onboarding')
        }
      }else{
        if(location.pathname === '/'){
          navigate('/dashboard')
        }
      }
    }

  }, [backendUser, isAuthLoading, navigate, location.pathname])

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
        navigate('/focus')
      } catch (error) { console.error(error); }
  };

  const handleTimerFinished = async () => {
      if (!sessionId) return;
      navigate('/relax')
      try {
        const fetchedQuestions = await updateSessionStatus("COMPLETED", sessionToken, sessionId);
        setQuestions(fetchedQuestions);
      } catch (error) { console.error(error); }
  };
  
  const handleRelaxFinished = () => {
    navigate('/questions');
  }

  const handleReset = () => {
    setQuestions([]);
    navigate('/')
  }

  if (isAuthLoading) {
    return <LoadingView/>
  }

  return (
    <>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
      <Routes>

        {/* LANDING PAGE */}
        <Route path='/' element={
          <LandingPage
            onStart={handleStartSession}
            onLoginClick={() => setIsLoginModalOpen(true)}
          />
        } />

        {/* DASHBOARD */}
        <Route path='/dashboard' element={
          backendUser && backendUser.displayName ? (
            <Dashboard
              user={backendUser}
              onStart={handleStartSession}
              onLogoutClick={logout}
            />
          ) : (
            <Navigate to={"/"} replace />
          )
        } />

        {/* ONBOARDING */}
        <Route path='/onboarding' element={
          <>
            <LandingPage 
              onStart={handleStartSession} 
              onLoginClick={() => {}}
            />
            <OnboardingModal 
              onComplete={refreshUser}
            />
          </>
        } />

        {/* FOCUS TIMER */}
        <Route path='/focus' element={
          <FocusTimerView
            onTimerFinished={handleTimerFinished}
            currentTopic={topic}
          />
        } />

        {/* RELAX TIMER */}
        <Route path='/relax' element={
          <RelaxTimerView
            onTimerFinished={handleRelaxFinished}
          />
        } />

        {/* QUESTIONS PAGE */}
        <Route path='/questions' element={
          <QuestionResultView
            questions={questions}
            onReset={handleReset}
          />
        } />
        {/* FALLBACK */}
        <Route path='*' element={<Navigate to={"/"} replace />} />
      </Routes>
    </>
  );
}

export default App;