import { User } from './user';

export type UserWithToastsCount = User & {
  toastsCount: number;
};
