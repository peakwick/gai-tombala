import React from 'react';

type BoardProps = {
  drawnNumbers: number[];
  currentNumber: number | null;
};

const Board: React.FC<BoardProps> = ({ drawnNumbers, currentNumber }) => {
  const allNumbers = Array.from({ length: 90 }, (_, i) => i + 1);

  return (
    <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-2 sm:p-4 shadow-xl border border-white/20 flex flex-col min-w-0">
      <div className="flex-1 flex items-center justify-center min-h-0">
        <div className="grid grid-cols-10 gap-1.5 sm:gap-2 w-full h-full max-w-4xl">
          {allNumbers.map((num) => {
            const isDrawn = drawnNumbers.includes(num);
            const isLatest = num === currentNumber && isDrawn;
            
            let cellClasses = 'flex items-center justify-center rounded-lg font-bold text-xs sm:text-base md:text-lg lg:text-xl transition-all duration-500 ';
            if (isLatest) {
              cellClasses += 'bg-yellow-400 text-black shadow-lg ring-2 ring-yellow-300 transform scale-110';
            } else if (isDrawn) {
              cellClasses += 'bg-green-500 text-white shadow-md';
            } else {
              cellClasses += 'bg-white/20 text-white/60';
            }

            return (
              <div key={num} className={cellClasses}>
                {num}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Board;