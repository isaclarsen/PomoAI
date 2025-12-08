import { useState, useMemo } from "react";
import type { QuestionDTO } from "../api/pomoApi";
import { Loader2, Eye, ArrowRight, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { AppBackground } from "../components/AppBackground";

interface QuestionResultViewProps {
    onReset: () => void;
    questions: QuestionDTO[];
}

function QuestionResultView({ onReset, questions }: QuestionResultViewProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isOptionsRevealed, setIsOptionsRevealed] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [score, setScore] = useState(0);

    const currentQuestion = questions[currentIndex];
    const isQuizFinished = currentIndex >= questions.length
    
    //Shuffling options since AI tends to always pick the first options as correct
    const shuffledOptions = useMemo(() => {
        if (!currentQuestion) return [];
        const currentOptionsCopy = [...currentQuestion.options];
        currentOptionsCopy.sort(() => Math.random() - 0.5)
        return currentOptionsCopy; 
    }, [currentQuestion]);
    
    const handleOptionClick = (option: string) => {
        if (selectedOption !== null) return;
        setSelectedOption(option)
        if(option === currentQuestion.correctAnswer){
            setScore(score + 1)
        }
    };

    const handleNextQuestion = () => {
        setIsOptionsRevealed(false);
        setSelectedOption(null)
        setCurrentIndex(currentIndex + 1)
    };

    // LOADING VIEW
    if(!questions || questions.length === 0){
        return(
            <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-center relative overflow-hidden">
                <AppBackground />
                <div className="relative z-10 flex flex-col items-center gap-4 animate-pulse">
                    <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                    <p className="text-slate-400 font-medium tracking-widest uppercase text-sm">Generating questions...</p>
                </div>
            </div>
        )
    }

    // RESULT VIEW
    if (isQuizFinished) {
        
        return (
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

    // ACTIVE QUESTION VIEW
    return (
        <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-center relative overflow-hidden p-6">
            <AppBackground />

            {/* Main Content Container */}
            <div className="relative z-10 w-full max-w-3xl flex flex-col gap-8 min-h-[50vh] justify-center">
                
                {/* Header: Progress */}
                <div className="flex justify-between items-center text-xs font-bold tracking-widest text-slate-500 uppercase border-b border-white/10 pb-4">
                    <span>Active Recall</span>
                    <span>{currentIndex + 1} / {questions.length}</span>
                </div>

                {/* Question */}
                <div key={currentIndex} className="space-y-8 animate-fade-in-up">
                    <h2 className="text-3xl md:text-4xl font-bold leading-tight text-center">
                        {currentQuestion.text}
                    </h2>

                    {/* STEP 1: Active recall (Hide alternatives) */}
                    {!isOptionsRevealed && (
                        <div className="flex flex-col items-center gap-4">
                            <p className="text-slate-400 text-lg italic">Try to actively come up with the answer before showing alternatives...</p>
                            <button 
                                onClick={() => setIsOptionsRevealed(true)}
                                className="group flex items-center gap-3 px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-indigo-500/50 transition-all active:scale-95 mt-4"
                            >
                                <span className="text-slate-300 font-medium group-hover:text-white transition-colors">
                                    Show alternatives
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
                                    if(option === currentQuestion.correctAnswer){
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
                                        onClick={() => handleOptionClick(option)}
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

                {/* STEP 3: Next quiestion / End session Button */}
                <div className="h-16 flex justify-center">
                    {selectedOption && (
                        questions.length === currentIndex + 1 ? (
                            <button 
                                onClick={handleNextQuestion} 
                                className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all shadow-lg animate-fade-in-up"
                            >
                                End Session
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        ) : (
                            <button 
                                onClick={handleNextQuestion} 
                                className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all shadow-lg animate-fade-in-up"
                            >
                                Next question
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

export default QuestionResultView;