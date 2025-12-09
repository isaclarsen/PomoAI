import { useState } from 'react'
import { useEffect } from 'react'
import { CircularProgress } from '../components/CircularProgress';

interface FocusTimerViewProps {
    onTimerFinished: () => void;
}

function RelaxTimerView({onTimerFinished} : FocusTimerViewProps){

        const [timeLeft, setTimeLeft] = useState(15)

        useEffect(() => {
            if (!timeLeft) return;

            const intervalId = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if(prevTime <= 0){
                        return 0
                    }
                    return prevTime - 1
                })
            }, 1000)

            return () => clearInterval(intervalId)
        }, []);

        useEffect(() => {
            if(timeLeft === 0){
                onTimerFinished();
            }

        }, [timeLeft, onTimerFinished])

        const formatTime = (seconds: number) => {
            const m = Math.floor(seconds / 60);
            const s = seconds % 60;
            return `${m}:${s < 10 ? '0' : ''}${s}`;
        }

    return (
        <div className='min-h-screen bg-[#050508] text-white font-sans selection:bg-rose-500/30 selection:text-rose-200 relative overflow-x-hidden'>
            <div className='flex flex-col h-screen justify-center items-center text-center'>
                <div className="animate-fade-in-up">
                </div>
                <CircularProgress timeLeft={timeLeft} totalTime={15}>
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

export default RelaxTimerView;