import { useState } from 'react'
import { useEffect } from 'react'

interface FocusTimerViewProps {
    onTimerFinished: () => void;
}

function FocusTimerView({onTimerFinished} : FocusTimerViewProps){

        const [timeLeft, setTimeLeft] = useState(5)

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
        <div>
            <h2>Fokus!</h2>
            <h3>{formatTime(timeLeft)}</h3>
            <button onClick={onTimerFinished}>
                Skippa timer (dev)
            </button>
        </div>
    )
}

export default FocusTimerView