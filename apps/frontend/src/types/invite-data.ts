import { ToastData } from './toast-data';
import { User } from './user';

export type InviteData = {
  id: string;
  invitee: User;
  inviteeId: string;
  toast: ToastData;
  toastId: string;
  isConfirmed: boolean | null;
};
