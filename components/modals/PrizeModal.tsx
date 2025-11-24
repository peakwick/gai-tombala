
import React from 'react';
import { GiftIcon, SparklesIcon } from '../icons';
import Wheel from '../Wheel';
import Confetti from '../Confetti';

type PrizeModalProps = {
  isOpen: boolean;
  isDrawing: boolean;
  currentPrizeCard: number | null;
  drawnPrizeCards: number[];
  drawnPrizeCardsCount: number;
  maxPrizeCount: number;
  onDraw: () => void;
  onClose: () => void;
};

const PrizeModal: React.FC<PrizeModalProps> = ({
  isOpen,
  isDrawing,
  currentPrizeCard,
  drawnPrizeCards,
  drawnPrizeCardsCount,
  maxPrizeCount,
  onDraw,
  onClose,
}) => {
  if (!isOpen) return null;

  const previousWinners = drawnPrizeCards.filter(card => card !== currentPrizeCard);
  const prizeHasBeenDrawn = !!currentPrizeCard && !isDrawing;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border-4 border-yellow-400 relative overflow-hidden">
        {prizeHasBeenDrawn && <Confetti />}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
        <div className="relative">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-yellow-400 rounded-full p-6 animate-bounce">
              <GiftIcon size={64} className="text-purple-600" />
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mb-4">
            <SparklesIcon className="text-yellow-300" size={24} />
            <h2 className="text-3xl sm:text-4xl font-bold text-white text-center">SÜRPRİZ ÖDÜL!</h2>
            <SparklesIcon className="text-yellow-300" size={24} />
          </div>
          
          <div className="flex flex-col items-center justify-center mb-6 min-h-[300px]">
            <div className="text-white/80 text-sm text-center mb-2">Kazanan Kart No:</div>
            <Wheel
              isSpinning={isDrawing}
              currentNumber={currentPrizeCard || '?'}
            />
          </div>
          
          {previousWinners.length > 0 && (
            <div className="mb-4">
              <div className="text-white/80 text-center text-sm mb-2">Önceki Kazanan Kartlar:</div>
              <div className="flex justify-center flex-wrap gap-2">
                {[...previousWinners].reverse().map((card, index) => (
                  <div key={index} className="bg-white/10 text-white font-semibold w-12 h-12 rounded-lg flex items-center justify-center text-lg">
                    {card}
                  </div>
                ))}
              </div>
            </div>
          )}

          {isDrawing ? (
             <div className="text-center text-white text-xl font-bold animate-pulse h-14 flex items-center justify-center">ÇEKİLİYOR...</div>
          ) : !currentPrizeCard ? (
            <button
              onClick={onDraw}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold py-4 rounded-xl text-xl transition-all transform hover:scale-105 shadow-xl h-14"
            >
              KART NUMARASI ÇEK
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-full bg-white hover:bg-gray-100 text-purple-900 font-bold py-4 rounded-xl text-xl transition-all h-14"
            >
              Kapat
            </button>
          )}

          <div className="mt-4 text-white/80 text-center text-sm">
            {drawnPrizeCardsCount}/{maxPrizeCount} Sürpriz Çekildi
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrizeModal;
