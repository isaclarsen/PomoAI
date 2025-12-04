import { LandingNavbar } from '../components/LandingNavbar';
import { HeroHeader } from '../components/HeroHeader';
import { HeroSessionInput } from '../components/HeroSessionInput';
import { AppBackground } from '../components/AppBackground';

interface LandingPageProps {
    onStart: (topic: string) => void;
    onLoginClick: () => void;
}

function LandingPage({ onStart, onLoginClick } : LandingPageProps) {
    return (
        <div className="min-h-screen bg-[#020202] text-white font-sans selection:bg-rose-500/30 selection:text-rose-200 relative overflow-x-hidden">

            {/* AMBIENT ANIMATED BACKGROUND */}
            <AppBackground/>

            {/* NAVBAR */}
            <LandingNavbar onLoginClick={onLoginClick}/>

            {/* HERO SECTION */}
            <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
                <HeroHeader/>
                <HeroSessionInput onStart={onStart}/>
            </main>

            {/* Footer */}
            <footer className="fixed bottom-6 w-full text-center z-20 pointer-events-none">
                <p className="text-xs text-slate-600">
                    Press <span className="font-mono text-slate-500">Enter</span> to start session
                </p>
            </footer>
        </div>
    );
}

export default LandingPage;