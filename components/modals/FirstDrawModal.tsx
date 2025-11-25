
import React from 'react';
import { GiftIcon, SparklesIcon } from '../icons';

type FirstDrawModalProps = {
  isOpen: boolean;
  totalCards: number;
  maxPrizes: number;
  onTotalCardsChange: (value: number) => void;
  onMaxPrizesChange: (value: number) => void;
  onConfirm: (enablePrizes: boolean) => void;
};

const FirstDrawModal: React.FC<FirstDrawModalProps> = ({
  isOpen,
  totalCards,
  maxPrizes,
  onTotalCardsChange,
  onMaxPrizesChange,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-800 via-pink-700 to-red-700 rounded-3xl shadow-2xl border-4 border-yellow-400 relative overflow-hidden max-w-4xl w-full flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>

        {/* Left Side: Visuals & Intro */}
        <div className="flex-1 p-6 md:p-10 bg-black/10 md:bg-transparent md:border-r border-white/10 flex flex-col items-center justify-center text-center relative z-10">
            <div className="bg-yellow-400 p-4 rounded-full shadow-lg shadow-yellow-400/50 mb-6 animate-bounce">
              <GiftIcon size={48} className="text-purple-900" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-wider mb-4 drop-shadow-md">
              Sürpriz Ödül?
            </h2>
            <p className="text-white/80 text-lg leading-relaxed">
               Oyun heyecanını artırmak için katılımcılara rastgele sürpriz hediyeler vermek ister misiniz?
            </p>
        </div>

        {/* Right Side: Configuration & Actions */}
        <div className="flex-1 p-6 md:p-10 flex flex-col justify-center bg-white/5 backdrop-blur-sm md:bg-transparent relative z-10">
            <div className="space-y-6 mb-8">
               <div className="space-y-2">
                  <label className="text-white font-bold text-sm uppercase tracking-wide flex items-center gap-2">
                    <SparklesIcon size={16} className="text-yellow-400"/>
                    Toplam Kart Adedi
                  </label>
                  <input
                    type="number"
                    min="0" max="500"
                    value={totalCards || ''}
                    onChange={(e) => onTotalCardsChange(Math.max(0, Math.min(500, parseInt(e.target.value) || 0)))}
                    placeholder="Örn: 100"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border-2 border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400 focus:bg-white/20 transition-all font-bold text-lg"
                  />
                  <p className="text-white/50 text-xs">Dağıttığınız toplam kart sayısı</p>
               </div>

               <div className="space-y-2">
                  <label className="text-white font-bold text-sm uppercase tracking-wide flex items-center gap-2">
                     <GiftIcon size={16} className="text-yellow-400"/>
                     Verilecek Ödül Sayısı
                  </label>
                  <input
                    type="number"
                    min="1" max="50"
                    value={maxPrizes}
                    onChange={(e) => onMaxPrizesChange(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                    placeholder="Örn: 5"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border-2 border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400 focus:bg-white/20 transition-all font-bold text-lg"
                  />
                  <p className="text-white/50 text-xs">Kaç adet sürpriz çekiliş yapılacak?</p>
               </div>
            </div>

            <div className="flex flex-col gap-3">
                 <button
                  onClick={() => onConfirm(true)}
                  disabled={totalCards === 0}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2 transform active:scale-95 ${
                    totalCards === 0
                      ? 'bg-gray-500/50 cursor-not-allowed text-gray-300'
                      : 'bg-yellow-400 hover:bg-yellow-300 text-purple-900 shadow-yellow-400/30'
                  }`}
                >
                  <SparklesIcon />
                  Evet, İstiyorum
                </button>
                <button
                  onClick={() => onConfirm(false)}
                  className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl text-lg transition-all border border-white/10"
                >
                  Hayır, Teşekkürler
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default FirstDrawModal;
