import { useState } from "react";

interface Props {
    onStart: (topic : string) => void;
}

function GuestSessionStarter({ onStart } : Props){

    const [topic, setTopic] = useState("")

    return(
        <div>
            <h2>Try out PomoAI!</h2>

            <input
            placeholder="What are you studying today?"
            type="text" value={topic}
            onChange={(e) => setTopic(e.target.value)}
            />

            <button onClick={() => onStart(topic)} disabled={!topic.trim()}>
                Starta Pomo
            </button>
        </div>
    )
}

export default GuestSessionStarter;