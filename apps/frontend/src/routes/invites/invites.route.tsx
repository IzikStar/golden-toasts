import { RootState, useGetUserByIdQuery } from '@/store';
import { useSelector } from 'react-redux';
import { ErrorDisplay } from '@/components/error-display';
import { LoadingSpinner } from '@/components/loading-spinner';
import {
  useGetReceiverPendingInvitesQuery,
  useGetSenderInvitesQuery,
} from '@/store/api/invites.api';
import { InvitesList } from '@/components/invites-list';

export const Invites = () => {
  const authToken = useSelector((state: RootState) => state.auth.decodedToken);
  const id = authToken?.id ?? null;
  const { isLoading, error, data: user } = useGetUserByIdQuery(id ?? '');

  const {
    data: receiverPendingInvites,
    isLoading: isReceiverPendingInvitesLoading,
    error: receiverPendingInvitesError,
  } = useGetReceiverPendingInvitesQuery(id ?? '', {
    skip: !id,
  });
  const {
    data: senderInvites,
    isLoading: isSenderInvitesLoading,
    error: senderInvitesError,
  } = useGetSenderInvitesQuery(id ?? '', {
    skip: !id,
  });

  if (isLoading) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <ErrorDisplay />
      </div>
    );
  }

  return (
    <div
      style={{ direction: 'rtl' }}
      className="md:h-screen flex justify-evenly items-center md:flex-row flex-col"
    >
      <div className="md:w-[45%] md:h-[85%] w-full flex justify-center items-start pt-10 md:pt-0 h-[50rem]">
        <InvitesList
          title="הזמנות שקיבלתי"
          invites={receiverPendingInvites ?? []}
          isLoading={isReceiverPendingInvitesLoading}
          error={receiverPendingInvitesError}
        />
      </div>
      <div className="md:w-[45%] md:h-[85%] w-full flex justify-center items-start pt-10 md:pt-0 h-[50rem]">
        <InvitesList
          title="הזמנות ששלחתי"
          invites={senderInvites ?? []}
          isLoading={isSenderInvitesLoading}
          error={senderInvitesError}
          icon='📨'
        />
      </div>
    </div>
  );
};
