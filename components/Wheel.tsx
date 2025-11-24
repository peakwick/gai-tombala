
import React from 'react';

type WheelProps = {
  isSpinning: boolean;
  currentNumber: number | null | string;
  size?: 'sm' | 'lg';
};

const Wheel: React.FC<WheelProps> = ({ isSpinning, currentNumber, size = 'lg' }) => {
  const colors = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef'];
  const containerSize = size === 'sm' ? 'w-56 h-56' : 'w-64 h-64';
  const centerSize = size === 'sm' ? 'w-40 h-40' : 'w-48 h-48';
  const textSize = size === 'sm' ? 'text-7xl' : 'text-8xl';

  return (
    <div className={`relative ${containerSize} flex items-center justify-center`}>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(1800deg); }
        }
        .wheel-container.spinning {
          animation: spin 3s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .wheel-pointer {
          width: 0;
          height: 0;
          border-left: 15px solid transparent;
          border-right: 15px solid transparent;
          border-top: 25px solid #facc15; /* yellow-400 */
          filter: drop-shadow(0 2px 2px rgba(0,0,0,0.5));
        }
      `}</style>
      <div className="absolute top-[-10px] z-10">
          <div className="wheel-pointer"></div>
      </div>
      <div className={`relative w-full h-full rounded-full overflow-hidden wheel-container ${isSpinning ? 'spinning' : ''}`}>
        <div className="absolute inset-0">
          {colors.map((color, i) => (
            <div
              key={i}
              className="absolute w-1/2 h-1/2"
              style={{
                backgroundColor: color,
                transform: `rotate(${i * (360 / colors.length)}deg)`,
                transformOrigin: '100% 100%',
                clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 0)`
              }}
            />
          ))}
        </div>
      </div>
       <div className={`absolute ${centerSize} bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white/50`}>
           <div className={`${textSize} font-bold text-white font-mono`}>
               {currentNumber || '--'}
           </div>
       </div>
    </div>
  );
};

export default Wheel;
