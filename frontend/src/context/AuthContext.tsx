import { onAuthStateChanged, signOut } from "firebase/auth";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { auth } from "../firebaseConfig";
import type { User } from "../api/types";
import { syncUser } from "../api/authApi";

interface AuthContextType{
    user: User | null
    isAuthLoading: boolean;
    logout: () => Promise<void>;
    refreshUser: (updatedUser : User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children } : { children : ReactNode }){

    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (fireBaseUser) => {
            if(fireBaseUser){
                try{
                    const token = await fireBaseUser.getIdToken();
                    const userFromDB = await syncUser(token, fireBaseUser.email || "", "", "");
                    setUser(userFromDB);
                }catch(error){
                    console.log("Sync with DB failed: " + error)
                    await logout();
                }
            }else{
                setUser(null);
            }
            setIsAuthLoading(false);
        });
        return () => unsubscribe();
    }, [])


    const logout = async () => {
        await signOut(auth);
        setUser(null)
    }

    const refreshUser = (updatedUser : User) => {
        setUser(updatedUser)
    }
   
    //All values to be sent out
    const value = {
        user,
        isAuthLoading,
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