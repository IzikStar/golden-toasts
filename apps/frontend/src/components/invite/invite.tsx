import { FC, useState } from 'react';
import { InviteData } from '@/types';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';
import { toast as toaster } from 'sonner';
import {
  useDeleteInviteMutation,
  useUpdateInviteStatusMutation,
} from '@/store/api/invites.api';
import { Toast } from '../toast';

type Props = {
  invite: InviteData;
};

export const Invite: FC<Props> = ({ invite }) => {
  const currentUser = useSelector(({ auth }: RootState) => auth.decodedToken);
  const [updateInviteStatus] = useUpdateInviteStatusMutation();
  const [deleteInviteTrigger] = useDeleteInviteMutation();

  const { id, invitee, toast, isConfirmed } = invite;
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const isReceivedInvite = currentUser?.id === invitee.id;
  const isSentInvite = currentUser?.id === toast.creator.id;

  const updateInviteByStatus = async (inviteId: string, status: boolean) => {
    const successMessage = status
      ? 'ההזמנה אושרה בהצלחה'
      : 'ההזמנה נדחתה בהצלחה';
    const errorMessage = status ? 'שגיאה באישור ההזמנה' : 'שגיאה בדחיית ההזמנה';

    try {
      await updateInviteStatus({
        inviteId,
        isConfirmed: status,
      }).unwrap();

      toaster.success(successMessage);
    } catch {
      toaster.error(errorMessage);
    }
  };

  const getStatusDisplay = () => {
    if (isConfirmed === true) {
      return (
        <div className="flex items-center gap-2">
          <strong className="text-green-300">ההזמנה אושרה</strong>
          <span role="img" aria-label="אושר">
            ✅
          </span>
        </div>
      );
    }
    if (isConfirmed === false) {
      return (
        <div className="flex items-center gap-2">
          <strong className="text-red-300">ההזמנה נדחתה</strong>
          <span role="img" aria-label="נדחה">
            ❌
          </span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2">
        <strong className="text-yellow-300">ממתין לתשובה</strong>
        <span role="img" aria-label="ממתין">
          ⏳
        </span>
      </div>
    );
  };

  const getInviteTitle = () => {
    if (isReceivedInvite) {
      return `${toast.creator.username} מזמין אותך`;
    }
    if (isSentInvite) {
      return `הזמנה ל${invitee.username}`;
    }
    return toast.title;
  };

  return (
    <div
      dir="rtl"
      className={cn(
        `w-full bg-dusk-500 text-sunrise-100 border border-sunset-500 rounded-2xl shadow-md transition-all duration-300`
      )}
    >
      <div
        className="flex items-start justify-between px-6 py-4 cursor-pointer"
        onClick={() => setIsInviteOpen((prev) => !prev)}
      >
        <div className="flex flex-col gap-1 flex-grow">
          <h2 className="text-xl font-bold text-sunrise-400">
            {getInviteTitle()}
          </h2>
          <div className="mt-2">{getStatusDisplay()}</div>
        </div>
        <ChevronDown
          tabIndex={0}
          className={cn(
            'text-sunrise-300 transition-transform duration-300 mt-1 hover:text-sunrise-500',
            isInviteOpen && 'rotate-180'
          )}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              setIsInviteOpen((prev) => !prev);
            }
          }}
        />
      </div>
      <div
        className={cn(
          'flex flex-col gap-4 text-sm',
          isInviteOpen
            ? 'transition-all duration-500 px-6 pb-0 opacity-100 h-auto pointer-events-auto'
            : 'opacity-0 h-0 pointer-events-none transition-none'
        )}
      >
        {isInviteOpen && (
          <div onClick={(e) => e.stopPropagation()}>
            <Toast toast={toast} isOpen />
            {isSentInvite && (
              <div className="pb-6 pt-3 mt-3 border-t border-sunset-500/30">
                <div className="text-center p-3 bg-sunrise-100/10 rounded-lg">
                  <p className="text-sunrise-200">
                    {isConfirmed === null
                      ? `ממתין לתשובה מ${invitee.username}`
                      : isConfirmed
                      ? `${invitee.username} אישר את ההזמנה`
                      : `${invitee.username} דחה את ההזמנה`}
                  </p>
                </div>
                {isConfirmed === null && (
                  <Button
                    variant="outline"
                    className="w-full mt-2 bg-red-600/20 hover:bg-red-600/30 border-red-500/40 text-red-300 hover:text-red-200 font-medium transition-all duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteInviteTrigger(id);
                    }}
                  >
                    <span role="img" aria-label="דחה">
                      ❌
                    </span>
                    בטל הזמנה
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      {isReceivedInvite && isConfirmed === null && (
        <div className="flex gap-3 px-6 pb-6 pt-3 mt-3 border-t border-sunset-500/30">
          <Button
            variant="outline"
            className="flex-1 bg-green-600/20 hover:bg-green-600/30 border-green-500/40 text-green-300 hover:text-green-200 font-medium transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation();
              updateInviteByStatus(id, true);
            }}
          >
            אשר הזמנה
            <span role="img" aria-label="אשר">
              ✅
            </span>
          </Button>
          <Button
            variant="outline"
            className="flex-1 bg-red-600/20 hover:bg-red-600/30 border-red-500/40 text-red-300 hover:text-red-200 font-medium transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation();
              updateInviteByStatus(id, false);
            }}
          >
            דחה הזמנה
            <span role="img" aria-label="דחה">
              ❌
            </span>
          </Button>
        </div>
      )}
    </div>
  );
};
