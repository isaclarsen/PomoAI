import { signInWithPopup } from 'firebase/auth';
import { X } from 'lucide-react'; // Ikon för att stänga
import { useState } from 'react';
import { auth, provider } from '../firebaseConfig';

import logo from '../assets/logo.png';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    if (!isOpen) return null; // Rendera inget om den är stängd

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await signInWithPopup(auth, provider);
            onClose();
        } catch (err: any) {
            console.error("Login failed:", err);
            setError("Login failed. Please try again");
            setIsLoading(false);
        }
    };

    return (
        // * --- 1. OVERLAY --- *
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            
            <div 
                className="absolute inset-0 bg-black/35 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            />

            {/* --- 2. MODAL CARD --- */}
            <div className="relative w-full max-w-md bg-[#111111] border border-white/5 rounded-3xl shadow-2xl transform transition-all animate-fade-in-up overflow-hidden">

                {/* Close button */}
                <button 
                    onClick={onClose}
                    className="absolute right-4 top-4 text-slate-500 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8 pt-10 text-center">
                    {/* Logo */}
                    <div className="w-16 h-16 flex items-center justify-center mx-auto">
                        <img src={logo}/>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2">Start Learning.</h2>
                    <p className="text-slate-400 mb-4 text-sm">
                        Log in to save your progress and track history.
                    </p>

                    {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

                    {/* Login Buttons */}
                    <div className="space-y-3">
                        <button 
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-3 px-4 rounded-xl hover:bg-slate-200 transition-all active:scale-95"
                        >
                            {isLoading ? (
                                <span>Connecting...</span>
                            ) : (
                            <>
                                {/* Google Icon (SVG) */}
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84.81-2.77z" />
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Continue with Google
                            </>
                            )}
                        </button>

                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-[#111111] px-2 text-slate-500">Or</span>
                            </div>
                        </div>
                         
                         {/* Other alternatives*/}
                        <button className="w-full bg-white/5 border border-white/10 text-white font-medium py-3 px-4 rounded-xl hover:bg-white/10 transition-all text-sm">
                            Continue as Guest
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}