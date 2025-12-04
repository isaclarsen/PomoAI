import { useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";

interface HeroSessionInputProps {
    onStart: (topic: string) => void;
}

export function HeroSessionInput({ onStart } : HeroSessionInputProps) {
    const [topic, setTopic] = useState('');

    const handleInputSubmit = () => {
        if(topic.trim()) {
            onStart(topic);
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleInputSubmit();
        }
    }



    return(
        <div className="w-full max-w-2xl relative group z-20">
            {/* Yttre glöd */}
            <div className="absolute -inset-4 bg-gradient-to-r from-rose-500/20 via-indigo-500/20 to-blue-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
                            
            {/* Den roterande ramen */}
            <div className="relative rounded-2xl p-[1.5px] overflow-hidden transition-all duration-300 hover:shadow-[0_0_80px_-20px_rgba(225,29,72,0.4)]">
                <div
                    className="absolute inset-0 bg-[conic-gradient(from_90deg_at_50%_50%,#312e81_45%,#e11d48_50%,#312e81_55%)] border-spin-smooth opacity-80 group-hover:opacity-100"
                />
        
                                
                {/* Själva input-boxen */}
                <div className="relative flex items-center bg-[#0A0A0A] rounded-[14px] p-2 shadow-2xl h-full w-full">
                    <div className="pl-4 pr-3">
                        <Sparkles className="w-5 h-5 text-slate-400 group-focus-within:text-rose-400 transition-colors duration-500" />
                    </div>
        
                    <input
                        type="text"
                        value={topic}
                         onChange={(e) => setTopic(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="What do you want to learn?"
                        className="flex-1 bg-transparent border-none text-white placeholder-slate-500 focus:ring-0 text-lg h-12 outline-none font-medium"
                    />
        
                    {/* Start-knapp (Pilen) */}
                    <div className="flex items-center gap-2 pr-1">
                        <button 
                            onClick={handleInputSubmit}
                            disabled={!topic.trim()}
                            className="ml-1 p-2.5 rounded-xl bg-white text-black hover:bg-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-lg shadow-white/10 z-10"
                        >
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}