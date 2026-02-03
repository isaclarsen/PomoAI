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
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useSession } from './context/SessionContext';
import { useDemo } from './context/DemoContext';
import { useAuth } from './context/AuthContext';

function App() {
  //Get data from useAuth hook
  const { user, isAuthLoading, refreshUser} = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);

  const navigate = useNavigate();
  const sessionContext = useSession();
  const demoContext = useDemo();

  useEffect(() => {
    if(isAuthLoading === true) return;

    if(user){
      //User is missing educationLevel, send to onboarding
      if(user.educationLevel === null){
        setIsOnboardingModalOpen(true);
      }
  }

  }, [user, isAuthLoading, navigate])

  if (isAuthLoading) {
    return <LoadingView/>
  }

  return (
    <>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      <OnboardingModal 
        isOpen={isOnboardingModalOpen}
        onComplete={refreshUser}
        onClose={() => setIsOnboardingModalOpen(false)}
      />

      <Routes>

        {/* LANDING PAGE */}
        <Route path='/' element={
          <LandingPage
            onStart={demoContext.startDemoSession}
            resetOnStart={demoContext.resetDemoSession}
            onLoginClick={() => setIsLoginModalOpen(true)}
            onDashboardClick={() => navigate('/dashboard')}
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
          user && user.displayName ? (
            <Dashboard
              user={user}
              onStart={sessionContext.startSession}
            />
          ) : (
            <Navigate to={"/"} replace />
          )
        } />

        {/* FOCUS TIMER */}
        <Route path='/focus' element={
          <FocusTimerView
            onTimerFinished={sessionContext.updateSession}
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
