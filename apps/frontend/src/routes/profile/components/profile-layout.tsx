import { ErrorDisplay } from '@/components/error-display';
import { LoadingSpinner } from '@/components/loading-spinner';
import { Sidebar } from '@/components/sidebar';
import { Route, User } from '@/types';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { FC } from 'react';
import { Outlet } from 'react-router-dom';

type Props = {
  routes: Route[];
  isLoading: boolean;
  error?: FetchBaseQueryError | SerializedError;
  user?: User;
  isCurrentUser: boolean;
};

export const ProfileLayout: FC<Props> = ({
  routes,
  isLoading,
  error,
  user,
  isCurrentUser,
}) => {
  if (isLoading) {
    return (
      <div className='h-full w-full flex justify-center items-center'>
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className='h-full w-full flex justify-center items-center'>
        <ErrorDisplay />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex overflow-hidden">
      <div className="w-[25%] lg:w-[22%] overflow-hidden">
        <Sidebar routes={routes} user={user} isCurrentUser={isCurrentUser} />
      </div>
      <div
        style={{ direction: 'ltr' }}
        className="bg-gradient-wave animate-wave-gradient w-full h-full md:h-screen overflow-y-auto gap-4 flex-col md:flex-row md:gap-0 scrollbar-theme"
      >
        <Outlet />
      </div>
    </div>
  );
};
