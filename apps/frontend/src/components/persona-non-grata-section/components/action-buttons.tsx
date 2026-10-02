import { toast } from 'sonner';
import { getUserDisplayName } from '../utils';

const showMockErrorToast = (message: string) => {
  toast.error(message);
};

export const ActionButtons = ({ username }: { username: string }) => {
  const firstName = getUserDisplayName(username);

  const handleContactSupport = () => {
    showMockErrorToast(`😄 וואו ${firstName} אתה חי בסרט`);
  };

  const handleRetry = () => {
    showMockErrorToast('😝 למה חשבת שיהיה הבדל בניסיון השני יא לוזר');
  };

  return (
    <div className="flex flex-col sm:flex-row justify-center gap-2">
      <button
        onClick={handleContactSupport}
        className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-2 px-4 rounded-full transition-all duration-200 hover:scale-105 shadow-xl border border-gray-400/50 text-sm"
      >
        <span role="img" aria-label="טלפון">
          📞
        </span>
        צור קשר עם התמיכה
      </button>
      <button
        onClick={handleRetry}
        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-2 px-4 rounded-full transition-all duration-200 hover:scale-105 shadow-xl border border-red-400/60 hover:border-red-300 text-sm"
      >
        <span role="img" aria-label="רענון">
          🔄
        </span>
        נסה שוב
      </button>
    </div>
  );
};
