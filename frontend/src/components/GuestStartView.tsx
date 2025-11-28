import { useState } from 'react'
import LoginView, { type UserRegistrationData } from './LoginView';

interface GuestStartViewProps {
    onStart: (topic:string) => void;
    onLogin: (UserRegistrationData : UserRegistrationData) => void;
}

function GuestStartView({onStart, onLogin} : GuestStartViewProps) {

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

            <LoginView onLoginSuccess={onLogin}></LoginView>
        </div>
    )
}

export default GuestStartView