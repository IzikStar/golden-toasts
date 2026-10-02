import React from 'react';
import { RefreshCw } from 'lucide-react';

export const LoadingSpinner: React.FC = () => (
  <div
    className="flex items-center justify-center"
    dir="rtl"
  >
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
      <div className="flex items-center gap-4">
        <RefreshCw className="w-8 h-8 text-white animate-spin" />
        <span className="text-white text-lg">טוען פרטים...</span>
      </div>
    </div>
  </div>
);
