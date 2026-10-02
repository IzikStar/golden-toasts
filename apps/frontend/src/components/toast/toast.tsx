import { FC, useState } from 'react';
import { ToastData, ToastLocation } from '@/types';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserCard } from '../user';
import { DeleteToastModal, EditToastOpener, TagsArray } from './components';
import { Button } from '../ui/button';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';
import {
  useEditToastMutation,
  useGetPendingToastsQuery,
} from '@/store/api/toast.api';
import { useCreateAccusationMutation } from '@/store/api/accusation.api';
import { toast as toaster } from 'sonner';

type ToastProps = {
  toast: ToastData;
  isOpen?: boolean;
};

export const Toast: FC<ToastProps> = ({ toast, isOpen = false }) => {
  const isAdmin = useSelector(
    ({ auth }: RootState) => auth.decodedToken?.isAdmin ?? false
  );
  const currentUser = useSelector(({ auth }: RootState) => auth.decodedToken);

  const [editToast] = useEditToastMutation();
  const [createAccusation] = useCreateAccusationMutation();

  const {
    title,
    reason,
    location,
    customLocation,
    creator,
    dueDate,
    foods,
    drinks,
    invites,
  } = toast;
  const [isToastOpen, setIsToastOpen] = useState(false);
  const shouldShowContent = isOpen || isToastOpen;

  const shortReason =
    reason.length > 40 ? reason.slice(0, 40).trim() + '…' : reason;

  const formattedDate = new Date(dueDate).toLocaleString('he-IL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const getStatusDisplay = (
    isConfirmed: boolean | null,
    isPending: boolean
  ) => {
    if (isConfirmed) {
      return (
        <div className="flex items-center gap-2 mt-2">
          <strong className="text-green-300">אישרת את ההזמנה</strong>
          <span role="img" aria-label="אושר">
            ✅
          </span>
        </div>
      );
    }
    if (isConfirmed === false) {
      return (
        <div className="flex items-center gap-2 mt-2">
          <strong className="text-red-300">דחית את ההזמנה</strong>
          <span role="img" aria-label="נדחה">
            ❌
          </span>
        </div>
      );
    }
    if (isPending) {
      return (
        <div className="flex items-center gap-2 mt-2">
          <strong className="text-yellow-300">עוד לא אישרת את ההזמנה</strong>
          <span role="img" aria-label="ממתין">
            ⏳
          </span>
        </div>
      );
    }
    return undefined;
  };

  const { data: pendingToasts } = useGetPendingToastsQuery(undefined, {
    skip: !isAdmin,
  });
  const isPending = !!pendingToasts?.find(({ id }) => id === toast.id);
  const currentUserInvite = invites?.find(
    ({ invitee }) => invitee.id === currentUser?.id && invitee.id !== creator.id
  );
  const now = new Date();
  const isOutDated = new Date(dueDate) < now && !toast.isDone;

  const markToastAsDone = async (toastId: string) => {
    try {
      await editToast({
        toastId,
        newToast: {
          isDone: true,
        },
      }).unwrap();

      toaster.success('השתייה סומנה כבוצעה בהצלחה');
    } catch {
      toaster.error('שגיאה בסימון השתייה כבוצעה');
    }
  };

  const accuse = async (toastId: string) => {
    if (!currentUser) return;

    try {
      await createAccusation({
        reporterId: currentUser.id,
        accusedUserId: toast.userId,
        crimeToastId: toastId,
      }).unwrap();

      toaster.success('ההאשמה נוצרה בהצלחה');
    } catch {
      toaster.error('שגיאה ביצירת ההאשמה');
    }
  };

  const handleToggle = () => {
    if (!isOpen) {
      setIsToastOpen((prev) => !prev);
    }
  };

  return (
    <div
      dir="rtl"
      className={cn(
        `w-full ${!isOpen ? 'cursor-pointer' : ''} ${
          !shouldShowContent && 'h-fit'
        } bg-dusk-500 text-sunrise-100 border border-sunset-500 rounded-2xl shadow-md transition-all duration-300`
      )}
      onClick={!isOpen ? handleToggle : undefined}
    >
      <div
        className={`flex items-start justify-between px-6 py-4 ${
          !shouldShowContent && !isOpen && 'cursor-pointer'
        }`}
      >
        <div className="flex flex-col gap-1 flex-grow">
          <h2 className="text-xl font-bold text-sunrise-400">{title}</h2>
          <div className="w-fit">
            <UserCard
              user={creator}
              variant="inline"
              className="text-sm text-sunrise-100"
            />
          </div>
          <p className={`text-sm ${isOutDated && 'text-error font-bold'}`}>
            תאריך: {formattedDate}
          </p>
          {toast.isDone && (
            <div>
              <strong className="text-green-300">
                השתייה בוצעה
                <span role="img" aria-label="בוצע">
                  ✅
                </span>
              </strong>
            </div>
          )}
          {isOutDated && (
            <div>
              <strong className="text-error">
                השתייה לא בוצעה
                <span role="img" aria-label="בוצע">
                  ❌
                </span>
              </strong>
            </div>
          )}
          {!shouldShowContent && (
            <p className="text-sm mt-1">
              <strong className="text-sunrise-300">סיבה:</strong> {shortReason}
            </p>
          )}
        </div>
        <div onClick={(event) => event.stopPropagation()}>
          <DeleteToastModal
            id={toast.id}
            dueDate={toast.dueDate}
            creator={toast.creator}
          />
        </div>
        <div onClick={(event) => event.stopPropagation()}>
          <EditToastOpener toast={toast} />
        </div>
        {!isOpen && (
          <ChevronDown
            tabIndex={0}
            className={cn(
              'text-sunrise-300 transition-transform duration-300 mt-1 hover:text-sunrise-500',
              isToastOpen && 'rotate-180'
            )}
            onClick={(e) => {
              e.stopPropagation();
              handleToggle();
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleToggle();
              }
            }}
          />
        )}
      </div>
      <div
        className={cn(
          'flex flex-col gap-4 text-sm',
          shouldShowContent
            ? 'transition-all duration-500 px-6 pb-6 opacity-100 h-auto pointer-events-auto'
            : 'opacity-0 h-0 pointer-events-none transition-none'
        )}
      >
        {shouldShowContent && (
          <div
            className="cursor-default"
            onClick={(e) => {
              e.stopPropagation();
              if (!isOpen) {
                setIsToastOpen(true);
              }
            }}
          >
            <div>
              <strong className="text-sunrise-300">סיבה:</strong> {reason}
            </div>
            <div>
              <strong className="text-sunrise-300">מיקום:</strong>{' '}
              {location === ToastLocation.OTHER_LOCATION ? (
                <span>{customLocation}</span>
              ) : (
                <span>{location}</span>
              )}
            </div>
            <TagsArray
              tags={foods}
              label="מאכלים"
              color="bg-sunset-600 text-sunrise-100"
            />
            <TagsArray
              tags={drinks}
              label="משקאות"
              color="bg-sunrise-300 text-dusk-600"
            />
            {currentUserInvite
              ? getStatusDisplay(currentUserInvite.isConfirmed, isPending)
              : undefined}

            {isAdmin && isPending && (
              <div className="flex gap-3 mt-4 pt-3 border-t border-sunset-500/30">
                <Button
                  variant="outline"
                  className="flex-1 bg-green-600/20 hover:bg-green-600/30 border-green-500/40 text-green-300 hover:text-green-200 font-medium transition-all duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    markToastAsDone(toast.id);
                  }}
                >
                  סמן שתייה כבוצעה
                  <span role="img" aria-label="בוצעה">
                    ✅
                  </span>
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 bg-red-600/20 hover:bg-red-600/30 border-red-500/40 text-red-300 hover:text-red-200 font-medium transition-all duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    accuse(toast.id);
                  }}
                >
                  צור האשמה
                  <span role="img" aria-label="משקל הצדק">
                    ⚖️
                  </span>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
