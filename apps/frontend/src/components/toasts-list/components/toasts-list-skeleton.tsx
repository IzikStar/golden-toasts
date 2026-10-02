import { FC } from 'react';
import { toastListStyles } from '../styles.consts';

export const ToastsListSkeleton: FC<{ title: string }> = ({ title }) => {
  const skeletonItems = Array.from({ length: 5 });

  return (
    <div className={toastListStyles.skeleton.list} style={{ direction: 'rtl' }}>
      {skeletonItems.map((_, itemIndex) => (
        <div key={itemIndex} className={toastListStyles.skeleton.item}>
          <div className={toastListStyles.skeleton.itemHeader} />
          <div className={toastListStyles.skeleton.itemBody} />
          <div className={toastListStyles.skeleton.itemBody} />
          <div className={toastListStyles.skeleton.itemBody} />
        </div>
      ))}
    </div>
  );
};
