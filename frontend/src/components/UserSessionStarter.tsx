import { useState } from "react";

interface Props {
    onStart: (topic : string) => void;
}

function UserSessionStarter({ onStart } : Props){

    const [topic, setTopic] = useState("")

    return(
        <div>
            <input
            placeholder="What are you studying today?"
            type="text" value={topic}
            onChange={(e) => setTopic(e.target.value)}
            />

            <button onClick={() => onStart(topic)} disabled={!topic.trim()}>
                Start Pomo
            </button>
        </div>
    )
}

export default UserSessionStarter;