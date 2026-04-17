import '../shared/styles/App.css';
import { useEffect, useState } from 'react';

// Components
import LandingPage from '../features/landing/pages/LandingPage';
import OnboardingModal from '../features/auth/components/OnBoardingModal';
import FocusTimerView from '../features/session/pages/FocusTimerView';
import RelaxTimerView from '../features/session/pages/RelaxTimerView';
import QuestionResultView from '../features/session/pages/QuestionResultView';
import LoginModal from '../features/auth/components/LoginModal';
import Dashboard from '../features/dashboard/pages/Dashboard';
import LoadingView from '../shared/pages/LoadingView';
import DemoTextView  from '../features/demo/pages/TopicTextView';

// API & Hooks
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useSession } from '../features/session/context/SessionContext';
import { useDemo } from '../features/demo/context/DemoContext';
import { useAuth } from '../features/auth/context/AuthContext';
import { ProfilePage } from '../features/profile/pages/ProfilePage';

function App() {
  //Get data from useAuth hook
  const { user, isAuthLoading, refreshUser, logout} = useAuth();
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
            onLoginClick={() => setIsLoginModalOpen(true)}
            onLogout={logout}
            user={user}
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
              onLogout={logout}
            />
          ) : (
            <Navigate to={"/"} replace />
          )
        } />

        {/* PROFILE */}
        <Route path='/profile' element={
          user && user.displayName ? (
            <ProfilePage
              user={user}
              onLogout={logout}
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
