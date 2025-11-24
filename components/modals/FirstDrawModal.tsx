
import React from 'react';
import { GiftIcon } from '../icons';

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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border-4 border-yellow-400 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
        <div className="relative">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-yellow-400 rounded-full p-6">
              <GiftIcon size={64} className="text-purple-600" />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-6">Sürpriz Ödül Vermek İster Misiniz?</h2>
          <p className="text-white/90 text-center mb-8 text-lg">
            Oyun sırasında rastgele zamanlarda kart numarası çekerek katılımcılara küçük hediyeler verebilirsiniz.
          </p>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border-2 border-white/30 space-y-4">
            <div>
              <label className="text-white font-semibold mb-2 block">Toplam Kart Adedi:</label>
              <input
                type="number"
                min="0" max="500"
                value={totalCards || ''}
                onChange={(e) => onTotalCardsChange(Math.max(0, Math.min(500, parseInt(e.target.value) || 0)))}
                placeholder="Dağıttığınız toplam kart sayısı"
                className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 border-2 border-purple-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg font-semibold"
              />
              <p className="text-white/70 text-sm mt-1">Katılımcılara dağıttığınız toplam kart sayısını girin.</p>
            </div>
            <div>
              <label className="text-white font-semibold mb-2 block">Maksimum Ödül Adedi:</label>
              <input
                type="number"
                min="1" max="50"
                value={maxPrizes}
                onChange={(e) => onMaxPrizesChange(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                placeholder="Verilecek ödül sayısı"
                className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 border-2 border-purple-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg font-semibold"
              />
              <p className="text-white/70 text-sm mt-1">Oyun boyunca kaç tane sürpriz ödül vereceğinizi belirleyin.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => onConfirm(false)}
              className="flex-1 bg-white/20 hover:bg-white/30 text-white font-bold py-4 rounded-xl text-lg transition-all border-2 border-white/40"
            >
              Hayır, İstemiyorum
            </button>
            <button
              onClick={() => onConfirm(true)}
              disabled={totalCards === 0}
              className={`flex-1 font-bold py-4 rounded-xl text-lg transition-all ${
                totalCards === 0
                  ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                  : 'bg-yellow-400 hover:bg-yellow-500 text-purple-900 shadow-xl'
              }`}
            >
              Evet, İstiyorum
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstDrawModal;
