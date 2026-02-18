
import { AppBackground } from '../../../shared/components/AppBackground';
import { Settings, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { HeroSessionInput } from '../../../shared/components/HeroSessionInput';
import type { PomoSettings, User } from '../../../shared/api/types';
import { useUser } from '../../../domains/user/context/UserContext';
import { useSession } from '../../session/context/SessionContext';
import { DashboardHeader } from '../components/DashboardHeader';

interface DashboardProps {
    user: User;
    onStart: (topic: string) => void;
}

function Dashboard({ user, onStart }: DashboardProps) {
    const session = useSession();
    const { pomoSettings, savePomoSettings } = useUser();
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [settingsDraft, setSettingsDraft] = useState<PomoSettings>(pomoSettings);

    useEffect(() => {
        session.fetchHistory();
    },[])

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
            <div className="relative z-10 w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 py-2">
                <DashboardHeader user={user}/>
                <h4 className="text-6xl font-thin">
                    Hey, time to study?
                </h4>
                <main className="mt-10 grid gap-8">
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
                        <section className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">Your Sessions</h3>
                                <span className="text-xs uppercase tracking-widest text-slate-500">History</span>
                            </div>
                            <div className="mt-6 rounded-2xl border border-dashed border-white/10 p-8 text-center">
                            {session.isHistoryLoading ? (
                                <p>Loading history...</p>
                            ) : session.historyError ? (
                                <p>${session.historyError}</p>
                            ) : session.history.length === 0 ? (
                                <p>No sessions saved yet... </p>
                            ) : (
                                <div>
                                    {session.history.map((item, index) => (
                                        <div key={`${item.topic}-${index}`} className="mt-6 rounded-2xl border border-dashed border-white/10 p-8 text-center">
                                            <h4 className='text-xl'>{item.topic}</h4>
                                            {/* <p>Created at: ${item.createdAt}</p> */}
                                            <p>Duration in seconds: {item.durationSeconds}</p>
                                            <p>You got {item.correctCount} out of {item.correctCount + item.wrongCount} correct answers.</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                            </div>
                        </section>
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
