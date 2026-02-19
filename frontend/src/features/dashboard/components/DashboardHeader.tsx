
import logo from '../../../shared/assets/logo.png';
import { useNavigate } from "react-router-dom";
import {
    ChevronDown,
    LogOut,
    UserCog,
    UserIcon
} from "lucide-react";
import type { User } from '../../../shared/api/types';

interface DashboardHeaderProps{
    user: User;
    onLogout: () => void;
}

export function DashboardHeader({ user, onLogout} : DashboardHeaderProps) {
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
                        <div className="flex flex-col items-end">
                            <p className="text-lg font-semibold text-slate-100">
                            {user.displayName}
                            </p>
                            <p className="text-xs font-light text-slate-300">
                            {user.educationLevel}
                            </p>
                        </div>
                    <div className="relative group">
                        <button
                            type="button"
                            aria-label="User profile"
                            className="h-12 pl-4 pr-3 rounded-full ring-1 ring-slate-200/20 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition flex items-center justify-center gap-2"
                        >
                            <UserIcon className="h-5 w-5" />
                            <ChevronDown className="h-4 w-4 text-slate-400 transition-transform duration-200 group-hover:rotate-180 group-hover:text-white group-focus-within:rotate-180 group-focus-within:text-white" />
                        </button>
                        <div className="absolute right-0 mt-2 min-w-40 rounded-xl border border-white/10 bg-[#111111]/95 backdrop-blur-sm shadow-xl opacity-0 invisible translate-y-1 transition-all duration-150 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0">
                            <div className="absolute -top-1 right-5 h-2 w-2 rotate-45 border-l border-t border-white/10 bg-[#111111]/95" />
                            <button
                                type="button"
                                className="w-full px-4 py-2.5 text-left text-sm text-slate-200 hover:bg-white/5 transition-colors rounded-t-xl"
                            >
                               <UserCog className="h-3 w-3 "/> Profile
                            </button>
                            <button
                                type="button"
                                className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-white/5 transition-colors rounded-b-xl"
                                onClick={onLogout}
                            >
                                <LogOut className="h-3 w-3 text-red-400" /> Log out
                            </button>
                        </div>
                    </div>
                    </div>
                </header>
    )
}
