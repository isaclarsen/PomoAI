import { useEffect, useState } from "react";
import logo from '../assets/logo.png';

interface LandingNavbarProps{
    onLoginClick: () => void;
}

export function LandingNavbar({ onLoginClick } : LandingNavbarProps){
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 py-3' : 'bg-transparent border-transparent py-6'}`}>
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                {/* Logotyp */}
                <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                    <div className="relative flex items-center justify-center w-10 h-10 rounded-lg">
                        <img src={logo}/>
                    </div>
                    <span className="text-2xl font-bold tracking-tight">PomoAI</span>
                </div>

                    {/* Login Knapp */}
                <div className="flex items-center gap-3">
                    <button 
                        onClick={onLoginClick} 
                        className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-200 transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]">
                        Log in
                    </button>
                </div>
            </div>
        </nav>
    );
}