import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { PomoSettings } from "../../../shared/api/types";
import { updateUserPomoSettingsApi } from "../api/userApi";
import { useAuth } from "../../../features/auth/context/AuthContext";
import { auth } from "../../../shared/config/firebaseConfig";

interface UserContextType{
    //Data
    pomoSettings : PomoSettings;

    //Functions
    updatePomoSettingsLocal: (patch: Partial<PomoSettings>) => void;
    savePomoSettings: (patch: Partial<PomoSettings>) => Promise<void>;
}

const DEFAULT_POMO_SETTINGS: PomoSettings = {focusMinutes: 25, relaxMinutes: 5, questionCount: 3};
const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children } : { children : ReactNode }){
    const [pomoSettings, setPomoSettings] = useState<PomoSettings>(DEFAULT_POMO_SETTINGS);
    const { user, refreshUser } = useAuth();

    useEffect(() => {
        if(user?.pomoSettings) setPomoSettings(user.pomoSettings);
    }, [user]);

    const updatePomoSettingsLocal = (patch: Partial<PomoSettings>) => {
        setPomoSettings((prev) => ({...prev, ...patch}));
    }

    const savePomoSettings = async (patch: Partial<PomoSettings>) => {
        if(!auth.currentUser) {
            throw new Error("You must be logged in to save settings.")
        }
        const token = await auth.currentUser.getIdToken(true);
        const next = {...pomoSettings, ...patch};
        const saved = await updateUserPomoSettingsApi(token, next);

        if (!user) {
            throw new Error("User state is not loaded.");
        }
        
        refreshUser({...user, pomoSettings: saved});
        setPomoSettings(saved);
    }
   
    //All values to be sent out
    const value = {
        pomoSettings,
        updatePomoSettingsLocal,
        savePomoSettings
    };

    return(
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}

//Custom hook to implement context
export function useUser(){
        const context = useContext(UserContext)
        if(context === undefined){
            throw new Error("UserProvider tag is missing")
        }
        return context
    }