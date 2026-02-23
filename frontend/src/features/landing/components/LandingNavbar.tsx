import { useEffect, useState } from "react";
import logo from '../../../shared/assets/logo.png';
import { useNavigate } from "react-router-dom";
import type { User } from "../../../shared/api/types";
import { LayoutDashboard, LogOut, UserCog } from "lucide-react";
import { UserMenuButton, type UserMenuItem } from "../../../shared/components/UserMenuButton";


interface LandingNavbarProps{
    onLoginClick: () => void;
    onLogout: () => void;
    user: User | null;
}

export function LandingNavbar({ onLoginClick, user, onLogout } : LandingNavbarProps){
    const [isScrolled, setIsScrolled] = useState(false);

    const navigate = useNavigate();

    // Navigations
    const goToProfile = () => navigate("/profile")
    const goToDashboard = () => navigate("/dashboard")

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const items: UserMenuItem[] = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, onClick: goToDashboard},
        { id: "profile", label: "Profile", icon: UserCog, onClick: goToProfile },
        { id: "logout", label: "Log out", icon: LogOut, onClick: onLogout, danger: true }
    ]


    return (
        <header className={`fixed top-0 w-full h-20 z-50 transition-all duration-500 ${isScrolled ? 'bg-[#050505]/80 backdrop-blur-xl border-b border-white/5' : 'bg-transparent border-transparent'}`}>
            <div className="w-full max-w-[1920px] mx-auto h-full px-4 sm:px-6 lg:px-10 xl:px-14 flex items-center justify-between">
                {/* Logotyp */}
                <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                    <div className="relative flex items-center justify-center w-10 h-10 shrink-0 rounded-lg">
                        <img
                         src={logo}
                         alt="PomoAI logo"
                         className="h-10 w-10 object-contain"
                         onClick={() => {navigate('/')}}
                         />
                    </div>
                    <span className="text-2xl font-bold text-gradient-primary  tracking-tight">PomoAI</span>
                </div>

                    {/* Login Knapp */}
                <div className="flex items-center gap-3">
                    {user ? (
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end">
                            <p className="text-lg font-semibold text-slate-100">
                            {user.displayName}
                            </p>
                            <p className="text-xs font-light text-slate-300">
                            {user.educationLevel}
                            </p>
                        </div>
                        <UserMenuButton items={items} />
                    </div>
                    ) : (
                    <button 
                        onClick={onLoginClick} 
                        className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-200 transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]">
                        Log in
                    </button>
                    )}
                </div>
            </div>
        </header>
    );
}
