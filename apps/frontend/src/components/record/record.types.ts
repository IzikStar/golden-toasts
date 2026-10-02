import { UserWithToastsCount } from '@/types';

export enum RatingTypes {
  FIRST_PLACE = 1,
  SECOND_PLACE = 2,
  THIRD_PLACE = 3,
  OTHER_PLACES = 4,
}

export type UserWithRating = UserWithToastsCount & { rating: RatingTypes };
