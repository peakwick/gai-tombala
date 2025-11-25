
import React from 'react';
import { GiftIcon, SparklesIcon, XIcon } from '../icons';
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
  onResetCurrentPrize: () => void;
  onClose: () => void;
  allowConsecutiveDraws: boolean;
};

const PrizeModal: React.FC<PrizeModalProps> = ({
  isOpen,
  isDrawing,
  currentPrizeCard,
  drawnPrizeCards,
  drawnPrizeCardsCount,
  maxPrizeCount,
  onDraw,
  onResetCurrentPrize,
  onClose,
  allowConsecutiveDraws,
}) => {
  if (!isOpen) return null;

  const previousWinners = drawnPrizeCards.filter(card => card !== currentPrizeCard);
  const prizeHasBeenDrawn = !!currentPrizeCard && !isDrawing;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-800 via-pink-700 to-red-700 rounded-3xl shadow-2xl border-4 border-yellow-400 relative overflow-hidden max-w-5xl w-full flex flex-col max-h-[90vh]">
        {prizeHasBeenDrawn && <Confetti />}
        
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>

        {/* Close Button (Absolute) */}
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 z-20 text-white/60 hover:text-white bg-black/20 hover:bg-black/40 p-2 rounded-full transition-all"
        >
            <XIcon size={24} />
        </button>

        <div className="relative z-10 flex flex-col md:flex-row h-full overflow-hidden">
            
            {/* Left Side: Wheel */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-8 bg-black/10 md:bg-transparent md:border-r border-white/10">
                 <div className="mb-4 flex items-center gap-2 md:hidden">
                    <SparklesIcon className="text-yellow-300" size={20} />
                    <h2 className="text-2xl font-bold text-white uppercase tracking-wider">SÜRPRİZ ÖDÜL</h2>
                    <SparklesIcon className="text-yellow-300" size={20} />
                </div>
                
                <div className="relative transform scale-90 md:scale-100 transition-transform">
                     {/* Wheel Glow Effect */}
                    <div className="absolute inset-0 bg-yellow-400/20 blur-3xl rounded-full"></div>
                    <Wheel
                        isSpinning={isDrawing}
                        currentNumber={currentPrizeCard || '?'}
                        size="lg"
                    />
                </div>
                
                <div className="mt-6 text-white/80 font-medium bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
                    {drawnPrizeCardsCount} / {maxPrizeCount} Ödül Verildi
                </div>
            </div>

            {/* Right Side: Controls & Info */}
            <div className="flex-1 flex flex-col p-6 md:p-10 justify-center min-w-0 bg-white/5 backdrop-blur-sm md:bg-transparent">
                
                {/* Desktop Title */}
                <div className="hidden md:flex items-center justify-center gap-3 mb-8">
                    <div className="bg-yellow-400 p-3 rounded-full shadow-lg shadow-yellow-400/50">
                        <GiftIcon size={32} className="text-purple-900" />
                    </div>
                    <h2 className="text-4xl font-black text-white uppercase tracking-wider drop-shadow-md">
                        SÜRPRİZ ÖDÜL
                    </h2>
                </div>

                {/* Actions Area */}
                <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm mx-auto space-y-6">
                    
                    {isDrawing ? (
                        <div className="text-center space-y-2">
                             <div className="text-3xl font-bold text-yellow-300 animate-pulse">ÇEKİLİYOR...</div>
                             <p className="text-white/60">Şanslı kart belirleniyor</p>
                        </div>
                    ) : !currentPrizeCard ? (
                        <div className="w-full space-y-4 text-center">
                            <p className="text-white/80 text-lg">Bir sonraki şanslı kişiyi belirlemek için butona basın.</p>
                            <button
                                onClick={onDraw}
                                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-purple-900 font-black py-5 rounded-2xl text-2xl transition-all transform hover:scale-105 shadow-xl shadow-orange-500/30 flex items-center justify-center gap-3"
                            >
                                <GiftIcon className="animate-bounce" />
                                KART ÇEK
                            </button>
                        </div>
                    ) : (
                        <div className="w-full space-y-4 animate-pop-in">
                            <div className="text-center mb-4">
                                <div className="text-white/60 uppercase text-sm font-bold tracking-widest mb-1">KAZANAN KART</div>
                                <div className="text-6xl font-black text-white drop-shadow-lg">{currentPrizeCard}</div>
                            </div>
                            
                            {allowConsecutiveDraws && (
                                <button
                                    onClick={onResetCurrentPrize}
                                    className="w-full bg-white hover:bg-gray-100 text-purple-900 font-bold py-4 rounded-xl text-xl transition-all shadow-lg flex items-center justify-center gap-2"
                                >
                                    <SparklesIcon />
                                    Bir Ödül Daha Ver
                                </button>
                            )}

                            <button
                                onClick={onClose}
                                className="w-full bg-black/20 hover:bg-black/30 text-white font-semibold py-3 rounded-xl text-lg transition-all"
                            >
                                Kapat
                            </button>
                        </div>
                    )}

                </div>

                {/* Previous Winners Footer */}
                {previousWinners.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-white/10 w-full">
                        <div className="text-white/50 text-xs font-bold uppercase tracking-wider mb-3 text-center md:text-left">
                            Önceki Kazananlar
                        </div>
                        <div className="flex flex-wrap justify-center md:justify-start gap-2 max-h-24 overflow-y-auto custom-scrollbar">
                            {[...previousWinners].reverse().map((card, index) => (
                                <div 
                                    key={index} 
                                    className="bg-black/30 text-white/90 font-mono font-bold w-10 h-10 rounded-lg flex items-center justify-center border border-white/10 text-sm shadow-sm"
                                >
                                    {card}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
         @keyframes pop-in {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop-in {
          animation: pop-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default PrizeModal;
