import { Loader2 } from 'lucide-react';

export default function LoadingView() {
    return (
        <div className="min-h-screen bg-[#090010] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 animate-pulse">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                <p className="text-slate-500 text-sm font-medium tracking-widest uppercase">
                    Loading Pomo.AI...
                </p>
            </div>
        </div>
    );
}