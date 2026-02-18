import { Loader2 } from "lucide-react";
import { AppBackground } from "../../../shared/components/AppBackground";

interface TopicTextViewProps{
    topic : string
    topicText : string;
    onFinished: () => void;
}

function DemoTextView({ topic, topicText, onFinished } : TopicTextViewProps){

    if(!topicText || topicText.length === 0){
        return(
            <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-center relative overflow-hidden">
                <AppBackground />
                <div className="relative z-10 flex flex-col items-center gap-4 animate-pulse">
                    <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                    <p className="text-slate-400 font-medium tracking-widest uppercase text-sm">Generating text...</p>
                </div>
            </div>
        )
    }

    return(
        <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-center relative overflow-hidden p-6">
            <AppBackground />
            <div className="relative z-10 w-full max-w-5xl space-y-8 animate-fade-in-up">
                <div className="text-center space-y-3">
                    <p className="text-xs font-bold tracking-widest uppercase text-slate-500">{topic}</p>
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                        Read and remember
                    </h2>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-6 backdrop-blur-md">
                        <p className="text-slate-300 text-base md:text-lg font-light text-pretty md:gap-10">
                            {topicText}
                        </p>
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={onFinished}
                        className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all shadow-lg active:scale-95"
                    >
                        I'm ready for questions
                    </button>
                </div>
            </div>
        </div>
    )
}
export default DemoTextView
