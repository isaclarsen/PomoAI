import type { User } from '../api/pomoApi';
import { AppBackground } from '../components/AppBackground';
import logo from '../assets/logo.png';
import { User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HeroSessionInput } from '../components/HeroSessionInput';

interface DashboardProps {
    user: User;
    onStart: (topic: string) => void;
}

function Dashboard({ user, onStart }: DashboardProps) {
    const navigate = useNavigate();
    
    return(
        <div className="min-h-screen bg-[#020202] text-white relative overflow-hidden">
            <AppBackground />
            <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
                <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                                <div className="relative flex items-center justify-center w-10 h-10 rounded-lg">
                                    <img
                                    src={logo}
                                    alt="PomoAI logo"
                                    onClick={() => {navigate('/')}}
                                     />
                                </div>
                                <span className="text-2xl font-bold tracking-tight">PomoAI</span>
                            </div>
                            <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-slate-400 border border-white/10 px-2 py-1 rounded-full">
                                Dashboard
                            </span>
                        </div>
                        <p className="text-slate-400 text-sm text-center md:text-base">
                            Hi {user.displayName}, ready to study?
                        </p>
                    </div>
                    <button
                        type="button"
                        aria-label="User profile"
                        className="self-start md:self-auto w-10 h-10 rounded-full border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center"
                    >
                        <UserIcon className="w-5 h-5" />
                    </button>
                </header>

                <main className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                    <section className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-[0_20px_80px_-40px_rgba(0,0,0,0.8)]">
                        <div className="space-y-3">
                            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                                Time to focus?
                            </h2>
                            <p className="text-slate-300">
                                Choose a topic and let AI generate questions for you after your session.
                            </p>
                        </div>

                        <div className="mt-8 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-white">Start Session</h3>
                                <span className="text-xs uppercase tracking-widest text-slate-500">Focus mode</span>
                            </div>
                            <div className="bg-black/30 border border-white/10 rounded-2xl p-6">
                                <HeroSessionInput onStart={onStart} isDashboard={true}/>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Your Sessions</h3>
                            <span className="text-xs uppercase tracking-widest text-slate-500">History</span>
                        </div>
                        <div className="mt-6 rounded-2xl border border-dashed border-white/10 p-8 text-center">
                            <p className="text-slate-400">No sessions saved yet...</p>
                            <p className="text-slate-600 text-sm mt-2">
                                Finish a session to see stats here.
                            </p>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    )
}

export default Dashboard;
