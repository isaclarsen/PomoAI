import { RefreshCw } from "lucide-react";
import type { QuestionDTO } from "../api/pomoApi";
import { AppBackground } from "../components/AppBackground";

interface ResultViewProps {
    score: number
    questions: QuestionDTO[];
    onReset: () => void
}

export function ResultView({score, questions, onReset} : ResultViewProps){
    return(
        <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-center relative overflow-hidden p-6">
            <AppBackground />
                
            <div className="relative z-10 max-w-md w-full text-center space-y-8 animate-fade-in-up">
                    
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    Well done!
                </h2>
                    
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
                    <p className="text-slate-400 text-sm uppercase tracking-widest mb-2">Your result</p>
                    <p className="text-slate-300">You got {score} out of {questions.length} right</p>
                </div>

                <button 
                    onClick={onReset}
                    className="group flex items-center justify-center gap-2 w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-slate-200 transition-all active:scale-95"
                >
                    <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                    Go to dashboard
                </button>
            </div>
        </div>
    )
}