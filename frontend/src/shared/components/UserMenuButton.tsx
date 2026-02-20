import { ChevronDown, UserIcon, type LucideIcon } from "lucide-react";

interface UserMenuButtonProps{
    items: UserMenuItem[];
}

export type UserMenuItem = {
    id: string;
    label: string;
    icon: LucideIcon;
    onClick: () => void;
    danger?: boolean
}


export function UserMenuButton({ items } : UserMenuButtonProps){
    return(
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
                    {items.map((item) => {
                    const Icon = item.icon;
                    return(
                        <button
                        key={`${item.label}`} 
                        onClick={item.onClick}
                        className={`w-full px-4 py-2.5 text-left text-sm hover:bg-white/5 transition-colors rounded-t-xl flex items-center gap-2 ${item.danger 
                            ? "text-red-400"
                            : "text-slate-200"
                        }`}
                        >
                            <Icon className="w-4 h-4" />
                            <span>{item.label}</span>
                        </button>
                    )
                    })} 
            </div>
        </div>
    )
}