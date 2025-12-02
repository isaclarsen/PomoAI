import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebaseConfig";
import { useState } from "react";

interface LoginViewProps {
    onCancel: () => void; // Så man kan gå tillbaka till startsidan
}

function LoginView({ onCancel }: LoginViewProps) {
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        setError(null);
        try {
            // Vi gör INGET annat här.
            // När denna lyckas kommer App.tsx (som lyssnar) att reagera.
            await signInWithPopup(auth, provider);
        } catch (err: any) {
            console.error("Login failed:", err);
            setError("Kunde inte logga in. Försök igen.");
        }
    };

    return (
        <div className="login-container">
            <h2>Log in</h2>
            <p>Save your Pomo-sessions and get a more personal experience.</p>
            
            {error && <p style={{ color: "red" }}>{error}</p>}

            <button onClick={handleLogin}>
                Continue with Google
            </button>
            
            <button onClick={onCancel} style={{marginLeft: "10px"}}>
                Go back
            </button>
        </div>
    );
}

export default LoginView;