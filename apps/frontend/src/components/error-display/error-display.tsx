import React from 'react';
import { AlertCircle } from 'lucide-react';

export const ErrorDisplay: React.FC = () => (
  <div className="h-[80%] w-full max-h-[50vh] max-w-[50vw] mx-auto" dir="rtl">
    <div className="mx-auto h-full w-full overflow-auto scrollbar-theme [scrollbar-gutter:stable_both-edges] bg-white/10 backdrop-blur-lg rounded-md shadow-2xl border border-white/20">
      <div className="min-h-full flex items-center justify-center gap-2 flex-col text-center p-6">
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4 flex-shrink-0" />
        <h2 className="text-2xl font-bold text-white">שגיאה בטעינת הנתונים</h2>
        <p className="text-white/70">לא ניתן לטעון את הפרטים</p>
      </div>
    </div>
  </div>
);
