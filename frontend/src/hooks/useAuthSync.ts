import { onAuthStateChanged, signOut} from "firebase/auth";
import { useEffect, useState } from "react";
import { syncUser, type User as BackendUser } from "../api/pomoApi";
import { auth } from "../firebaseConfig";

interface useAuthSyncResult{
    backendUser: BackendUser | null
    isAuthLoading: boolean;
    logout: () => Promise<void>;
    refreshUser: (updatedUser : BackendUser) => void;
}

export const useAuthSync = () : useAuthSyncResult => {
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const [backendUser, setBackendUser] = useState<BackendUser | null>(null)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (fireBaseUser) => {
            if(fireBaseUser){
                try{
                    const token = await fireBaseUser.getIdToken();
                    const userFromDB = await syncUser(token, fireBaseUser.email || "", "", "");
                    setBackendUser(userFromDB);
                }catch(error){
                    console.log("Sync with DB failed: " + error)
                    await logout();
                }
            }else{
                setBackendUser(null);
            }
            setIsAuthLoading(false);
        });
        return () => unsubscribe();
    }, [])


    const logout = async () => {
        await signOut(auth);
        setBackendUser(null)
    }

    const refreshUser = (updatedUser : BackendUser) => {
        setBackendUser(updatedUser)
    }

    return {
        backendUser,
        isAuthLoading,
        logout,
        refreshUser
    }

}