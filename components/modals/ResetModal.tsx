
import React from 'react';
import { RotateCcwIcon } from '../icons';

type ResetModalProps = {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const ResetModal: React.FC<ResetModalProps> = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border-4 border-red-500">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-red-100 rounded-full p-4">
            <RotateCcwIcon size={48} className="text-red-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-red-600 text-center mb-3">DİKKAT!</h2>
        <p className="text-gray-700 text-center mb-2 font-semibold">Oyunu sıfırlamak istediğinize emin misiniz?</p>
        <p className="text-gray-600 text-center mb-6 text-sm">
          Tüm çekilen numaralar ve sürpriz kart çekilişleri silinecek. Bu işlem geri alınamaz!
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-lg transition-all"
          >
            İptal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-all"
          >
            Evet, Sıfırla
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetModal;
