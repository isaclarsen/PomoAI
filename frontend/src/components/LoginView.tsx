import { signInWithPopup, type User } from "firebase/auth";
import { auth, provider } from "../firebaseConfig";
import { useEffect, useState } from "react";
import { syncUser } from "../api/pomoApi";

interface LoginViewProps {
    onLoginSuccess: (data: UserRegistrationData) => void;
}

// interface educationLevel {
//     "highSchool": string,
//     "university": string,
//     "vocational": string,
//     "selfTaught": string,
//     "other": string
// }

export interface UserRegistrationData {
    fireBaseUser: User,
    displayName: string,
    educationLevel: string,

}

auth.useDeviceLanguage();

function LoginView({ onLoginSuccess } : LoginViewProps) {

    const [fireBaseUser, setFireBaseUser] = useState<User | null>();
    const [displayName, setDisplayName] = useState<string>("");
    const [educationLevel, setEducationLevel] = useState<string>("highSchool");
    const [currentView, setCurrentView] = useState<"login" | "displayName" | "educationLevel" | "welcomeView">("login");

    const handleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const token = await result.user.getIdToken();
            const email = result.user.email || "";

            const dbUser = await syncUser(token, email, "", "")

            setFireBaseUser(result.user);

            if(!dbUser.displayName || !dbUser.educationLevel){
                //User data not complete, onboarding process starts
                setCurrentView("displayName");
            }else{
                onLoginSuccess({
                    fireBaseUser: result.user,
                    displayName: dbUser.displayName,
                    educationLevel: dbUser.educationLevel
                })
            }
        } catch (error) {
            console.log("Login failed", error)
        }
    }

    const handleNameSubmit = () => {
        if(!displayName.trim()) return;
        setCurrentView("educationLevel");
    }
    
    const handleFinalSubmit = () => {
        if (fireBaseUser){
            onLoginSuccess({
                fireBaseUser: fireBaseUser,
                displayName: displayName,
                educationLevel: educationLevel
                }
            )
            setCurrentView("welcomeView")
        }
    }

    useEffect(() => {
        handleLogin();
    }, [])

    return(
        <>
            {currentView === "login" && 
                <div>   
                    <p>Opening login...</p>
                    <button onClick={handleLogin}>Open login again</button>
                </div>
            }

            {currentView === "displayName" &&
            <div>
                <h3>What should we call you?</h3>
                <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your name..."
                />
                <button onClick={handleNameSubmit}>Continue</button>
            </div>
            }

            {currentView === "educationLevel" &&
            <div>
                <h3>What's your education level?</h3>
                <select name="educationLevel" value={educationLevel} onChange={(e) => setEducationLevel(e.target.value)}>
                    <option value="highSchool">High School</option>
                    <option value="univeristy">University</option>
                    <option value="vocational">Vocational</option>
                    <option value="selfTaught">Self taught</option>
                    <option value="other">Other</option>
                </select>
                <button onClick={handleFinalSubmit}>Continue</button>
            </div>
            }

            {currentView === "welcomeView" &&
            <div>
                <h3>Welcome {displayName}!</h3>
                <p>What are you studying today?</p>
            </div>
            }
        </>
    )
}

export default LoginView;