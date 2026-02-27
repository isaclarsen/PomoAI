import { ArrowRight, GraduationCap } from "lucide-react";
import { useState } from "react";

import logo from '../../../shared/assets/logo.png';
import { auth } from "../../../shared/config/firebaseConfig";
import { syncUser } from "../api/authApi";
import type { User } from "../../../shared/api/types";
import { ApiError } from "../../../shared/api/errors";

interface OnboardingViewProps {
    isOpen: boolean;
    onComplete: (user: User) => void;
    onClose: () => void;
    
}

export default function OnboardingModal({ onComplete, isOpen, onClose}: OnboardingViewProps) {
    const [displayName, setDisplayName] = useState("");
    const [educationLevel, setEducationLevel] = useState("HIGH_SCHOOL");
    const [isSubmitting, setIsSubmiting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    if(!isOpen) return null;

    const handleSubmit = async () => {
        setSubmitError(null);
        const normalizedDisplayName = displayName.trim();
        if (!auth.currentUser || !normalizedDisplayName) return;

        setIsSubmiting(true);

        try{
            const token = await auth.currentUser.getIdToken();
            if(auth.currentUser.email == null){
                throw new Error("Email cannot be empty or null.")
            }
            const updatedUser = await syncUser(token, auth.currentUser.email, normalizedDisplayName, educationLevel)
            onComplete(updatedUser);
            onClose();
        }catch(error){
            if(error instanceof ApiError) {
                if(error.status === 409){
                    setSubmitError("Display name is already taken");
                } else if(error.status === 400){
                    setSubmitError(error.detail);
                } else {
                    setSubmitError("Onboarding failed. Please try again");
                }
            } else {
                setSubmitError("Unexpected error. Please try again")
            }
            console.error("Onboarding failed", error)
        }finally{
            setIsSubmiting(false);
        }
    };

    return (
        // * --- 1. OVERLAY --- *
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

            <div className="absolute inset-0 bg-black/35 backdrop-blur-sm transition-opacity"/>

            {/* --- 2. MODAL CARD --- */}
            <div className="relative w-full max-w-md bg-[#111111] border border-white/5 rounded-3xl shadow-2xl transform transition-all animate-snap-in overflow-hidden">

                <div className="p-8 pt-10 text-center">
                    {/* Logo */}
                    <div className="w-16 h-16 flex items-center justify-center mx-auto">
                        <img src={logo}/>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2">Welcome to PomoAI!</h2>
                    <p className="text-slate-400 mb-4 text-sm">
                        Let's set up your profile to personalize your experience.
                    </p>

                    {/* Form */}
                    <div className="space-y-3">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
                            What should we call you?
                        </label>
                            <div className="relative">
                                {/* <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" /> */}
                                <input
                                    type="text"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    placeholder="Your name..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 text-white text-left text-balance placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                />
                            </div>
                            
                        <div className="space-y-3">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
                                Current Education Level
                            </label>
                            <div className="relative">
                                <GraduationCap className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                                <select
                                    value={educationLevel}
                                    onChange={(e) => setEducationLevel(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none cursor-pointer"
                                >
                                    <option value="HIGH_SCHOOL" className="text-black">High School</option>
                                    <option value="UNIVERSITY" className="text-black">University / College</option>
                                    <option value="VOCATIONAL" className="text-black">Vocational</option>
                                    <option value="SELF_TAUGHT" className="text-black">Self Taught</option>
                                    <option value="OTHER" className="text-black">Other</option>
                                </select>
                                {/* Custom arrow icon */}
                                <div className="absolute right-4 top-4 pointer-events-none">
                                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div> 

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !displayName.trim()}
                            className="w-full bg-white text-black font-bold py-3.5 rounded-xl hover:bg-slate-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                        >
                            {isSubmitting ? "Setting up..." : "Complete Profile"}
                            {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                        </button>
                        {submitError && (
                            <p className="mt-2 text-sm text-red-400">{submitError}</p>
                        )}                                           
                    </div>
                </div>
            </div>
        </div>
    );
}