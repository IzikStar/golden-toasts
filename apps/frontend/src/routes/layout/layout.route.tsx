import { FC, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { Outlet } from 'react-router-dom';
import { Welcome } from '@/components/welcome';
import { Toaster } from '@/components/ui/sonner';
import { routes } from '@/router';
import { RootState } from '@/store';
import { useDispatch, useSelector } from 'react-redux';
import { initializeDecodedToken } from '@/store/slices/auth-slice';

export const Layout: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeDecodedToken());
  }, [dispatch]);

  if (!useSelector(({ auth }: RootState) => auth.token)) {
    return (
      <div dir="ltr" className="h-screen overflow-y-auto scrollbar-theme">
          <Welcome />
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="w-full">
        <Navbar routes={routes} />
      </div>
      <div
        style={{ direction: 'ltr' }}
        className="animate-wave-gradient lg:min-h-[88%] h-[94%] lg:overflow-clip overflow-y-auto scrollbar-theme"
      >
        <div style={{ direction: 'rtl' }} className="h-full w-full">
          <Outlet />
        </div>
        <Toaster position="top-right" richColors theme='dark' dir="rtl" />
      </div>
    </div>
  );
};
