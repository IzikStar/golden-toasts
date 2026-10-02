import React from 'react';
import { RefreshCw } from 'lucide-react';
import { FormData } from '../types';
import { Input } from '@/components/input';

interface Props {
  canResetPassword: boolean;
  showResetPassword: boolean;
  setShowResetPassword: (show: boolean) => void;
  formData: FormData;
  handleInputChange: <FormFieldKey extends keyof FormData>(
    field: FormFieldKey,
    value: FormData[FormFieldKey]
  ) => void;
  isEditing: boolean;
}

export const PasswordResetSection: React.FC<Props> = ({
  canResetPassword,
  showResetPassword,
  setShowResetPassword,
  formData,
  handleInputChange,
  isEditing,
}) => {
  if (!canResetPassword) {
    return null;
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <RefreshCw className="w-5 h-5" />
        איפוס סיסמה
      </h2>
      {!showResetPassword ? (
        <button
          onClick={() => setShowResetPassword(true)}
          disabled={!isEditing}
          className={`${
            !isEditing && 'opacity-50 cursor-not-allowed'
          } w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-3 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200`}
        >
          איפוס סיסמה
        </button>
      ) : (
        <div className="space-y-4">
          <div>
            <Input
              type="password"
              label="סיסמא חדשה"
              placeholder="הכנס סיסמה חדשה"
              value={formData.newPassword}
              onChange={(e) => handleInputChange('newPassword', e.target.value)}
              error={formData.newPasswordError}
            />
          </div>
        </div>
      )}
    </div>
  );
};
