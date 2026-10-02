import { FC, useState, useMemo } from 'react';
import { useCreateAccusationMutation } from '@/store/api/accusation.api';
import { useSelector } from 'react-redux';
import { RootState, useGetAllUsersQuery } from '@/store';
import { FormInput } from '../add-toast-modal/components';
import { Button } from '../ui/button';
import { toast as toaster } from 'sonner';
import { useParams } from 'react-router-dom';
import { useGetPendingToastsQuery } from '@/store/api/toast.api';
import { DialogDescription, DialogTitle } from '../ui/dialog';
import { FormSelect } from './components';

type Props = {
  closeModal: () => void;
};

type AccusationFormData = {
  accusedUserId: string;
  reason: string;
  crimeToastId?: string;
  reporterId: string;
};

const getInitialAccusationData = (
  isAdmin: boolean,
  currentUserId: string,
  paramUserId: string | undefined
): AccusationFormData => {
  const accusedUserId = isAdmin ? paramUserId || '' : '';

  return {
    accusedUserId,
    reason: '',
    crimeToastId: '',
    reporterId: currentUserId,
  };
};

export const AddAccusationModal: FC<Props> = ({ closeModal }) => {
  const [createAccusation] = useCreateAccusationMutation();
  const { userId: paramUserId } = useParams<{ userId: string }>();

  const { data: allUsers } = useGetAllUsersQuery();
  const { data: uncompletedToasts } = useGetPendingToastsQuery();

  const currentUser = useSelector(({ auth }: RootState) => auth.decodedToken);

  const isAdmin = !!currentUser?.isAdmin;

  const [accusationData, setAccusationData] = useState<AccusationFormData>(() =>
    getInitialAccusationData(isAdmin, currentUser?.id || '', paramUserId)
  );

  const toastOptions = useMemo(() => {
    if (!uncompletedToasts || !accusationData.accusedUserId) return [];

    return uncompletedToasts
      .filter((toast) => toast.userId === accusationData.accusedUserId)
      .map((toast) => ({
        value: toast.id,
        label: `${toast.title} - ${new Date(toast.dueDate).toLocaleDateString(
          'he-IL'
        )}`,
      }));
  }, [uncompletedToasts, accusationData.accusedUserId]);

  if (!currentUser) {
    return null;
  }

  const updateAccusationData = (updates: Partial<AccusationFormData>) => {
    setAccusationData((prev) => ({ ...prev, ...updates }));
  };

  const resetForm = () => {
    setAccusationData({
      reporterId: currentUser.id,
      accusedUserId: '',
      reason: '',
      crimeToastId: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !accusationData.accusedUserId.trim()
    ) {
      toaster.error('יש לבחור משתמש מואשם');
      return;
    }

    if (accusationData.accusedUserId === currentUser.id) {
      toaster.error('לא ניתן להאשים את עצמך');
      return;
    }
    
    if (accusationData.crimeToastId === 'ללא שתייה קשורה' && !accusationData.reason.trim()) {
      toaster.error('יש להגדיר סיבה להאשמה');
      return;
    }

    try {
      await createAccusation({
        reporterId: currentUser.id,
        accusedUserId: accusationData.accusedUserId,
        reason: accusationData.reason || undefined,
        crimeToastId: accusationData.crimeToastId || undefined,
      }).unwrap();

      resetForm();
      closeModal();
      toaster.success('ההאשמה נוצרה בהצלחה');
    } catch {
      toaster.error(`שגיאה בטיפול בהאשמה!`);
    }
  };

  const availableUsers =
    allUsers?.filter((user) => user.id !== currentUser.id) || [];

  return (
    <form
      onSubmit={handleSubmit}
      className="text-white py-4 pr-1 max-h-[80rem] lg:min-h-[50vh] min-h-[90vh] lg:h-[70vh] h-[90vh] w-full overscroll-y-auto flex justify-start flex-col"
    >
      <DialogTitle className="text-lg font-semibold text-center mb-4 text-red-300">
        הגשת האשמה חדשה
      </DialogTitle>
      <DialogDescription />
      <div
        dir="ltr"
        className="flex flex-grow flex-col justify-start lg:max-h-[85%] overflow-y-auto scrollbar-styled [scrollbar-gutter:stable_both-edges]"
      >
        <div className="space-y-4 pt-4 pr-4" dir="rtl">
          <FormSelect
            label="משתמש מואשם"
            value={accusationData.accusedUserId}
            onChange={(value) => {
              updateAccusationData({
                accusedUserId: value,
                crimeToastId: '',
              });
            }}
            options={availableUsers.map((user) => ({
              value: user.id,
              label: user.username,
            }))}
            required
          />

          {accusationData.accusedUserId && toastOptions.length > 0 && (
            <FormSelect
              label="שתייה שלא בוצעה (אופציונלי)"
              value={accusationData.crimeToastId || 'ללא שתייה קשורה'}
              onChange={(value) =>
                updateAccusationData({ crimeToastId: value })
              }
              options={[
                { value: 'ללא שתייה קשורה', label: 'ללא שתייה קשורה' },
                ...toastOptions,
              ]}
            />
          )}

          {(!accusationData.crimeToastId ||
            accusationData.crimeToastId === 'ללא שתייה קשורה') && (
            <FormInput
              label="סיבת ההאשמה"
              value={accusationData.reason}
              onChange={(value) => updateAccusationData({ reason: value })}
              placeholder="תאר את הסיבה להאשמה..."
              rowsAmount={4}
              required
              min={3}
            />
          )}

          <div className="border-[1px] border-red-800 w-[95%] mx-auto opacity-50" />
        </div>
        <div className="flex-grow lg:hidden" />
        <div className="flex gap-2 pt-4 px-4 lg:hidden">
          <Button
            type="button"
            onClick={closeModal}
            className="px-4 p-2 rounded bg-red-900/20 hover:bg-red-900/40 border border-red-700/40 text-white transition-all duration-200"
          >
            ביטול
          </Button>
          <Button
            type="submit"
            className="flex-1 p-2 rounded bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium transition-all duration-200"
          >
            צור האשמה
          </Button>
        </div>
      </div>
      <div className="flex-grow hidden lg:flex" />
      <div className="lg:flex gap-2 pt-4 px-4 hidden">
        <Button
          type="button"
          onClick={closeModal}
          className="px-4 p-2 rounded bg-red-900/20 hover:bg-red-900/40 border border-red-700/40 text-white transition-all duration-200"
        >
          ביטול
        </Button>
        <Button
          type="submit"
          className="flex-1 p-2 rounded bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium transition-all duration-200"
        >
          צור האשמה
        </Button>
      </div>
    </form>
  );
};
