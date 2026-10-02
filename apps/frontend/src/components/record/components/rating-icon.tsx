import React from 'react';
import { Crown, Star } from 'lucide-react';
import { RatingTypes } from '../record.types';
import { recordStyles } from '../styles.const';
type Props = {
  rating: RatingTypes;
};

export const RatingIcon: React.FC<Props> = ({ rating }) => {
  switch (rating) {
    case RatingTypes.FIRST_PLACE:
      return (
        <div
          className={`${recordStyles.ratingIconBase} ${recordStyles.firstPlaceIcon}`}
        >
          <Crown
            size={20}
            className={`${recordStyles.ratingIconContent} ${recordStyles.firstPlaceIconContent}`}
          />
          <div
            className={`${recordStyles.ratingBadge} ${recordStyles.firstPlaceBadge}`}
          >
            <span className={recordStyles.ratingBadgeText}>1</span>
          </div>
        </div>
      );
    case RatingTypes.SECOND_PLACE:
      return (
        <div
          className={`${recordStyles.ratingIconBase} ${recordStyles.secondPlaceIcon}`}
        >
          <Star
            size={20}
            className={`${recordStyles.ratingIconContent} ${recordStyles.secondPlaceIconContent}`}
          />
          <div
            className={`${recordStyles.ratingBadge} ${recordStyles.secondPlaceBadge}`}
          >
            <span className={recordStyles.ratingBadgeText}>2</span>
          </div>
        </div>
      );
    case RatingTypes.THIRD_PLACE:
      return (
        <div
          className={`${recordStyles.ratingIconBase} ${recordStyles.thirdPlaceIcon}`}
        >
          <Star
            size={20}
            className={`${recordStyles.ratingIconContent} ${recordStyles.thirdPlaceIconContent}`}
          />
          <div
            className={`${recordStyles.ratingBadge} ${recordStyles.thirdPlaceBadge}`}
          >
            <span className={recordStyles.ratingBadgeText}>3</span>
          </div>
        </div>
      );
    default:
      return null;
  }
};
