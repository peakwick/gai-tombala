import React from 'react';
import { SettingsIcon, RotateCcwIcon } from './icons';

type HeaderProps = {
  customLogo: string | null;
  selectedYear: number;
  drawnNumbersCount: number;
  onReset: () => void;
  onShowSettings: () => void;
};

const Header: React.FC<HeaderProps> = ({
  customLogo,
  selectedYear,
  drawnNumbersCount,
  onReset,
  onShowSettings,
}) => {
  return (
    <header className="flex items-center justify-between mb-3 flex-wrap gap-y-2">
      <div className="flex items-center gap-3">
        {customLogo ? (
          <div className="bg-white rounded-lg p-1 shadow-lg h-16 w-24 flex items-center justify-center overflow-hidden">
            <img src={customLogo} alt="Logo" className="max-h-full max-w-full object-contain" />
          </div>
        ) : (
          <div className="bg-white rounded-lg px-4 py-2 shadow-lg">
            <div className="text-xl font-bold text-red-600">RICOH</div>
            <div className="text-xs text-gray-600 italic">imagine. change.</div>
          </div>
        )}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">{selectedYear} Yılbaşı Tombalası</h1>
          <div className="text-white/80 text-sm">{drawnNumbersCount}/90 Çekildi</div>
        </div>
      </div>

      <div className="flex gap-2 items-center">
        <button
          onClick={onShowSettings}
          className="bg-white/20 hover:bg-white/30 text-white px-4 py-3 rounded-lg transition-all flex items-center gap-2"
        >
          <SettingsIcon size={20} />
          <span className="hidden sm:inline">Ayarlar</span>
        </button>
        <button
          onClick={onReset}
          className="bg-white/20 hover:bg-white/30 text-white px-4 py-3 rounded-lg transition-all flex items-center gap-2"
        >
          <RotateCcwIcon />
          <span className="hidden sm:inline">Yeni Oyun</span>
        </button>
      </div>
    </header>
  );
};

export default Header;