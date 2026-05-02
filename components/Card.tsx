
import React from 'react';
import { TombalaCard } from '../types';

type CardProps = {
  card: TombalaCard;
  customLogo: string | null;
  selectedYear: number;
};

const Card: React.FC<CardProps> = ({ card, customLogo, selectedYear }) => {
  return (
    <div
      className="bg-white rounded-xl p-6 shadow-xl print:shadow-none print:rounded-none my-4 print:my-6"
      style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
    >
      <div className="flex justify-between items-center mb-4 pb-3 border-b-2 border-gray-300">
        <div className="text-3xl font-bold text-red-600">TOMBALA</div>
        <div className="text-base font-semibold text-gray-600">Kart No: {card.id}</div>
      </div>

      <div className="border-4 border-gray-800 rounded-lg overflow-hidden">
        {card.numbers.map((row, rowIdx) => (
          <div key={rowIdx} className="flex">
            {row.map((num, colIdx) => (
              <div
                key={colIdx}
                className="relative flex-1 h-16 print:h-12 border-2 border-gray-700 flex items-center justify-center font-bold text-2xl print:text-xl bg-white text-gray-800"
              >
                {num === null && (
                  <div className="absolute inset-0 bg-gray-300 opacity-50"></div>
                )}
                <span className="relative z-10">{num}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-3 text-sm text-gray-500 text-center uppercase tracking-tight">
        {selectedYear} Yılbaşı Tombalası
      </div>
    </div>
  );
};

export default Card;
