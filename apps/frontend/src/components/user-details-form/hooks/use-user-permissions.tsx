import { RootState } from '@/store';
import { User } from '@/types';
import { useMemo } from 'react';

type UserPermissions = {
  editUsername: boolean;
  resetPassword: boolean;
  deleteUser: boolean;
  editAdminFields: boolean;
};

export const useUserPermissions = (
  currentUser: RootState['auth']['decodedToken'] | null,
  userData: User | undefined
): UserPermissions => {
  return useMemo(() => {
    const isViewingOwnProfile =
      !!currentUser?.id && userData?.id === currentUser.id;
    const isCurrentUserAdmin = !!currentUser?.isAdmin;

    return {
      editUsername: isViewingOwnProfile,
      resetPassword: isViewingOwnProfile,
      deleteUser: isViewingOwnProfile,
      editAdminFields: isCurrentUserAdmin && !isViewingOwnProfile,
    };
  }, [currentUser?.id, currentUser?.isAdmin, userData?.id]);
};
