import React from 'react';
import { User as UserIcon } from 'lucide-react';
import { User } from '@/types';
import { FormData } from '../types';

interface Props {
  userData: User;
  isEditing: boolean;
  canEditUsername: boolean;
  formData: FormData;
  handleInputChange: <FormFieldKey extends keyof FormData>(
    field: FormFieldKey,
    value: FormData[FormFieldKey]
  ) => void;
}

export const BasicInfoSection: React.FC<Props> = ({
  userData,
  isEditing,
  canEditUsername,
  formData,
  handleInputChange,
}) => (
  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
      <UserIcon className="w-5 h-5" />
      פרטים בסיסיים
    </h2>
    <div className="space-y-4">
      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">
          שם משתמש
        </label>
        {isEditing && canEditUsername ? (
          <input
            type="text"
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="הכנס שם משתמש"
          />
        ) : (
          <div className="bg-white/10 rounded-lg px-4 py-3 text-white">
            {userData.username}
          </div>
        )}
      </div>
      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">
          סטטוס
        </label>
        <div className="bg-white/10 rounded-lg px-4 py-3 text-white/60 text-sm">
          {userData.description || 'ללא סטטוס'}
        </div>
      </div>
    </div>
  </div>
);
