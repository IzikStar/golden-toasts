import { FC } from 'react';
import { crimeListStyles } from '../styles.consts';

export const CriminalsListSkeleton: FC<{ title: string }> = ({ title }) => {
  const skeletonItems = Array.from({ length: 5 });

  return (
    <div className={crimeListStyles.skeleton.list}>
      {skeletonItems.map((_, itemIndex) => (
        <div key={itemIndex} className={crimeListStyles.skeleton.item}>
          <div className={crimeListStyles.skeleton.itemHeader} />
        </div>
      ))}
    </div>
  );
};
