import { useRef, useState } from 'react'
import { useEffect } from 'react'
import { CircularProgress } from '../../../shared/components/CircularProgress';
import { useUser } from '../../../domains/user/context/UserContext';

interface FocusTimerViewProps {
    onTimerFinished: () => void;
    currentTopic : string
}

function FocusTimerView({onTimerFinished, currentTopic} : FocusTimerViewProps){
    const user = useUser();

        const [totalTime] = useState(() => user.pomoSettings.focusMinutes * 60);
        const [timeLeft, setTimeLeft] = useState(totalTime);
        const hasFinishedRef = useRef(false);

        useEffect(() => {
            if(timeLeft <= 0) return;

            const timeoutId = window.setTimeout(() => {
                setTimeLeft((prev) => Math.max(prev - 1, 0));
            }, 1000)

            return () => window.clearTimeout(timeoutId);

        }, [timeLeft])

        useEffect(() => {
            if (timeLeft !== 0 || hasFinishedRef.current) return;
            hasFinishedRef.current = true;
            void onTimerFinished();
        }, [timeLeft, onTimerFinished])

        const formatTime = (seconds: number) => {
            const m = Math.floor(seconds / 60);
            const s = seconds % 60;
            return `${m}:${s < 10 ? '0' : ''}${s}`;
        }
{/**TODO: topics kan va långa, eventuellt flytta ner badge under timer.*/}
{/**TODO: Kanske lägga in "FOCUS" någonstans så det klargör att man är i fokus läge?*/}
    return (
        <div className='min-h-screen bg-[#050508] text-white font-sans selection:bg-rose-500/30 selection:text-rose-200 relative overflow-x-hidden'>
            <div className='flex flex-col h-screen justify-center items-center text-center'>
                <div className="animate-fade-in-up">
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                    <span className="text-l text-slate-300 font-semibold uppercase tracking-wider">{currentTopic}</span>
                </div>
                <CircularProgress timeLeft={timeLeft} totalTime={totalTime}>
                    <h2 className='text-7xl md:text-8xl lg:text-9xl font-bold bg-gradient-to-r bg-clip-text from-rose-400 to-indigo-400 text-transparent tracking-tight '>{formatTime(timeLeft)}</h2>
                    <p className='text-lg md:text-xl text-slate-400 leading-relaxed font-light'>PomoAI</p>
                </CircularProgress>
            </div>
            {/* <button className='' onClick={onTimerFinished}>
                Skippa timer (dev)
            </button> */}
        </div>
    )
}

export default FocusTimerView
