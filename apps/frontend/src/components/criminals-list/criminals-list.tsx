import { FC } from 'react';
import { User } from '@/types';
import { UserCard } from '../user';
import { crimeListStyles } from './styles.consts';
import { CriminalsListSkeleton } from './components';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { ErrorDisplay } from '../error-display';

type Props = {
  criminals: User[];
  isLoading?: boolean;
  error?: FetchBaseQueryError | SerializedError;
};

export const CriminalsList: FC<Props> = ({ criminals, isLoading, error }) => {
  const title = 'הפושעים שלנו';
  return (
    <section className={crimeListStyles.container}>
      <h1 className={crimeListStyles.title}>
        {title}
        <span
          role="img"
          aria-label="villain and devil emojis"
          className={crimeListStyles.emojiPulse}
        >
          👺
        </span>
      </h1>

      {isLoading ? (
        <CriminalsListSkeleton title={title} />
      ) : error ? (
        <div className={crimeListStyles.errorWrapper}>
          <ErrorDisplay />
        </div>
      ) : (
        <div
          className={crimeListStyles.listWrapper}
          aria-live="polite"
          aria-relevant="additions"
          style={{ direction: 'ltr' }}
          tabIndex={-1}
        >
          {criminals.length > 0 ? (
            criminals.map((c) => (
              <div
                key={c.id}
                className={crimeListStyles.cardWrapper}
                style={{ direction: 'rtl' }}
              >
                <UserCard
                  user={c}
                  className="bg-transparent ring-0 w-full max-w-full text-white border-none"
                  hoverClassName="hover:ring-error hover:ring-1"
                  navigateTo="accusations"
                />
              </div>
            ))
          ) : (
            <p className="text-center text-red-400">...אין פושעים להצגה כרגע</p>
          )}
        </div>
      )}
    </section>
  );
};
