import { FC } from 'react';
import { accusationsListStyles } from '../styles.consts';

export const AccusationsListSkeleton: FC<{ title: string }> = ({ title }) => {
  const skeletonItems = Array.from({ length: 2 });

  return (
    <div className={accusationsListStyles.skeleton.list} style={{ direction: 'rtl' }}>
      {skeletonItems.map((_, itemIndex) => (
        <div key={itemIndex} className={accusationsListStyles.skeleton.item}>
          <div className={accusationsListStyles.skeleton.itemHeader} />
          <div className={accusationsListStyles.skeleton.itemBody} />
          <div className={accusationsListStyles.skeleton.itemBody} />
          <div className={accusationsListStyles.skeleton.itemBody} />
        </div>
      ))}
    </div>
  );
};
