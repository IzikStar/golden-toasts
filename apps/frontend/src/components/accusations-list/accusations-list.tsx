import { AccusationData } from '@/types';
import { FC } from 'react';
import { accusationsListStyles } from './styles.consts';
import { AccusationsListSkeleton } from './components';
import { AddAccusationOpener } from './components/add-accusation-opener';
import { Accusation } from '../accusation/accusation';

type Props = {
  accusations: AccusationData[];
  title: string;
  isLoading: boolean;
  showAddButton?: boolean;
};

export const AccusationsList: FC<Props> = ({
  accusations,
  title,
  isLoading,
  showAddButton = false,
}) => {
  return (
    <section className={accusationsListStyles.container}>
      <h1 className={accusationsListStyles.title}>
        {title}
        <span
          className={accusationsListStyles.emojiPulse}
          role="img"
          aria-label="criminal-icon"
        >
          👺
        </span>
      </h1>

      <div
        style={{
          direction: 'ltr',
        }}
        className={accusationsListStyles.listWrapper}
        aria-live="polite"
        aria-relevant="additions"
      >
        {isLoading ? (
          <AccusationsListSkeleton title={title} />
        ) : accusations.length ? (
          accusations.map((accusation) => (
            <Accusation key={accusation.id} accusation={accusation} />
          ))
        ) : (
          <p className={accusationsListStyles.noToastMessage}>
            מדובר בצדיק המדור! אין פשעים להצגה
          </p>
        )}
      </div>
      {showAddButton && (
        <div className="absolute lg:top-4 lg:left-5 md:top-1 md:left-1 top-3 left-3">
          <AddAccusationOpener />
        </div>
      )}
    </section>
  );
};
