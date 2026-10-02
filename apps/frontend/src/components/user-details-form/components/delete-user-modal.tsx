import { RefreshCw, Trash2, X } from 'lucide-react';

export const DeleteUserModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}> = ({ isOpen, onClose, onConfirm, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      dir="rtl"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 max-w-lg max-h-svh w-full mx-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">מחיקת פרופיל</h2>
          <p className="text-white/70 mb-6">
            האם אתה בטוח שברצונך למחוק את הפרופיל שלך?
            <br />
            <span className="text-red-300 font-semibold">
              פעולה זו אינה הפיכה!
            </span>
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex items-center gap-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
            >
              <X className="w-5 h-5" />
              בטל
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Trash2 className="w-5 h-5" />
              )}
              {isLoading ? 'מוחק...' : 'מחק משתמש'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
