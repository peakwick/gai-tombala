import React from 'react';
import { UploadIcon, PrinterIcon, XIcon, SettingsIcon, Volume2Icon, ClockIcon } from '../icons';

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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 flex justify-between items-center shrink-0">
           <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-lg">
                <SettingsIcon size={24} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-wide">Oyun Ayarları</h2>
           </div>
           <button onClick={onClose} className="text-white/50 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all">
            <XIcon size={20} />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="overflow-y-auto p-6 sm:p-8 custom-scrollbar">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Column */}
              <div className="space-y-6">
                 
                 {/* Section: General */}
                 <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <h3 className="text-gray-900 font-bold text-lg mb-4 flex items-center gap-2">
                        <SettingsIcon size={18} className="text-red-500" /> 
                        Genel Görünüm
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Logo</label>
                             <div className="flex items-center gap-4">
                                {customLogo && (
                                    <div className="h-14 w-14 bg-white rounded-lg border border-gray-200 flex items-center justify-center p-1 shrink-0">
                                        <img src={customLogo} alt="Logo" className="max-h-full max-w-full object-contain" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <input type="file" accept="image/*" onChange={onLogoUpload} className="hidden" id="logo-upload-modal" />
                                    <label
                                        htmlFor="logo-upload-modal"
                                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors w-full shadow-sm"
                                    >
                                        <UploadIcon size={16} />
                                        {customLogo ? 'Logoyu Değiştir' : 'Logo Yükle'}
                                    </label>
                                </div>
                                {customLogo && (
                                     <button onClick={onRemoveLogo} className="text-red-500 hover:text-red-700 p-2 bg-red-50 hover:bg-red-100 rounded-lg transition-colors" title="Logoyu Kaldır">
                                        <XIcon size={20} />
                                     </button>
                                )}
                             </div>
                        </div>

                        <div className="sm:col-span-2">
                             <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Yıl Başlığı</label>
                             <input
                                type="number"
                                min="2020" max="2050"
                                value={selectedYear}
                                onChange={(e) => onYearChange(parseInt(e.target.value) || new Date().getFullYear() + 1)}
                                className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all font-semibold text-gray-900"
                              />
                        </div>
                    </div>
                 </div>

                 {/* Section: Auto Draw */}
                 <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                     <h3 className="text-gray-900 font-bold text-lg mb-4 flex items-center gap-2">
                         <ClockIcon size={18} className="text-blue-500" />
                         Otomatik Çekiliş
                     </h3>
                     <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Çekiliş Hızı</label>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { val: 10000, label: 'Yavaş (10s)' },
                                { val: 7000, label: 'Normal (7s)' },
                                { val: 4000, label: 'Hızlı (4s)' }
                            ].map((opt) => (
                                <button
                                    key={opt.val}
                                    onClick={() => onAutoDrawSpeedChange(opt.val)}
                                    className={`py-2 px-2 rounded-lg text-sm font-semibold border transition-all ${
                                        autoDrawSpeed === opt.val 
                                        ? 'bg-blue-500 border-blue-500 text-white shadow-md' 
                                        : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Sayıların otomatik çekilme sıklığını belirler.</p>
                     </div>
                 </div>

              </div>
              
              {/* Right Column */}
              <div className="space-y-6">
                
                {/* Section: Sound */}
                 <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                     <h3 className="text-gray-900 font-bold text-lg mb-4 flex items-center gap-2">
                         <Volume2Icon size={18} className="text-green-500" />
                         Ses Efektleri
                     </h3>
                     
                     <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Ödül Çekiliş Sesi</label>
                            <select
                                value={prizeDrawSound}
                                onChange={(e) => onPrizeDrawSoundChange(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none text-gray-900"
                            >
                                <option value="draw_retro">Retro</option>
                                <option value="draw_blip_classic">Bip Sesi (Klasik)</option>
                                <option value="draw_phone_tone">Telefon Sesi</option>
                                <option value="draw_scifi">Bilim Kurgu</option>
                                <option value="draw_bubble">Baloncuk</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Kazanma Sesi (Çinko/Tombala)</label>
                            <select
                                value={winSound}
                                onChange={(e) => onWinSoundChange(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none text-gray-900"
                            >
                                <option value="win_musical">Müzikal</option>
                                <option value="win_fanfare">Fanfare</option>
                            </select>
                        </div>
                     </div>
                 </div>

                 {/* Section: Cards */}
                 <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                     <h3 className="text-gray-900 font-bold text-lg mb-4 flex items-center gap-2">
                         <PrinterIcon size={18} className="text-purple-500" />
                         Tombala Kartları
                     </h3>
                     <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-gray-600 leading-relaxed">
                           Oyun için özel tasarlanmış, yazdırılabilir PDF formatında tombala kartları oluşturabilirsiniz.
                        </div>
                        <button
                            onClick={handleShowCardGenerator}
                            className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-lg font-bold transition-all shadow-md flex items-center justify-center gap-2 whitespace-nowrap"
                        >
                            <PrinterIcon size={18} />
                            Kart Oluştur
                        </button>
                     </div>
                 </div>

              </div>

           </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end shrink-0">
            <button 
                onClick={onClose}
                className="px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-all shadow-lg flex items-center gap-2"
            >
                <XIcon size={18} />
                Kapat
            </button>
        </div>

      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default SettingsModal;