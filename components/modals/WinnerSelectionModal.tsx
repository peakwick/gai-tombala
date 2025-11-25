
import React, { useState, useEffect, useRef } from 'react';
import { WinType } from '../../types';
import Confetti from '../Confetti';
import { SparklesIcon, GiftIcon } from '../icons';

type WinnerSelectionModalProps = {
  isOpen: boolean;
  type: WinType | null;
  onClose: () => void;
  onComplete: () => void;
  playSound: (soundName: string) => void;
  playSpinSound: (soundName: string, duration: number) => void;
  winSound: string;
  onOpenManualPrizeModal: () => void;
  totalCardsForPrize: number;
};

type Step = 'count' | 'names' | 'drawing' | 'result';

const WinnerSelectionModal: React.FC<WinnerSelectionModalProps> = ({
  isOpen,
  type,
  onClose,
  onComplete,
  playSound,
  playSpinSound,
  winSound,
  onOpenManualPrizeModal,
  totalCardsForPrize,
}) => {
  const [step, setStep] = useState<Step>('count');
  const [winnerCount, setWinnerCount] = useState<number | null>(null);
  const [names, setNames] = useState<string[]>([]);
  const [selectedWinner, setSelectedWinner] = useState<string | null>(null);
  const [animationNames, setAnimationNames] = useState<string[]>([]);
  
  const reelRef = useRef<HTMLDivElement>(null);
  const ITEM_HEIGHT = 96; // 6rem / 96px for better visibility

  useEffect(() => {
    if (isOpen) {
      setStep('count');
      setWinnerCount(null);
      setNames([]);
      setSelectedWinner(null);
      setAnimationNames([]);
    }
  }, [isOpen]);

  useEffect(() => {
    // Slot machine animation logic
    if (step === 'drawing' && reelRef.current && animationNames.length > 0) {
        const totalScroll = (animationNames.length - 1) * ITEM_HEIGHT;
        const duration = 4000; // 4 seconds

        const animation = reelRef.current.animate([
            { transform: 'translateY(0)', filter: 'blur(0)' },
            { filter: 'blur(2px)', offset: 0.1 },
            { filter: 'blur(4px)', offset: 0.5 },
            { filter: 'blur(2px)', offset: 0.8 },
            { transform: `translateY(-${totalScroll}px)`, filter: 'blur(0)' }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.25, 1, 0.5, 1)', // Ease out nicely
            fill: 'forwards'
        });

        const timer = setTimeout(() => {
             setStep('result');
             playSound(winSound);
        }, duration + 300); // Small buffer

        return () => {
            animation.cancel();
            clearTimeout(timer);
        };
    }
  }, [step, animationNames, playSound, winSound, ITEM_HEIGHT]);


  const handleCountSelect = (count: number) => {
    if (count === 1) {
        // Direct win for 1 person (skip name entry)
        setSelectedWinner(null);
        setStep('result');
        playSound(winSound);
    } else {
        setWinnerCount(count);
        setNames(Array(count).fill(''));
        setStep('names');
    }
  };

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...names];
    newNames[index] = value;
    setNames(newNames);
  };

  const handleNameSubmit = () => {
    const finalNames = names.map((name, i) => name.trim() || `${i + 1}. Aday`);
    performDraw(finalNames);
  };

  const performDraw = (finalNames: string[]) => {
    // 1. Pick winner
    const winner = finalNames[Math.floor(Math.random() * finalNames.length)];
    setSelectedWinner(winner);

    // 2. Prepare reel list
    const REEL_LENGTH = 50; 
    let reelList: string[] = [];
    
    // Fill the list with random names from the participants
    for (let i = 0; i < REEL_LENGTH - 1; i++) {
        const randomName = finalNames[Math.floor(Math.random() * finalNames.length)];
        reelList.push(randomName);
    }

    // Ensure the item immediately before the winner is NOT the winner
    if (finalNames.length > 1) {
        const lastIndex = reelList.length - 1;
        if (reelList[lastIndex] === winner) {
            const otherNames = finalNames.filter(n => n !== winner);
            reelList[lastIndex] = otherNames[Math.floor(Math.random() * otherNames.length)];
        }
    }
    
    // Finally, append the winner as the absolute last item
    reelList.push(winner);
    
    setAnimationNames(reelList);
    setStep('drawing');
    playSpinSound('draw_retro', 4);
  };

  const handleOpenPrize = () => {
      onOpenManualPrizeModal();
  };

  if (!isOpen || !type) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border-4 border-yellow-400 relative overflow-hidden flex flex-col min-h-[450px]">
        {step === 'result' && <Confetti />}
        
        {/* Header */}
        <div className="text-center mb-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase drop-shadow-lg tracking-wide">
            {type}
          </h2>
          {step === 'count' && <p className="text-white/70 mt-2 text-lg">Kaç kişi aynı anda kazandı?</p>}
          {step === 'names' && <p className="text-white/70 mt-2 text-lg">Kazananların isimlerini girin</p>}
          {step === 'drawing' && <p className="text-white/70 mt-2 text-lg">Kazanan belirleniyor...</p>}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full">
          
          {/* STEP 1: COUNT SELECTION */}
          {step === 'count' && (
            <div className="grid grid-cols-5 gap-3 sm:gap-4 w-full">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => handleCountSelect(num)}
                  className="aspect-square rounded-2xl bg-white/10 hover:bg-yellow-400 hover:text-black text-white border-2 border-white/20 hover:border-yellow-300 text-3xl font-bold transition-all transform hover:scale-105 shadow-xl flex items-center justify-center"
                >
                  {num}
                </button>
              ))}
            </div>
          )}

          {/* STEP 2: NAME INPUT */}
          {step === 'names' && (
            <div className="w-full space-y-3">
              {names.map((name, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-400 text-black flex items-center justify-center font-bold flex-shrink-0">
                    {idx + 1}
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleNameChange(idx, e.target.value)}
                    placeholder={`${idx + 1}. Kişinin İsmi`}
                    className="flex-1 bg-white/20 border-2 border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-yellow-400 focus:bg-white/30 transition-all font-semibold text-lg"
                    autoFocus={idx === 0}
                  />
                </div>
              ))}
              <div className="pt-4">
                 <button
                  onClick={handleNameSubmit}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 rounded-xl text-xl transition-all shadow-lg transform hover:scale-[1.02]"
                >
                  Çekiliş Yap
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SLOT MACHINE ANIMATION */}
          {step === 'drawing' && (
             <div className="w-full max-w-md mx-auto relative">
                {/* Pointer/Indicator - Centered relative to the reel height */}
                {/* Using top-[45%] to nudge it slightly up as requested */}
                <div className="absolute top-[48px] -translate-y-1/2 -left-6 z-20">
                     <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[15px] border-l-yellow-400 border-b-[10px] border-b-transparent drop-shadow-md"></div>
                </div>
                <div className="absolute top-[48px] -translate-y-1/2 -right-6 z-20">
                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-r-[15px] border-r-yellow-400 border-b-[10px] border-b-transparent drop-shadow-md"></div>
                </div>

                {/* Slot Reel Container */}
                <div 
                    className="w-full overflow-hidden bg-black/60 border-4 border-yellow-500 rounded-lg shadow-inner relative"
                    style={{ height: `${ITEM_HEIGHT}px` }}
                >
                    {/* Glossy overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 pointer-events-none z-10"></div>
                    
                    {/* The Reel */}
                    <div ref={reelRef} className="w-full">
                        {animationNames.map((name, index) => (
                            <div 
                                key={`${name}-${index}`}
                                className="w-full flex items-center justify-center font-bold text-white uppercase tracking-wider px-4 text-center truncate"
                                style={{ 
                                    height: `${ITEM_HEIGHT}px`,
                                    fontSize: name.length > 15 ? '1.5rem' : '2rem',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                                }}
                            >
                                {name}
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="mt-8 text-center text-white/50 text-sm animate-pulse">
                    KADER ANI...
                </div>
             </div>
          )}

          {/* STEP 4: RESULT */}
          {step === 'result' && (
            <div className="text-center animate-pop-in w-full max-w-lg mx-auto">
                <style>{`
                    @keyframes pop-in {
                    0% { transform: scale(0.5); opacity: 0; }
                    60% { transform: scale(1.1); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                    }
                    .animate-pop-in {
                    animation: pop-in 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards;
                    }
                `}</style>
                <div className="mb-6 flex justify-center">
                    <div className="bg-yellow-400 rounded-full p-4 shadow-xl shadow-yellow-400/50">
                        <SparklesIcon size={48} className="text-purple-900" />
                    </div>
                </div>
                
                {selectedWinner ? (
                    <>
                        <div className="text-2xl text-yellow-300 font-bold mb-2 tracking-widest uppercase">
                            KAZANAN
                        </div>
                        <div className="text-4xl sm:text-5xl font-black text-white mb-8 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] leading-tight break-words">
                            {selectedWinner}
                        </div>
                    </>
                ) : (
                    <div className="text-4xl sm:text-6xl font-black text-white mb-8 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                        TEBRİKLER!
                    </div>
                )}
                
                <div className="flex flex-col gap-3">
                    {type === 'TOMBALA' && totalCardsForPrize > 0 && (
                        <button
                            onClick={handleOpenPrize}
                            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-bold text-lg transition-all shadow-lg hover:scale-[1.02] flex items-center justify-center gap-2"
                        >
                            <GiftIcon size={24} />
                            Sürpriz Ödül Dağıt
                        </button>
                    )}
                    <button
                        onClick={onComplete}
                        className="bg-white text-indigo-900 hover:bg-gray-100 px-8 py-3 rounded-xl font-bold text-lg transition-all shadow-xl hover:scale-[1.02]"
                    >
                        {type === 'TOMBALA' ? 'Tamamla' : 'Devam Et'}
                    </button>
                </div>
            </div>
          )}
        </div>
        
        {/* Cancel Button */}
        {(step === 'count' || step === 'names') && (
             <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-white/50 hover:text-white p-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        )}

      </div>
    </div>
  );
};

export default WinnerSelectionModal;
