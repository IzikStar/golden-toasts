import { useState, useEffect } from 'react';
import { User } from '@/types';
import { FormData, AdminAction } from '../types';

export const useUserDetailsForm = (userData: User | undefined) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    username: '',
    isAdmin: false,
    isPersonaNonGrata: false,
    newPassword: '',
    newPasswordError: '',
  });
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: AdminAction;
    nextValue: boolean;
  } | null>(null);

  useEffect(() => {
    if (userData) {
      setFormData({
        username: userData.username,
        isAdmin: userData.isAdmin,
        isPersonaNonGrata: userData.isPersonaNonGrata,
        newPassword: '',
        newPasswordError: '',
      });
    }
  }, [userData]);

  const handleInputChange = <FormFieldKey extends keyof FormData>(
    field: FormFieldKey,
    value: FormData[FormFieldKey]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    if (userData) {
      setFormData({
        username: userData.username,
        isAdmin: userData.isAdmin,
        isPersonaNonGrata: userData.isPersonaNonGrata,
        newPassword: '',
        newPasswordError: '',
      });
    }
    setIsEditing(false);
    setShowResetPassword(false);
  };

  const validatePassword = (value: string) => {
    if (!value) {
      return 'סיסמא היא שדה חובה';
    }
    if (value.length < 8) {
      return 'סיסמא חייבת להכיל לפחות 8 תווים';
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/;
    if (!passwordRegex.test(value)) {
      return 'הסיסמא חייבת להכיל לפחות אות אנגלית אחת גדולה, אחת קטנה, וספרה אחת';
    }
    return null;
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    handleInputChange('newPassword', value);
    handleInputChange('newPasswordError', validatePassword(value) || '');
  };

  return {
    isEditing,
    setIsEditing,
    showResetPassword,
    setShowResetPassword,
    formData,
    setFormData,
    handleInputChange,
    loading,
    setLoading,
    confirmOpen,
    setConfirmOpen,
    pendingAction,
    setPendingAction,
    resetForm,
    handlePasswordChange,
  };
};
