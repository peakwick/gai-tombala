
import React from 'react';
import Confetti from '../Confetti';
import { SparklesIcon } from '../icons';

type TombalaWinnerModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const TombalaWinnerModal: React.FC<TombalaWinnerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        @keyframes pop-in {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop-in {
          animation: pop-in 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
      `}</style>
      
      <Confetti />

      <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 rounded-3xl p-6 sm:p-10 max-w-2xl w-full shadow-2xl border-4 border-yellow-300 relative overflow-hidden animate-pop-in">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
        <div className="relative text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
                <SparklesIcon className="text-white" size={40} />
                <h2 className="text-4xl sm:text-6xl font-black text-white text-center uppercase tracking-wider" style={{ textShadow: '0 0 15px rgba(0,0,0,0.5)' }}>
                    TEBRİKLER!
                </h2>
                <SparklesIcon className="text-white" size={40} />
            </div>

            <div className="my-12">
                 <div className="text-7xl sm:text-8xl font-black text-white animate-pulse" style={{ WebkitTextStroke: '3px #a16207', textShadow: '0 0 25px rgba(255,255,255,0.7)' }}>
                    TOMBALA!
                </div>
            </div>
          
          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-white hover:bg-gray-100 text-red-600 font-bold py-4 px-12 rounded-xl text-xl transition-all transform hover:scale-105 shadow-xl"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default TombalaWinnerModal;
