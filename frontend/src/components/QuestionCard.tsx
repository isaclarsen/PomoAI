import { Eye, CheckCircle2, XCircle } from "lucide-react";
import type { QuestionDTO } from "../api/pomoApi";

interface QuestionCardProps {
    question: QuestionDTO;
    shuffledOptions: string[];
    isOptionsRevealed: boolean;
    selectedOption: string | null;
    onReveal: () => void;
    onOptionSelect: (opt: string) => void;
}

export function QuestionCard({ 
    question, 
    shuffledOptions, 
    isOptionsRevealed, 
    selectedOption, 
    onReveal, 
    onOptionSelect 
} : QuestionCardProps) {

    return (
        <div className="space-y-8 animate-fade-in-up">
                {/* Question */}
                <div key={question.id} className="space-y-8 animate-fade-in-up">
                    <h2 className="text-3xl md:text-4xl font-bold leading-tight text-center">
                        {question.text}
                    </h2>

                    {/* STEP 1: Active recall (Hide alternatives) */}
                    {!isOptionsRevealed && (
                        <div className="flex flex-col items-center gap-4">
                            <p className="text-slate-400 text-lg italic">Take a moment to think before revealing options.</p>
                            <button 
                                onClick={() => onReveal()}
                                className="group flex items-center gap-3 px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-indigo-500/50 transition-all active:scale-95 mt-4"
                            >
                                <span className="text-slate-300 font-medium group-hover:text-white transition-colors">
                                    Reveal options
                                </span>
                                <Eye className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300" />
                            </button>
                        </div>
                    )}

                    {/* STEP 2: Choose (Show alternatives) */}
                    {isOptionsRevealed && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up">
                            {shuffledOptions.map((option) => {                       
                                
                                let containerClass = "border-white/10 bg-white/5 hover:bg-white/10 text-slate-300";
                                let icon = null;

                                if(selectedOption){
                                    if(option === question.correctAnswer){
                                        // Correct
                                        containerClass = "border-emerald-500/50 bg-emerald-500/10 text-emerald-200 shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]";
                                        icon = <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
                                    } else if(option === selectedOption){
                                        // Incorrect
                                        containerClass = "border-rose-500/50 bg-rose-500/10 text-rose-200";
                                        icon = <XCircle className="w-5 h-5 text-rose-400" />;
                                    } else {
                                        containerClass = "border-white/5 bg-black/20 text-slate-600 opacity-50";
                                    }
                                }
                                
                                return (
                                    <button
                                        key={option}
                                        onClick={() => onOptionSelect(option)}
                                        disabled={!!selectedOption}
                                        className={`
                                            relative flex items-center justify-between p-6 rounded-xl border text-left transition-all duration-300
                                            ${containerClass}
                                            ${!selectedOption && "hover:scale-[1.02] hover:shadow-lg active:scale-95"}
                                        `}
                                    >
                                        <span className="font-medium text-lg">{option}</span>
                                        {icon}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
        </div>
    );
}