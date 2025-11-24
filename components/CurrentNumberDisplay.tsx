
import React from 'react';
import { CheckIcon } from './icons';
import SoundControl from './SoundControl';
import { DrawSoundName } from '../hooks/useSoundManager';

type CurrentNumberDisplayProps = {
  currentNumber: number | null;
  isDrawing: boolean;
  isAnimating: boolean;
  drawnNumbers: number[];
  isAutoDrawEnabled: boolean;
  soundEnabled: boolean;
  numberDrawSound: DrawSoundName;
  onDraw: () => void;
  onToggleAutoDraw: () => void;
  onToggleSound: () => void;
  onNumberDrawSoundChange: (sound: DrawSoundName) => void;
  firstCinkoClaimed: boolean;
  secondCinkoClaimed: boolean;
  tombalaClaimed: boolean;
  onClaimFirstCinko: () => void;
  onClaimSecondCinko: () => void;
  onClaimTombala: () => void;
};

const CurrentNumberDisplay: React.FC<CurrentNumberDisplayProps> = ({
  currentNumber,
  isDrawing,
  isAnimating,
  drawnNumbers,
  isAutoDrawEnabled,
  soundEnabled,
  numberDrawSound,
  onDraw,
  onToggleAutoDraw,
  onToggleSound,
  onNumberDrawSoundChange,
  firstCinkoClaimed,
  secondCinkoClaimed,
  tombalaClaimed,
  onClaimFirstCinko,
  onClaimSecondCinko,
  onClaimTombala,
}) => {
  return (
    <div className="w-full md:w-96 flex flex-col gap-3">
      <div className="flex-1 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-4 shadow-2xl border-4 border-yellow-300 relative overflow-hidden flex flex-col justify-center items-center min-h-[180px]">
        <SoundControl
          soundEnabled={soundEnabled}
          onToggleSound={onToggleSound}
          numberDrawSound={numberDrawSound}
          onNumberDrawSoundChange={onNumberDrawSoundChange}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
        <div className="relative text-center w-full flex-1 flex flex-col items-center justify-center">
          <div className="text-white/90 font-bold text-sm mb-2 uppercase">Çekilen Numara</div>
          
          <div className="bg-black/30 rounded-xl p-3 backdrop-blur-sm w-full min-h-[128px] flex items-center justify-center">
              <div
                className={`text-8xl sm:text-9xl font-bold text-white font-mono transition-transform duration-300 ${
                  !isDrawing && currentNumber ? 'scale-110' : 'scale-100'
                }`}
              >
                {currentNumber || '--'}
              </div>
            </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onDraw}
          disabled={isDrawing || drawnNumbers.length >= 90 || isAutoDrawEnabled}
          className={`flex-grow py-5 sm:py-6 rounded-xl font-bold text-xl transition-all duration-300 shadow-xl text-white ${
            isDrawing || drawnNumbers.length >= 90 || isAutoDrawEnabled
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:scale-105 active:scale-95'
          }`}
        >
          {isDrawing ? 'ÇEKİLİYOR...' : drawnNumbers.length >= 90 ? 'OYUN BİTTİ' : isAutoDrawEnabled ? 'OTOMATİK ÇEKİLİYOR' : 'NUMARA ÇEK'}
        </button>
        <button
          onClick={onToggleAutoDraw}
          disabled={drawnNumbers.length >= 90}
          className={`relative w-20 flex-shrink-0 py-5 sm:py-6 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl text-white flex items-center justify-center ${
              drawnNumbers.length >= 90
              ? 'bg-gray-500 cursor-not-allowed'
              : isAutoDrawEnabled
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-white/20 hover:bg-white/30'
          }`}
          aria-label="Otomatik Çekilişi Başlat/Durdur"
        >
          Oto.
          {isAutoDrawEnabled && (
              <span className="absolute top-2 right-2 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-300"></span>
              </span>
          )}
        </button>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
        <div className="text-white/90 font-semibold text-sm mb-2">Ödüller</div>
        <div className="grid grid-cols-3 gap-2">
            <button
                onClick={onClaimFirstCinko}
                disabled={firstCinkoClaimed || drawnNumbers.length < 5}
                className={`w-full py-2 rounded-lg font-bold text-xs transition-all duration-300 shadow-md text-white flex items-center justify-center gap-1.5 ${
                    firstCinkoClaimed 
                        ? 'bg-green-600 cursor-default' 
                        : 'bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
            >
                {firstCinkoClaimed && <CheckIcon size={16} />}
                1. ÇİNKO
            </button>
            <button
                onClick={onClaimSecondCinko}
                disabled={secondCinkoClaimed || drawnNumbers.length < 10}
                className={`w-full py-2 rounded-lg font-bold text-xs transition-all duration-300 shadow-md text-white flex items-center justify-center gap-1.5 ${
                    secondCinkoClaimed 
                        ? 'bg-green-600 cursor-default' 
                        : 'bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
            >
                {secondCinkoClaimed && <CheckIcon size={16} />}
                2. ÇİNKO
            </button>
             <button
                onClick={onClaimTombala}
                disabled={tombalaClaimed || drawnNumbers.length < 15}
                className={`w-full py-2 rounded-lg font-bold text-xs transition-all duration-300 shadow-md text-white flex items-center justify-center gap-1.5 ${
                    tombalaClaimed 
                        ? 'bg-green-600 cursor-default' 
                        : 'bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
            >
                {tombalaClaimed && <CheckIcon size={16} />}
                TOMBALA
            </button>
        </div>
      </div>
      
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
        <div className="text-white/90 font-semibold text-sm mb-2">Son Çekilenler:</div>
        <div className="grid grid-cols-5 gap-2">
          {drawnNumbers.length > 0 ? (
             [...drawnNumbers].slice(-5).reverse().map((num, idx) => (
                <div
                  key={`${num}-${idx}`}
                  className={`aspect-square flex items-center justify-center rounded-lg font-bold text-base ${
                    idx === 0
                      ? 'bg-yellow-400 text-black shadow-lg ring-2 ring-yellow-300'
                      : 'bg-white/20 text-white'
                  }`}
                >
                  {num}
                </div>
              ))
          ) : (
            Array.from({length: 5}).map((_, idx) => (
                 <div key={idx} className="aspect-square flex items-center justify-center rounded-lg bg-white/10"></div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrentNumberDisplay;