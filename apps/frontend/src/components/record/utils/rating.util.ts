import { UserWithToastsCount } from '@/types';
import { RatingTypes, UserWithRating } from '../record.types';
import { recordStyles } from '../styles.const';

export const calculateUsersRating = (
  users: UserWithToastsCount[]
): UserWithRating[] => {
  const usersWithRating: UserWithRating[] = [];

  for (const [userIndex, currentUser] of users.entries()) {
    if (!currentUser.toastsCount) {
      usersWithRating[userIndex] = {
        ...currentUser,
        rating: RatingTypes.OTHER_PLACES,
      };
    } else if (+userIndex === 0) {
      usersWithRating[userIndex] = {
        ...currentUser,
        rating: RatingTypes.FIRST_PLACE,
      };
    } else {
      const previousRatedUser = usersWithRating[+userIndex - 1];

      if (
        currentUser.toastsCount === previousRatedUser.toastsCount ||
        previousRatedUser.rating === RatingTypes.OTHER_PLACES
      ) {
        usersWithRating[userIndex] = {
          ...currentUser,
          rating: previousRatedUser.rating,
        };
      } else {
        usersWithRating[userIndex] = {
          ...currentUser,
          rating:
            previousRatedUser.rating &&
            previousRatedUser.rating < RatingTypes.OTHER_PLACES
              ? ((previousRatedUser.rating + 1) as RatingTypes)
              : RatingTypes.OTHER_PLACES,
        };
      }
    }
  }

  return usersWithRating;
};

export const getClassNameFromRating = (rating: RatingTypes): string => {
  switch (rating) {
    case RatingTypes.FIRST_PLACE:
      return recordStyles.firstPlaceBackground;
    case RatingTypes.SECOND_PLACE:
      return recordStyles.secondPlaceBackground;
    case RatingTypes.THIRD_PLACE:
      return recordStyles.thirdPlaceBackground;
    case RatingTypes.OTHER_PLACES:
    default:
      return recordStyles.otherPlacesBackground;
  }
};
