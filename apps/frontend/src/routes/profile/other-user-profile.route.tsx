import { RootState, useGetUserByIdQuery } from '@/store';
import { useParams } from 'react-router-dom';
import { otherUserProfileRoutes } from './router';
import { ProfileLayout } from './components/profile-layout';
import { useSelector } from 'react-redux';
import { NotFoundPage } from '@/components/not-found';

export const OtherUserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const isAdmin = useSelector(
    (state: RootState) => state.auth.decodedToken?.isAdmin
  );
  const { isLoading, error, data } = useGetUserByIdQuery(userId ?? '');

  if (!isAdmin) {
    return <NotFoundPage />;
  }

  return (
    <ProfileLayout
      routes={otherUserProfileRoutes}
      isLoading={isLoading}
      error={error}
      user={data}
      isCurrentUser={false}
    />
  );
};
