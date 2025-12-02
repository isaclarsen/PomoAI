import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut} from "firebase/auth";
import { auth } from "../firebaseConfig";
import { syncUser, type User as BackendUser } from "../api/pomoApi";

interface UseAuthSyncResult {
    backendUser: BackendUser | null;
    isAuthLoading: boolean;
    logout: () => Promise<void>;
    refreshUser: (updatedUser : BackendUser) => void;
}

export const useAuthSync = (): UseAuthSyncResult => {
    
    const [backendUser, setBackendUser] = useState<BackendUser | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            
            if (firebaseUser) {
                try {
                    const token = await firebaseUser.getIdToken();
                    //Sending empty string to get the user from DB
                    const userFromDb = await syncUser(token, firebaseUser.email || "", "", "")
                    setBackendUser(userFromDb)
                    
                } catch (error) {
                    console.error("Sync failed", error);
                    await signOut(auth);
                    setBackendUser(null)
                }
                
            } else {
                // No user
                setBackendUser(null);
            }
            setIsAuthLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // 3. ACTIONS
    const logout = async () => {
        await signOut(auth);
        setBackendUser(null);
    };

    const refreshUser = (updatedUser : BackendUser) => {
        setBackendUser(updatedUser)
    }

    // 4. RETURN
    // Här skickar vi tillbaka verktygen som App.tsx behöver
    return {
        backendUser,
        isAuthLoading,
        logout,
        refreshUser
    };
};