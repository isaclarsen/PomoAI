
import logo from '../../../shared/assets/logo.png';
import { useNavigate } from "react-router-dom";
import { UserIcon } from "lucide-react";
import type { User } from '../../../shared/api/types';

interface DashboardHeaderProps{
    user: User;
}

export function DashboardHeader({user} : DashboardHeaderProps) {
    const navigate = useNavigate();
    
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
                    <button
                        type="button"
                        aria-label="User profile"
                        className="h-12 w-12 rounded-full ring-1 ring-slate-200/20 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition flex items-center justify-center"
                    >
                        <UserIcon className="h-5 w-5" />

                    </button>
                        <div className="flex flex-col items-start">
                            <p className="text-lg font-semibold text-slate-100">
                            {user.displayName}
                            </p>
                            <p className="text-xs font-light text-slate-300">
                            {user.educationLevel}
                            </p>
                        </div>
                    </div>
                </header>
    )
}