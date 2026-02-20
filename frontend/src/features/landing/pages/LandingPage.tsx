import { LandingNavbar } from '../components/LandingNavbar';
import { HeroHeader } from '../components/HeroHeader';
import { HeroSessionInput } from '../../../shared/components/HeroSessionInput';
import { AppBackground } from '../../../shared/components/AppBackground';
import type { User } from '../../../shared/api/types';

interface LandingPageProps {
    onStart: (topic: string) => void;
    resetOnStart: () => void;
    onLoginClick: () => void;
    onLogout: () => void;
    user: User | null;
}

function LandingPage({ onStart, resetOnStart, onLoginClick, onLogout, user } : LandingPageProps) {
    return (
        <div className="min-h-screen bg-[#020202] text-white font-sans selection:bg-rose-500/30 selection:text-rose-200 relative overflow-x-hidden">

            {/* AMBIENT ANIMATED BACKGROUND */}
            <AppBackground/>

            {/* NAVBAR */}
            <LandingNavbar
             onLoginClick={onLoginClick}
             onLogout={onLogout}
             user={user}
             />

            {/* HERO SECTION */}
            <main className="relative z-10 min-h-screen">
                <div className="w-full max-w-[1600px] mx-auto min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-10 xl:px-14">
                    <HeroHeader/>
                        <HeroSessionInput 
                        onStart={onStart}
                        resetOnStart={resetOnStart}
                        isDashboard={false}
                        />
                </div>
            </main>

            {/* Footer */}
            <footer className="fixed bottom-6 w-full text-center z-20 pointer-events-none">
                <p className="text-xs text-slate-600">
                    Press <span className="font-mono text-slate-500">Enter</span> to start a Demo Session
                </p>
            </footer>
        </div>
    );
}

export default LandingPage;
