
import React from 'react';

const Confetti: React.FC = () => {
    const confettiCount = 100;
    const colors = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#14b8a6', '#3b82f6', '#8b5cf6', '#d946ef'];

    return (
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-[100]">
            <style>{`
                @keyframes confetti-fall {
                    0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
                }
            `}</style>
            {Array.from({ length: confettiCount }).map((_, i) => {
                const style = {
                    position: 'absolute' as const,
                    left: `${Math.random() * 100}%`,
                    width: `${Math.random() * 0.8 + 0.4}rem`,
                    height: `${Math.random() * 0.5 + 0.3}rem`,
                    backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                    animation: `confetti-fall ${Math.random() * 2 + 3}s linear ${Math.random() * 2}s 1 forwards`,
                    opacity: 0,
                };
                return <div key={i} style={style} />;
            })}
        </div>
    );
};

export default Confetti;
