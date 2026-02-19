import { onAuthStateChanged, signOut } from "firebase/auth";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { auth } from "../../../shared/config/firebaseConfig";
import type { User } from "../../../shared/api/types";
import { syncUser } from "../api/authApi";
import { ApiError } from "../../../shared/api/errors";

interface AuthContextType{
    user: User | null
    isAuthLoading: boolean;
    authError: string;
    logout: () => Promise<void>;
    refreshUser: (updatedUser : User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children } : { children : ReactNode }){

    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const [authError, setAuthError] = useState<string>("");
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (fireBaseUser) => {
            if(fireBaseUser){
                try{
                    const token = await fireBaseUser.getIdToken();
                    if(fireBaseUser.email == null){
                        throw new Error("Email cannot be empty or null.")
                    }
                    const userFromDB = await syncUser(token, fireBaseUser.email, null, null);
                    setUser(userFromDB);
                }catch(error){
                    if(error instanceof ApiError){
                        if(error.status === 401){
                            await logout();
                        }else{
                            setAuthError("Sync with DB failed: " + error)
                        }
                    }else {
                        setAuthError("Unexpected sync error: " + error)
                        await logout();
                    }
                }
            }else{
                setUser(null);
            }
            setAuthError("");
            setIsAuthLoading(false);
        });
        return () => unsubscribe();
    }, [])


    const logout = async () => {
        await signOut(auth);
        setAuthError("");
        setUser(null);
    }

    const refreshUser = (updatedUser : User) => {
        setUser(updatedUser)
    }
   
    //All values to be sent out
    const value = {
        user,
        isAuthLoading,
        authError,
        logout,
        refreshUser
    };

    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

//Custom hook to implement context
export function useAuth(){
        const context = useContext(AuthContext)
        if(context === undefined){
            throw new Error("AuthProvider tag is missing")
        }
        return context
    }