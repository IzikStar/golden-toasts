import { InviteData } from '@/types';
import { FC } from 'react';
import { invitesListStyles } from './styles.consts';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { LoadingSpinner } from '../loading-spinner';
import { ErrorDisplay } from '../error-display';
import { Invite } from '../invite/invite';

type Props = {
  title: string;
  icon?: string;
  invites: InviteData[];
  isLoading: boolean;
  error?: FetchBaseQueryError | SerializedError;
};

export const InvitesList: FC<Props> = ({
  invites,
  isLoading,
  error,
  title,
  icon,
}) => {
  const renderInvites = () => {
    return invites.map((invite: InviteData) => (
      <Invite invite={invite} key={invite.id} />
    ));
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return (
        <div className={invitesListStyles.errorWrapper}>
          <ErrorDisplay />
        </div>
      );
    }

    if (invites.length) {
      return renderInvites();
    }

    return (
      <p className={invitesListStyles.noToastMessage}>{'אין הזמנות להצגה'}</p>
    );
  };

  return (
    <section className={invitesListStyles.container}>
      <h1 className={invitesListStyles.title}>
        {title}
        <span
          className={invitesListStyles.emojiPulse}
          role="img"
          aria-label="toast-icon"
        >
          {icon ? icon : invites.length ? '📬' : '📭'}
        </span>
      </h1>
      <div
        style={{ direction: 'ltr' }}
        className={invitesListStyles.listWrapper}
        aria-live="polite"
        aria-relevant="additions"
      >
        {renderContent()}
      </div>
    </section>
  );
};
