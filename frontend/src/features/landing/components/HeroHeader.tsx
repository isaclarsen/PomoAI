export function HeroHeader(){
    return(
        <div className="flex flex-col items-center w-full">
            {/* Badge */}
            <div className="mb-8 animate-fade-in-up">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                    <span className="text-xs font-bold bg-gradient-to-r from-rose-400 to-indigo-400 bg-clip-text text-transparent uppercase tracking-wider">Don't let AI make you dumb</span>
                </div>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-center tracking-tight mb-8 max-w-5xl leading-[1.1]">
                Master any topic with <br className="hidden md:block" />
                <span className="inline-block bg-gradient-to-r from-rose-400 via-white to-indigo-400 bg-clip-text text-transparent pb-2">
                        PomoAI
                </span>
            </h1>

                {/* Undertitle */}
            <p className="text-lg md:text-xl text-slate-400 text-center max-w-2xl mb-12 leading-relaxed font-light">
                Stop passively reading. Start actively recalling. <br className="hidden sm:block" />
                PomoAI generates questions, not answers.
            </p>
        </div>
    )
}