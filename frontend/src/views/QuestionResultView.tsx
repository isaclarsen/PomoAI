import { useState, useMemo } from "react";
import type { QuestionDTO } from "../api/pomoApi";
import { Loader2, ArrowRight, RefreshCw } from "lucide-react";
import { AppBackground } from "../components/AppBackground";
import { QuestionCard } from "../components/QuestionCard";
import { ResultView } from "./ResultView";

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
            <ResultView
                score={score}
                questions={questions}
                onReset={onReset}
            />
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

                <QuestionCard
                    question={currentQuestion}
                    shuffledOptions={shuffledOptions}
                    isOptionsRevealed={isOptionsRevealed}
                    selectedOption={selectedOption}
                    onReveal = {() => setIsOptionsRevealed(true)}
                    onOptionSelect={handleOptionClick}

                />

                {/* Next quiestion / End session Button */}
                <div className="h-16 flex justify-center">
                    {selectedOption && (
                        questions.length === currentIndex + 1 ? (
                            <button 
                                onClick={handleNextQuestion} 
                                className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-rose-300 transition-all shadow-lg animate-fade-in-up"
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