import React from 'react';
import { UploadIcon, PrinterIcon, XIcon } from '../icons';

type SettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onShowCardGenerator: () => void;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveLogo: () => void;
  onYearChange: (year: number) => void;
  customLogo: string | null;
  selectedYear: number;
  autoDrawSpeed: number;
  onAutoDrawSpeedChange: (speed: number) => void;
  prizeDrawSound: string;
  onPrizeDrawSoundChange: (sound: string) => void;
  winSound: string;
  onWinSoundChange: (sound: string) => void;
};

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onShowCardGenerator,
  onLogoUpload,
  onRemoveLogo,
  onYearChange,
  customLogo,
  selectedYear,
  autoDrawSpeed,
  onAutoDrawSpeedChange,
  prizeDrawSound,
  onPrizeDrawSoundChange,
  winSound,
  onWinSoundChange,
}) => {
  if (!isOpen) return null;

  const handleShowCardGenerator = () => {
    onShowCardGenerator();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl relative">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Oyun Ayarları</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full transition-colors">
            <XIcon size={24} />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto pr-4 -mr-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-8">
            
            {/* --- SOL SÜTUN --- */}
            <div className="space-y-8">
              {/* Genel Ayarlar */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Genel Ayarlar</h3>
                <div>
                  <label className="text-sm font-semibold text-gray-600 block mb-2">Logo</label>
                  <input type="file" accept="image/*" onChange={onLogoUpload} className="hidden" id="logo-upload-modal" />
                  <label
                    htmlFor="logo-upload-modal"
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <UploadIcon size={20} />
                    {customLogo ? 'Logoyu Değiştir' : 'Logo Yükle'}
                  </label>
                  {customLogo && (
                    <button onClick={onRemoveLogo} className="w-full mt-2 text-sm text-red-600 hover:text-red-700 font-semibold">
                      Logoyu Kaldır
                    </button>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Özel logonuzu yükleyebilirsiniz.</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 block mb-2">Yıl</label>
                  <input
                    type="number"
                    min="2020" max="2050"
                    value={selectedYear}
                    onChange={(e) => onYearChange(parseInt(e.target.value) || new Date().getFullYear() + 1)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white"
                  />
                </div>
              </div>

              {/* Otomatik Çekiliş */}
              <div className="border-t border-gray-200 pt-8 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700">Otomatik Çekiliş</h3>
                  <div>
                    <label htmlFor="auto-draw-speed-modal" className="text-sm font-semibold text-gray-600 block mb-2">Çekiliş Hızı</label>
                      <select
                        id="auto-draw-speed-modal"
                        value={autoDrawSpeed}
                        onChange={(e) => onAutoDrawSpeedChange(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white"
                      >
                        <option value={10000}>Yavaş (10sn)</option>
                        <option value={7000}>Normal (7sn)</option>
                        <option value={4000}>Hızlı (4sn)</option>
                      </select>
                    <p className="text-xs text-gray-500 mt-1">Sayıların otomatik çekilme aralığı.</p>
                  </div>
              </div>
            </div>

            {/* --- SAĞ SÜTUN --- */}
            <div className="space-y-8">
              {/* Ses Ayarları */}
              <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700">Ses Ayarları</h3>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="prize-draw-sound-modal" className="text-sm text-gray-600 block mb-1">Ödül Çekiliş Sesi</label>
                      <select
                        id="prize-draw-sound-modal"
                        value={prizeDrawSound}
                        onChange={(e) => onPrizeDrawSoundChange(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white"
                      >
                        <option value="draw_retro">Retro</option>
                        <option value="draw_blip_classic">Bip Sesi (Klasik)</option>
                        <option value="draw_phone_tone">Telefon Sesi</option>
                        <option value="draw_scifi">Bilim Kurgu</option>
                        <option value="draw_bubble">Baloncuk</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="win-sound-modal" className="text-sm text-gray-600 block mb-1">Kazanma Sesi (Çinko/Tombala)</label>
                      <select
                        id="win-sound-modal"
                        value={winSound}
                        onChange={(e) => onWinSoundChange(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white"
                      >
                        <option value="win_musical">Müzikal</option>
                        <option value="win_fanfare">Fanfare</option>
                      </select>
                    </div>
                  </div>
              </div>

              {/* Tombala Kartları */}
              <div className="border-t border-gray-200 pt-8 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700">Tombala Kartları</h3>
                  <div>
                    <button
                      onClick={handleShowCardGenerator}
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <PrinterIcon size={20} />
                      Kart Oluşturucuya Git
                    </button>
                    <p className="text-xs text-gray-500 mt-1">Yazdırılabilir tombala kartları oluşturun.</p>
                  </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsModal;