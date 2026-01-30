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
import DemoTextView  from './views/TopicTextView';

// API & Hooks
import { useAuthSync } from './hooks/useAuthSync'; 
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useSession } from './context/SessionContext';
import { useDemo } from './context/DemoContext';

function App() {
  //Get data from useAuthSync hook
  const { backendUser, isAuthLoading, logout, refreshUser} = useAuthSync();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const navigate = useNavigate();
  const sessionContext = useSession();
  const demoContext = useDemo();

  useEffect(() => {
    if(isAuthLoading === true) return;

    if(backendUser){
      //User is missing educationLevel, send to onboarding
      if(backendUser.educationLevel === null){
        if(location.pathname !== '/onboarding'){
          navigate('/onboarding')
        }
      }else{
        if(location.pathname === '/' || location.pathname === '/onboarding'){
          navigate('/dashboard');
      }
    }
  }

  }, [backendUser, isAuthLoading, navigate, location.pathname])

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
            onStart={demoContext.startDemoSession}
            resetOnStart={demoContext.resetDemoSession}
            onLoginClick={() => setIsLoginModalOpen(true)}
          />
        } />

        {/* DEMO */}
        <Route path='/demo/text' element={
          <DemoTextView 
          topic={demoContext.topic}
          topicText={demoContext.topicText}
          onFinished={demoContext.finishDemoSession}
          />
        } />

        <Route path='/demo/questions' element={
          <QuestionResultView
            questions={demoContext.questions}
            onReset={demoContext.resetDemoSession}
          />
        } />

        {/* DASHBOARD */}
        <Route path='/dashboard' element={
          backendUser && backendUser.displayName ? (
            <Dashboard
              user={backendUser}
              onStart={sessionContext.startSession}
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
              onStart={demoContext.startDemoSession}
              resetOnStart={demoContext.resetDemoSession}
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
            onTimerFinished={sessionContext.finishSession}
            currentTopic={sessionContext.topic}
          />
        } />

        {/* RELAX TIMER */}
        <Route path='/relax' element={
          <RelaxTimerView
            onTimerFinished={sessionContext.finishRelax}
          />
        } />

        {/* QUESTIONS PAGE */}
        <Route path='/questions' element={
          <QuestionResultView
            questions={sessionContext.questions}
            onReset={sessionContext.resetSession}
          />
        } />
        {/* FALLBACK */}
        <Route path='*' element={<Navigate to={"/"} replace />} />
      </Routes>
    </>
  );
}

export default App;