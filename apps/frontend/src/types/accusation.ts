import { ToastData } from './toast-data';
import { User } from './user';

export type AccusationData = {
  id: string;
  reporter: User;
  reporterId?: User['id'];
  accusedUser: User;
  accusedUserId?: User['id'];
  reason?: string;
  crimeToast?: ToastData;
  crimeToastId?: ToastData['id'];
  updatedAt: Date;
};
