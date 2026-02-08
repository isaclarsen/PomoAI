
import { AppBackground } from '../components/AppBackground';
import logo from '../assets/logo.png';
import { Settings, User as UserIcon, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSessionInput } from '../components/HeroSessionInput';
import type { PomoSettings, User } from '../api/types';
import { useUser } from '../context/UserContext';

interface DashboardProps {
    user: User;
    onStart: (topic: string) => void;
}

function Dashboard({ user, onStart }: DashboardProps) {
    const navigate = useNavigate();
    const { pomoSettings, savePomoSettings } = useUser();
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [settingsDraft, setSettingsDraft] = useState<PomoSettings>(pomoSettings);

    const openSettingsModal = () => {
        setError("");
        setMessage("");
        setSettingsDraft(pomoSettings);
        setIsSettingsOpen(true);
    };

    const updateDraftValue = (key: keyof PomoSettings, rawValue: string) => {
        const parsedValue = Number(rawValue);
        if (Number.isNaN(parsedValue)) return;
        setSettingsDraft((prev) => ({ ...prev, [key]: parsedValue }));
    };

    const saveSettings = async () => {
        setMessage("");
        setError("");
        try{
            await savePomoSettings(settingsDraft)
            setMessage("Successfully saved Pomo Settings")
        }catch(error){
            setError(error instanceof Error ? error.message : "Failed to save Pomo Settings, try again")
        }
    };
    
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
                                <div className="flex items-center gap-3">
                                    <span className="text-xs uppercase tracking-widest text-slate-500">Focus mode</span>
                                    <button
                                        type="button"
                                        aria-label="Open session settings"
                                        onClick={openSettingsModal}
                                        className="w-8 h-8 rounded-full border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center"
                                    >
                                        <Settings className="w-4 h-4" />
                                    </button>
                                </div>
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

            {isSettingsOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/35 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsSettingsOpen(false)}
                    />
                    <div
                        className="relative w-full max-w-md bg-[#111111] border border-white/5 rounded-3xl shadow-2xl transform transition-all animate-snap-in overflow-hidden"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="pomo-settings-title"
                    >
                        <button
                            onClick={() => setIsSettingsOpen(false)}
                            className="absolute right-4 top-4 text-slate-500 hover:text-white transition-colors"
                            aria-label="Close settings"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="p-8 pt-10">
                            <div className="space-y-2 text-center">
                                <h2 id="pomo-settings-title" className="text-2xl font-bold text-white">
                                    Session Settings
                                </h2>
                                <p className="text-slate-400 text-sm">
                                    Adjust your focus rhythm before starting a session.
                                </p>
                            </div>

                            <div className="mt-4 space-y-4">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
                                    Focus Minutes
                                </label>
                                <input
                                    type="number"
                                    min={3}
                                    value={settingsDraft.focusMinutes}
                                    onChange={(e) => updateDraftValue("focusMinutes", e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-left placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                />

                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
                                    Relax Minutes
                                </label>
                                <input
                                    type="number"
                                    min={1}
                                    value={settingsDraft.relaxMinutes}
                                    onChange={(e) => updateDraftValue("relaxMinutes", e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-left placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                />

                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
                                    Question Count
                                </label>
                                <input
                                    type="number"
                                    min={1}
                                    value={settingsDraft.questionCount}
                                    onChange={(e) => updateDraftValue("questionCount", e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-left placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                />
                            </div>
                            {error && (
                                <span className='text-sm text-red-500'>{error}</span>
                            )}
                            {message && (
                                <span className='text-sm text-green-500'>{message}</span>
                            )}

                            <div className="mt-8 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsSettingsOpen(false)}
                                    className="px-4 py-2 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                                >
                                    Close
                                </button>
                                <button
                                    type="button"
                                    onClick={saveSettings}
                                    className="px-4 py-2 rounded-xl bg-white text-black font-semibold hover:bg-slate-200 transition-all"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Dashboard;
