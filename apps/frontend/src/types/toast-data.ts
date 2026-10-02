import { InviteData, User } from './';

export type ToastData = {
  id: string;
  title: string;
  reason: string;
  location: ToastLocation;
  customLocation?: string | null;
  creator: User;
  userId?: string;
  isDone?: boolean;
  dueDate: Date;
  foods: string[];
  drinks: string[];
  invites?: InviteData[];
};

export enum ToastLocation {
  IN_SECTION = 'במדור',
  ON_BALCONY = 'במרפסת',
  OUTSIDE = 'בחוץ',
  IN_MEETING_ROOM = 'בחד"ן',
  OTHER_LOCATION = 'מקום אחר',
}
