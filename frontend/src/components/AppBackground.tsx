export function AppBackground(){
    return(
        <div className="fixed inset-0 z-0 pointer-events-none opacity-70">
            <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" />
            <div className="absolute top-[10%] right-[-10%] w-[60vw] h-[60vw] bg-rose-600/15 rounded-full blur-[130px] mix-blend-screen" />
            <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[50vw] bg-blue-600/10 rounded-full blur-[150px] mix-blend-screen" />
            <div className="absolute inset-0 opacity-[0.12] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        </div>
    )
}