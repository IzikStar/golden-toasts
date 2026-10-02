import { RootState, useGetAllUsersQuery, useGetUserByIdQuery } from '@/store';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorDisplay } from '@/components/error-display';
import { LoadingSpinner } from '@/components/loading-spinner';
import { NotFoundPage } from '@/components/not-found';
import { ToastsList, ToastListData } from '@/components/toasts-list';
import {
  useGetAllToastsQuery,
  useGetPendingToastsQuery,
} from '@/store/api/toast.api';
import { useEffect, useState } from 'react';
import { AdminSplash } from './components';
import { UsersList } from '@/components/users-list';
import { completeAdminGreetings } from '@/store/slices/auth-slice';

export const Admin = () => {
  const authToken = useSelector(({ auth }: RootState) => auth.decodedToken);
  const dispatch = useDispatch();
  const id = authToken?.id ?? null;
  const isAdmin = authToken?.isAdmin ?? false;
  const shouldShowAdminGreetings =
    !useSelector(({ auth }: RootState) => auth.adminGreetingsCompleted) &&
    isAdmin;
  const { isLoading, error, data: user } = useGetUserByIdQuery(id ?? '');
  const {
    data: pendingToasts,
    isLoading: isPendingToastsLoading,
    error: pendingToastsError,
  } = useGetPendingToastsQuery();

  const {
    data: allToasts,
    isLoading: isAllToastsLoading,
    error: allToastsError,
  } = useGetAllToastsQuery();

  const {
    data: allUsers,
    isLoading: isAllUsersLoading,
    error: allUsersError,
  } = useGetAllUsersQuery();

  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (shouldShowAdminGreetings) {
      setShowSplash(true);
      const timer = setTimeout(() => {
        setShowSplash(false);
        dispatch(completeAdminGreetings());
      }, 11000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [dispatch, shouldShowAdminGreetings]);

  if (!isAdmin) {
    return <NotFoundPage />;
  }

  if (showSplash) {
    return (
      <AdminSplash
        skip={() => {
          setShowSplash(false);
          dispatch(completeAdminGreetings());
        }}
      />
    );
  }

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

  const toastLists: ToastListData[] = [
    {
      toasts: pendingToasts ?? [],
      title: 'שתיות שממתינות לאישור',
      isLoading: isPendingToastsLoading,
      error: pendingToastsError,
      emptyMessage: 'טיפלת כבר בכל השתיות יא מלך',
    },
    {
      toasts: allToasts ?? [],
      title: 'כל השתיות',
      isLoading: isAllToastsLoading,
      error: allToastsError,
      emptyMessage:
        'אין שום שתיות במערכת. או שמישהו איפס את הדאטא בייס או שהמדור הזה ממש לוזר',
    },
  ];

  return (
    <div
      style={{ direction: 'rtl' }}
      className="md:h-screen flex justify-evenly items-center md:flex-row flex-col"
    >
      <div className="md:w-[45%] md:h-[85%] w-full flex justify-center items-start pt-10 md:pt-0 h-[50rem]">
        <ToastsList lists={toastLists} />
      </div>
      <div className="md:w-[45%] md:h-[85%] w-full flex justify-center items-start pt-10 md:pt-0 h-[50rem]">
        <UsersList
          users={allUsers ?? []}
          isLoading={isAllUsersLoading}
          error={allUsersError}
        />
      </div>
    </div>
  );
};
