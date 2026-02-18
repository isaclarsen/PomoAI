interface CircularProgressProps {
    size?: number;
    strokeWidth?: number;
    timeLeft: number;
    totalTime: number;
    children: React.ReactNode;
}

export function CircularProgress({ 
    size = 550, 
    strokeWidth = 2,
    timeLeft, 
    totalTime, 
    children 
}: CircularProgressProps) {
    
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const progress = timeLeft / totalTime;
    const dashOffset = circumference - progress * circumference;

    return (
        <div className="relative flex items-center justify-center">
            {/* SVG circle */}
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="transform -rotate-90 pointer-events-none absolute"
            >
                {/* Background-circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    className="stroke-white/5"
                    strokeWidth={strokeWidth}
                />

                {/* Progress-circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-linear"
                />

                {/* Definition of gradient */}
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#fb7185"/>
                        <stop offset="100%" stopColor="#818cf8"/>
                    </linearGradient>
                </defs>
            </svg>

            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}