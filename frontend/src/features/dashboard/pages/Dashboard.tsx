
import { AppBackground } from '../../../shared/components/AppBackground';
import { Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { HeroSessionInput } from '../../../shared/components/HeroSessionInput';
import type { PomoSettings, User } from '../../../shared/api/types';
import { useUser } from '../../../domains/user/context/UserContext';
import { useSession } from '../../session/context/SessionContext';
import { DashboardHeader } from '../components/DashboardHeader';
import { PomoSettingsModal } from '../components/PomoSettingsModal';

interface DashboardProps {
    user: User;
    onStart: (topic: string) => void;
    onLogout: () => void;
}

function Dashboard({ user, onStart, onLogout }: DashboardProps) {
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

    //Normalize seconds duration
    const formatDuration = (seconds: number) => {
        const totalSeconds = Math.max(0, Math.floor(seconds));
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const remainingSeconds = totalSeconds % 60;

        const mm = String(minutes).padStart(2, "0");
        const ss = String(remainingSeconds).padStart(2, "0");

        if (hours >= 1) {
            const hh = String(hours).padStart(2, "0");
            return `${hh}:${mm}:${ss}`;
        }

        return `${mm}:${ss}`;
    };

    //Normalize date
    const formatCreatedAt = (value: Date | string) => {
        const date = value instanceof Date ? value : new Date(value);
        if (Number.isNaN(date.getTime())) return "Invalid date";

        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        const hh = String(date.getHours()).padStart(2, "0");
        const min = String(date.getMinutes()).padStart(2, "0");

        return `${yyyy}-${mm}-${dd} - ${hh}:${min}`;
    };
        
    return(
        <div className="min-h-screen bg-[#020202] text-white relative overflow-hidden">
            <AppBackground />
            <div className="relative z-10 w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 py-2">
                <DashboardHeader
                 user={user}
                 onLogout={onLogout}
                 />
                <h4 className="text-6xl font-thin">
                    Hey, time to study?
                </h4>
                <main className="mt-16 grid gap-8">
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
                                {session.sessionError && (
                                    <p className="text-sm text-red-400">{session.sessionError}</p>
                                )}
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
                                <p>{session.historyError}</p>
                            ) : session.history.length === 0 ? (
                                <p>No sessions saved yet... </p>
                            ) : (
                                <div>
                                    {session.history.map((item, index) => (
                                        <div key={`${item.topic}-${index}`} className="mt-6 rounded-2xl border border-dashed border-white/10 p-8 text-center">
                                            <h4 className='text-xl'>{item.topic}</h4>
                                            <p>{formatCreatedAt(item.createdAt)}</p>
                                            <p>Duration: {formatDuration(item.durationSeconds)}</p>
                                            <p>{item.correctCount} out of {item.correctCount + item.wrongCount} correct answers.</p>
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
                <PomoSettingsModal
                    isOpen={isSettingsOpen}
                    onClose={() => setIsSettingsOpen(false)}
                    onSave={saveSettings}
                    onFieldChange={updateDraftValue}
                    settingsDraft={settingsDraft}
                    error={error}
                    message={message}
                />
            )}
        </div>
    )
}

export default Dashboard;
