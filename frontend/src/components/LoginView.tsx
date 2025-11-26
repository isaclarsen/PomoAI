import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebaseConfig";

interface LoginViewProps {
    onLoginSuccess: (user: any) => void;
}

auth.useDeviceLanguage();

function LoginView({ onLoginSuccess } : LoginViewProps) {

    const handleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider)
            onLoginSuccess(result.user)
        } catch (error) {
            console.log("Login failed", error)
        }
    }

    return(
        <div>   
            <button onClick={handleLogin}>
                Sign in
            </button>
        </div>
    )
}

export default LoginView;