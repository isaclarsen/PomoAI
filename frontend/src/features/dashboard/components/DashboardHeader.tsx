
import logo from '../../../shared/assets/logo.png';
import { useNavigate } from "react-router-dom";
import type { User } from '../../../shared/api/types';
import { UserMenuButton, type UserMenuItem } from '../../../shared/components/UserMenuButton';
import { House, LogOut, UserCog } from 'lucide-react';

interface DashboardHeaderProps{
    user: User;
    onLogout: () => void;
}

export function DashboardHeader({ user, onLogout} : DashboardHeaderProps) {
    const navigate = useNavigate();

    const goToProfile = () => navigate("/profile")
    const goToLanding = () => navigate("/")

    const items: UserMenuItem[] = [
        { id: "home", label: "Home", icon: House, onClick: goToLanding },
        { id: "profile", label: "Profile", icon: UserCog, onClick: goToProfile },
        { id: "logout", label: "Log out", icon: LogOut, onClick: onLogout, danger: true }
    ]
    
    return (
        <header className="h-20 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                        <div className="relative flex items-center justify-center w-10 h-10 shrink-0 rounded-lg">
                            <img
                            src={logo}
                            alt="PomoAI logo"
                            className="h-10 w-10 object-contain"
                            onClick={() => {navigate('/')}}
                             />
                        </div>
                        <div className="flex flex-col items-start gap-1">
                            <span className="text-2xl font-bold tracking-tight leading-none">PomoAI</span>
                            <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-slate-400 leading-none">
                                Dashboard
                            </span>
                        </div>
                    </div>
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
        </header>
    )
}
