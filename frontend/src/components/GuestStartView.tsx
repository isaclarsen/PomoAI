import { useState } from 'react'

interface GuestStartViewProps {
    onStart: (topic:string) => void;
}

function GuestStartView({onStart} : GuestStartViewProps) {

    const [topic, setTopic] = useState("");

    const handleStartClick = () => {
        onStart(topic);
    }

    return (
        <div>
            <h2>Vad vill du studera?</h2>

            <input placeholder="Skriv ett ämne..." type="text" value={topic} onChange={(e) => setTopic(e.target.value)}></input>

            <button onClick={handleStartClick}>
                Starta Pomo
            </button>
        </div>
    )
}

export default GuestStartView