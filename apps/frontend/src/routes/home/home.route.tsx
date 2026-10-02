import { useSelector } from 'react-redux';
import { ToastsList } from '@/components/toasts-list';
import { CriminalsList } from '@/components/criminals-list';
import { useGetFutureToastsQuery } from '@/store/api/toast.api';
import { useGetCriminalsQuery } from '@/store';
import { useEffect, useState } from 'react';
import { ToastData, User } from '@/types';
import { toast } from 'sonner';
import type { RootState } from '@/store';
import { Record } from '@/components/record';

export const Home = () => {
  const decodedTokenId = useSelector(
    (state: RootState) => state.auth.decodedToken?.id ?? ''
  );

  const {
    data: futureToastsData,
    isLoading: isToastsLoading,
    error: toastsError,
  } = useGetFutureToastsQuery(decodedTokenId, { skip: !decodedTokenId });

  const {
    data: criminalsData,
    isLoading: isCriminalsLoading,
    error: criminalsError,
  } = useGetCriminalsQuery();

  const [futureToasts, setFutureToasts] = useState<ToastData[]>([]);
  const [criminals, setCriminals] = useState<User[]>([]);

  useEffect(() => {
    setFutureToasts(futureToastsData ?? []);
  }, [futureToastsData]);

  useEffect(() => {
    if (toastsError) {
      toast.error('אופס! לא הצלחנו לקבל את רשימת השתיות');
    }
  }, [toastsError]);

  useEffect(() => {
    setCriminals(criminalsData ?? []);
  }, [criminalsData]);

  useEffect(() => {
    if (criminalsError) {
      toast.error('אופס! לא הצלחנו לקבל את רשימת הפושעים');
    }
  }, [criminalsError]);

  return (
    <div className="flex justify-evenly items-center w-full lg:h-screen overflow-y-auto gap-4 lg:overflow-hidden flex-col lg:flex-row lg:gap-0">
      <section className="lg:w-[35%] w-full flex justify-center items-start h-[85%] pt-10 lg:pt-0">
        <ToastsList
          title="שתיות קרובות"
          error={toastsError}
          toasts={futureToasts}
          isLoading={isToastsLoading}
          emptyMessage='לא הוזמנת עדיין לאף שתייה, או שאתה חדש... (ואם כן ש"צ!)'
          showAddButton
        />
      </section>
      <section className="flex w-full lg:w-[25%] justify-center items-start h-[85%]">
        <Record />
      </section>
      <section className="flex lg:w-[20%] w-full h-[85%] justify-center items-start pb-10 lg:pb-0">
        <CriminalsList
          criminals={criminals}
          isLoading={isCriminalsLoading}
          error={criminalsError}
        />
      </section>
    </div>
  );
};
