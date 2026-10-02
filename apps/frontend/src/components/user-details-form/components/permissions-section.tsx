import React from 'react';
import { Shield } from 'lucide-react';
import { User } from '@/types';
import { AdminAction } from '../types';
import { StatusBadge } from './status-badge';

interface Props {
  userData: User;
  canEditAdminFields: boolean;
  onAdminAction: (type: AdminAction, nextValue: boolean) => void;
}

export const PermissionsSection: React.FC<Props> = ({
  userData,
  canEditAdminFields,
  onAdminAction,
}) => (
  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
      <Shield className="w-5 h-5" />
      הרשאות ומצב
    </h2>
    <div className="space-y-6">
      <div>
        <label className="block text-white/80 text-sm font-medium mb-3">
          סטטוס מנהל
        </label>
        <div className="flex items-center justify-between gap-3">
          <StatusBadge
            isActive={userData.isAdmin}
            label={userData.isAdmin ? 'מנהל' : 'משתמש רגיל'}
            activeColor="bg-blue-500"
          />
          {canEditAdminFields && (
            <button
              onClick={() =>
                onAdminAction(AdminAction.TOGGLE_ADMIN, !userData.isAdmin)
              }
              className="shrink-0 w-56 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              {userData.isAdmin ? 'הסר מנהל' : 'הפוך למנהל'}
            </button>
          )}
        </div>
      </div>
      <div>
        <label className="block text-white/80 text-sm font-medium mb-3">
          סטטוס פרסונה נון גרטה
        </label>
        <div className="flex items-center justify-between gap-3">
          <StatusBadge
            isActive={userData.isPersonaNonGrata}
            label={
              userData.isPersonaNonGrata ? 'פרסונה נון גרטה' : 'משתמש רגיל'
            }
            activeColor="bg-red-500"
          />
          {canEditAdminFields && (
            <button
              onClick={() =>
                onAdminAction(
                  AdminAction.TOGGLE_PNG,
                  !userData.isPersonaNonGrata
                )
              }
              className="shrink-0 w-56 bg-gradient-to-r from-red-600 to-rose-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              {userData.isPersonaNonGrata
                ? 'שחרר לחופשי'
                : 'הפוך לפרסונה נון גרטה'}
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
);
