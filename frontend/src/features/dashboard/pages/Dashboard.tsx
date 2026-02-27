import { AppBackground } from '../../../shared/components/AppBackground';
import { Award, Brain, Clock, Flame, Target } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { HeroSessionInput } from '../../../shared/components/HeroSessionInput';
import type { PomoSettings, SessionMode, User } from '../../../shared/api/types';
import { useUser } from '../../../domains/user/context/UserContext';
import { useSession } from '../../session/context/SessionContext';
import { DashboardHeader } from '../components/DashboardHeader';
import { PomoSettingsModal } from '../components/PomoSettingsModal';
import { useDemo } from '../../demo/context/DemoContext';

interface DashboardProps {
    user: User;
    onStart: (topic: string) => void;
    onLogout: () => void;
}

type TopicStat = {
    category: string;
    sessions: number;
    focusSeconds: number;
    accuracy: number;
};

const toUtcDayNumber = (value: Date | string) => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return Math.floor(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 86_400_000
  );
};

const formatCategoryLabel = (catagory: string) =>
    catagory
        .toLowerCase()
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");



function Dashboard({ user, onLogout }: DashboardProps) {
    const { pomoSettings, savePomoSettings } = useUser();
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [settingsDraft, setSettingsDraft] = useState<PomoSettings>(pomoSettings);
    const [sessionMode, setSessionMode] = useState<SessionMode>("pomo");
    
    // Context
    const sessionContext = useSession();
    const demoContext = useDemo();

    useEffect(() => {
        sessionContext.fetchHistory();
    }, []);

    const openSettingsModal = () => {
        setError("");
        setMessage("");
        setSettingsDraft(pomoSettings);
        setIsSettingsOpen(true);
    };

    const updateDraftValue = (key: keyof PomoSettings, rawValue: string) => {
        if (rawValue.trim() === "") return;

        const parsedValue = Number.parseInt(rawValue, 10);
        if (!Number.isInteger(parsedValue)) return;
        setSettingsDraft((prev) => ({ ...prev, [key]: parsedValue }));
    };

    const saveSettings = async () => {
        setMessage("");
        setError("");
        try {
            await savePomoSettings(settingsDraft);
            setMessage("Successfully saved Pomo Settings");
        } catch (error) {
            setError(error instanceof Error ? error.message : "Failed to save Pomo Settings, try again");
        }
    };

    // Normalize seconds duration
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

    // Normalize date
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

    const isSessionMode = (value: string): value is SessionMode =>
        value === "speed" || value === "pomo";

    const handleModeChange = (raw: string) => {
        if(!isSessionMode(raw)) return;
        setSessionMode(raw);
        console.log(sessionMode)
    }

    // Calculate dynamic stats from session history
    const stats = useMemo(() => {
        let totalSeconds = 0;
        let correctAnswers = 0;
        let totalQuestions = 0;
        const categoriesMap: Record<string, { sessions: number; focusSeconds: number; correct: number; questions: number }> = {};
        const activeDays = new Set<number>();

        sessionContext.history.forEach(item => {
            totalSeconds += item.durationSeconds || 0;
            correctAnswers += item.correctCount || 0;
            totalQuestions += (item.correctCount || 0) + (item.wrongCount || 0);
            
            const rawCategory = item.topicCategory?.trim();
            const normalizedCategory = rawCategory ? rawCategory.toUpperCase() : "OTHER";
            const categoryStats = categoriesMap[normalizedCategory] || { sessions: 0, focusSeconds: 0, correct: 0, questions: 0 };
            categoryStats.sessions += 1;
            categoryStats.focusSeconds += item.durationSeconds || 0;
            categoryStats.correct += item.correctCount || 0;
            categoryStats.questions += (item.correctCount || 0) + (item.wrongCount || 0);
            categoriesMap[normalizedCategory] = categoryStats

            const dayNumber = toUtcDayNumber(item.createdAt);
            if (dayNumber !== null) {
                activeDays.add(dayNumber);
            }
        });

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const formattedTime = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

        const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

        const topicStats: TopicStat[] = Object.entries(categoriesMap)
            .map(([category, value]) => ({
                category,
                sessions: value.sessions,
                focusSeconds: value.focusSeconds,
                accuracy: value.questions > 0 ? Math.round((value.correct / value.questions) * 100) : 0
            }))
            .sort((a, b) => {
                if (b.sessions !== a.sessions) return b.sessions - a.sessions;
                return b.focusSeconds - a.focusSeconds;
            });

        let currentStreak = 0;
        const now = new Date();
        let checkDayNumber = Math.floor(
            Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / 86_400_000
        );

        if (!activeDays.has(checkDayNumber)) checkDayNumber -= 1;

        while (activeDays.has(checkDayNumber)) {
            currentStreak++
            checkDayNumber -= 1;
        }

        return {
            formattedTime,
            sessionsCompleted: sessionContext.history.length,
            accuracy,
            correctAnswers,
            wrongAnswers: Math.max(totalQuestions - correctAnswers, 0),
            totalQuestions,
            topicStats,
            currentStreak
        };
    }, [sessionContext.history]);
        
    return(
        <div className="min-h-screen bg-[#020202] text-white relative overflow-hidden">
            <AppBackground />
            <div className="relative z-10 w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 py-2 pb-24">
                <DashboardHeader
                 user={user}
                 onLogout={onLogout}
                />
                
                <main className="mt-16 flex flex-col items-center">
                    {/* --- HEADER & INPUT SECTION --- */}
                    <div className="text-center space-y-3 mb-10 w-full">
                        <p className="text-lg md:text-xl text-neutral-400 font-extralight">
                            hey {user.displayName} 👋
                        </p>
                        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-white/90">
                            time to <span className="font-extralight font-serif text-gradient-primary">focus.</span>
                        </h1>
                    </div>
                    
                    <div className="flex justify-center w-full mb-20">
                        <HeroSessionInput
                            onStart={sessionMode === "speed" ? demoContext.startDemoSession : sessionContext.startSession}
                            isDashboard={true}
                            onSettingsClick={openSettingsModal}
                        />
                    </div>

                    {/* --- ASYMMETRIC GRID SECTION --- */}
                    <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-6">
                        
                        {/* Total Focus Time */}
                        <div className="col-span-1 md:col-span-4 lg:col-span-3 bg-white/[0.015] border border-white/[0.04] rounded-[2rem] p-8 flex flex-col hover:bg-white/[0.025] transition-colors relative overflow-hidden">
                            <div className="flex items-center gap-3 text-neutral-500 relative z-10">
                                <Clock className="w-5 h-5" />
                                <span className="text-sm uppercase tracking-widest">Focus Time</span>
                            </div>
                            
                            {/* Centered Stat Block */}
                            <div className="flex-1 flex flex-col justify-center items-center text-center mt-4 relative z-10">
                                <h3 className="text-6xl md:text-7xl font-extralight tracking-tight text-white/90">
                                    {stats.formattedTime}
                                </h3>
                                <p className="text-neutral-500 mt-3 font-light text-sm">Accumulated</p>
                            </div>

                            {/* Decorative Background Watermark */}
                            <Clock className="absolute -bottom-8 -right-8 w-48 h-48 text-white/[0.02] pointer-events-none" />
                        </div>

                        {/* Sessions History */}
                        <div className="col-span-1 md:col-span-8 lg:col-span-6 bg-white/[0.015] border border-white/[0.04] rounded-[2rem] p-6 md:p-8 flex flex-col hover:bg-white/[0.025] transition-colors max-h-[320px]">
                            <div className="flex items-center justify-between mb-4 shrink-0">
                                <div className="flex items-center gap-3 text-neutral-500">
                                    <Target className="w-5 h-5" />
                                    <span className="text-sm uppercase tracking-widest">Recent Sessions</span>
                                </div>
                                <span className="text-xs text-neutral-500 bg-white/5 px-2 py-1 rounded-full">{stats.sessionsCompleted} Total</span>
                            </div>
                            
                            {/* Scrollable List Container */}
                            <div className="overflow-y-auto flex-1 pr-2 space-y-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
                                {sessionContext.isHistoryLoading ? (
                                    <p className="text-neutral-500 text-sm italic">Loading history...</p>
                                ) : sessionContext.historyError ? (
                                    <p className="text-rose-400 text-sm">{sessionContext.historyError}</p>
                                ) : sessionContext.history.length === 0 ? (
                                    <p className="text-neutral-500 text-sm italic">No sessions saved yet...</p>
                                ) : (
                                    sessionContext.history.map((item, index) => (
                                        <div key={`${item.topic}-${index}`} className="flex flex-col gap-2 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.06] transition-colors">
                                            <div className="flex justify-between items-start gap-4">
                                                <h4 className="text-white/90 font-medium truncate">{item.topic}</h4>
                                                <span className="text-xs text-neutral-500 shrink-0 mt-0.5">{formatCreatedAt(item.createdAt)}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs text-neutral-400">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <span className="bg-white/5 px-2 py-1 rounded-md">Time: {formatDuration(item.durationSeconds)}</span>
                                                    <span className="text-[10px] uppercase tracking-wide text-neutral-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                                                        {formatCategoryLabel(item.topicCategory ?? "OTHER")}
                                                    </span>
                                                </div>
                                                <span className={item.correctCount === (item.correctCount + item.wrongCount) ? "text-emerald-400/80" : ""}>
                                                    {item.correctCount}/{item.correctCount + item.wrongCount} correct
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Current Streak */}
                        <div className="col-span-1 md:col-span-6 lg:col-span-3 bg-gradient-to-br from-rose-500/10 to-indigo-500/5 border border-rose-500/20 rounded-[2rem] p-8 flex flex-col hover:border-rose-500/30 transition-colors shadow-[inset_0_0_20px_rgba(244,63,94,0.02)] relative overflow-hidden">
                            <div className="flex items-center gap-3 text-rose-300/80 relative z-10">
                                <Flame className="w-5 h-5" />
                                <span className="text-sm uppercase tracking-widest text-rose-300/80">Streak</span>
                            </div>
                            
                            {/* Centered Stat Block */}
                            <div className="flex-1 flex flex-col justify-center items-center text-center mt-4 relative z-10">
                                <h3 className="text-6xl md:text-7xl font-light text-rose-100">
                                    {stats.currentStreak} <span className="text-3xl text-rose-400/50">Days</span>
                                </h3>
                                <p className="text-rose-400/60 mt-3 font-light text-sm">Keep the momentum</p>
                            </div>

                            {/* Decorative Background Watermark */}
                            <Flame className="absolute -bottom-6 -left-6 w-56 h-56 text-rose-500/[0.03] -rotate-12 pointer-events-none" />
                        </div>

                        {/* Avg Quiz Accuracy */}
                        <div className="col-span-1 md:col-span-6 lg:col-span-4 bg-white/[0.015] border border-white/[0.04] rounded-[2rem] p-8 flex flex-col justify-between hover:bg-white/[0.025] transition-colors">
                            <div className="flex items-center gap-3 text-neutral-500 mb-6">
                                <Award className="w-5 h-5" />
                                <span className="text-sm uppercase tracking-widest">Score Accuracy</span>
                            </div>
                            <div className="flex items-end gap-3">
                                <h3 className="text-6xl font-light text-white/90">{stats.accuracy}%</h3>
                            </div>
                            <div className="w-full bg-white/5 h-1.5 rounded-full mt-4 overflow-hidden">
                                <div 
                                    className="gradient-primary h-full rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${stats.accuracy}%` }}
                                ></div>
                            </div>
                            <div className="mt-6 grid grid-cols-3 gap-2 text-xs">
                                <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2">
                                    <p className="text-neutral-500 uppercase tracking-wide">Correct</p>
                                    <p className="text-emerald-300 mt-1 font-medium">{stats.correctAnswers}</p>
                                </div>
                                <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2">
                                    <p className="text-neutral-500 uppercase tracking-wide">Wrong</p>
                                    <p className="text-rose-300 mt-1 font-medium">{stats.wrongAnswers}</p>
                                </div>
                                <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2">
                                    <p className="text-neutral-500 uppercase tracking-wide">Questions</p>
                                    <p className="text-white/80 mt-1 font-medium">{stats.totalQuestions}</p>
                                </div>
                            </div>
                        </div>

                        {/* Topic Performance */}
                        <div className="col-span-1 md:col-span-12 lg:col-span-8 bg-white/[0.015] border border-white/[0.04] rounded-[2rem] p-8 hover:bg-white/[0.025] transition-colors max-h-[365px] flex flex-col">
                            <div className="flex items-center justify-between gap-3 mb-6 shrink-0">
                                <div className="flex items-center gap-3 text-neutral-500">
                                    <Brain className="w-5 h-5" />
                                    <span className="text-sm uppercase tracking-widest">Category Performance</span>
                                </div>
                                <span className="text-xs text-neutral-500 bg-white/5 px-2 py-1 rounded-full">
                                    {stats.topicStats.length} Categories
                                </span>
                            </div>
                            {stats.topicStats.length > 0 ? (
                                <div className="overflow-y-auto flex-1 pr-2 space-y-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
                                    {stats.topicStats.map((categoryStat) => {
                                        const maxSessions = stats.topicStats[0]?.sessions || 1;
                                        const width = Math.max(10, Math.round((categoryStat.sessions / maxSessions) * 100));

                                        return (
                                            <div key={categoryStat.category} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                                                <div className="flex items-center justify-between gap-3">
                                                    <p className="text-sm font-medium text-white/90 truncate">{formatCategoryLabel(categoryStat.category)}</p>
                                                    <span className="text-xs text-neutral-400 shrink-0">{categoryStat.sessions} sessions</span>
                                                </div>

                                                <div className="w-full bg-white/5 h-1.5 rounded-full mt-3 overflow-hidden">
                                                    <div
                                                        className="gradient-primary h-full rounded-full transition-all duration-500"
                                                        style={{ width: `${width}%` }}
                                                    />
                                                </div>

                                                <div className="mt-3 flex items-center gap-2 text-xs text-neutral-400">
                                                    <span className="bg-white/5 px-2 py-1 rounded-md">
                                                        Focus: {formatDuration(categoryStat.focusSeconds)}
                                                    </span>
                                                    <span className="bg-white/5 px-2 py-1 rounded-md">
                                                        Accuracy: {categoryStat.accuracy}%
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="h-full flex items-center justify-start text-neutral-600 font-light italic">
                                    Complete a session to see category performance here.
                                </div>
                            )}
                        </div>

                    </div>
                </main>
            </div>

            {isSettingsOpen && (
                <PomoSettingsModal
                    isOpen={isSettingsOpen}
                    onClose={() => setIsSettingsOpen(false)}
                    onSave={saveSettings}
                    onFieldChange={updateDraftValue}
                    onModeChange={handleModeChange}
                    mode={sessionMode}
                    settingsDraft={settingsDraft}
                    error={error}
                    message={message}
                />
            )}
        </div>
    )
}
export default Dashboard;
