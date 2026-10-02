import { RootState, useGetUserByIdQuery } from '@/store';
import { profileRoutes } from './router';
import { useSelector } from 'react-redux';
import { ProfileLayout } from './components/profile-layout';

export const Profile = () => {
  const userId = useSelector((state: RootState) => state.auth.decodedToken?.id);
  const { isLoading, error, data } = useGetUserByIdQuery(userId ?? '');

  return (
    <ProfileLayout
      routes={profileRoutes}
      isLoading={isLoading}
      error={error}
      user={data}
      isCurrentUser
    />
  );
};
