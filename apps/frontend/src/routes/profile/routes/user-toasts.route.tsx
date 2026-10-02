import { ToastsList } from '@/components/toasts-list';
import { RootState } from '@/store';
import { useGetUserToastsQuery } from '@/store/api/toast.api';
import { User } from '@/types';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const TITLES = {
  pending: {
    other: 'השתיות שטרם בוצעו',
    self: 'השתיות שטרם ביצעתי',
  },
  done: {
    other: 'השתיות שבוצעו',
    self: 'השתיות שביצעתי',
  },
};

const EMPTY_MESSAGES = {
  pending: {
    other:
      'המשתמש הזה סידר את כל השתיות שלו! (אלא אם כן ידוע לך אחרת ואם כן יש לזה את העונשים הקבועים בחוק)',
    selfAdmin:
      'אין לך שתיות פתוחות כרגע, וגם אם יש לך חובות כלשהן אי אפשר לגעת בך כי אתה אדמין, אבל בחייאת המדור משווע לשתיות תוסיף משהו',
    self: 'אין לך שתיות פתוחות כרגע, אבל תיזהר מהאדמין אם יש לך חובות כלשהן',
  },
  done: {
    other: 'המשתמש הזה עדיין לא עשה שתיות. שקול להפוך אותו לפרסונה נון גרטה',
    self: 'תוסיף שתיות דחוף מה זו השטות הזו',
  },
};

export const UserToasts = () => {
  const { userId: paramUserId } = useParams<{ userId: User['id'] }>();
  const currentUser = useSelector(({ auth }: RootState) => auth.decodedToken);
  const {
    data: userToasts,
    isLoading,
    error,
  } = useGetUserToastsQuery(paramUserId ?? currentUser?.id ?? '');

  return (
    !error && (
      <div
        style={{ direction: 'rtl' }}
        className="md:h-screen flex justify-evenly items-center md:flex-row flex-col"
      >
        <div className="md:w-[45%] md:h-[85%] w-full flex justify-center items-start pt-10 md:pt-0 h-[50rem]">
          <ToastsList
            toasts={userToasts?.filter((toast) => !toast.isDone) ?? []}
            isLoading={isLoading}
            showAddButton
            title={paramUserId ? TITLES.pending.other : TITLES.pending.self}
            emptyMessage={
              paramUserId
                ? EMPTY_MESSAGES.pending.other
                : currentUser?.isAdmin
                ? EMPTY_MESSAGES.pending.selfAdmin
                : EMPTY_MESSAGES.pending.self
            }
          />
        </div>
        <div className="md:w-[45%] md:h-[85%] w-full flex justify-center items-start pt-10 md:pt-0 h-[50rem]">
          <ToastsList
            toasts={userToasts?.filter((toast) => toast.isDone) ?? []}
            isLoading={isLoading}
            title={paramUserId ? TITLES.done.other : TITLES.done.self}
            emptyMessage={
              paramUserId ? EMPTY_MESSAGES.done.other : EMPTY_MESSAGES.done.self
            }
          />
        </div>
      </div>
    )
  );
};
