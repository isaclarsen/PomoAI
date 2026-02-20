export function AppBackground() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none opacity-85">
            <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-[radial-gradient(closest-side,rgba(79,70,229,0.2),transparent)] mix-blend-screen transform-gpu" />
            <div className="absolute top-[10%] right-[-10%] w-[60vw] h-[60vw] bg-[radial-gradient(closest-side,rgba(225,29,72,0.15),transparent)] mix-blend-screen transform-gpu" />
            <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[50vw] bg-[radial-gradient(closest-side,rgba(37,99,235,0.10),transparent)] mix-blend-screen transform-gpu" />
            <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        </div>
    )
}