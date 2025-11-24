import React, { useState, useRef, useEffect } from 'react';
import { Volume2Icon, VolumeXIcon, ChevronDownIcon, CheckIcon } from './icons';
import { DrawSoundName } from '../hooks/useSoundManager';

type SoundControlProps = {
  soundEnabled: boolean;
  onToggleSound: () => void;
  numberDrawSound: DrawSoundName;
  onNumberDrawSoundChange: (sound: DrawSoundName) => void;
};

const soundOptions: { value: DrawSoundName; label: string }[] = [
    { value: 'draw_blip_classic', label: 'Bip Sesi (Klasik)' },
    { value: 'draw_phone_tone', label: 'Telefon Sesi' },
    { value: 'draw_retro', label: 'Retro' },
    { value: 'draw_scifi', label: 'Bilim Kurgu' },
    { value: 'draw_bubble', label: 'Baloncuk' },
];

const SoundControl: React.FC<SoundControlProps> = ({
  soundEnabled,
  onToggleSound,
  numberDrawSound,
  onNumberDrawSoundChange,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSoundSelect = (sound: DrawSoundName) => {
    onNumberDrawSoundChange(sound);
    setIsDropdownOpen(false);
  };

  return (
    <div ref={wrapperRef} className="absolute top-3 right-3 z-20 flex items-center bg-black/20 rounded-full">
      <button
        onClick={onToggleSound}
        className="text-white p-2 rounded-l-full hover:bg-black/20 transition-colors"
        aria-label={soundEnabled ? "Sesi Kapat" : "Sesi Aç"}
      >
        {soundEnabled ? <Volume2Icon size={22} /> : <VolumeXIcon size={22} />}
      </button>
      <div className="w-px h-6 bg-white/20"></div>
      <button
        onClick={() => setIsDropdownOpen(prev => !prev)}
        className="text-white p-2 rounded-r-full hover:bg-black/20 transition-colors"
        aria-label="Ses efektini seç"
        aria-haspopup="true"
        aria-expanded={isDropdownOpen}
      >
        <ChevronDownIcon size={22} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {isDropdownOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 origin-top-right">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <div className="px-3 py-2 text-xs font-bold text-gray-500 uppercase">Çekiliş Sesi</div>
            {soundOptions.map(option => (
              <button
                key={option.value}
                onClick={() => handleSoundSelect(option.value)}
                className={`w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between ${numberDrawSound === option.value ? 'font-bold text-red-600' : ''}`}
                role="menuitem"
              >
                {option.label}
                {numberDrawSound === option.value && (
                  <CheckIcon size={20} className="text-red-500" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SoundControl;
