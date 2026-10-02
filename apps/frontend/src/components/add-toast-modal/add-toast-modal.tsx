import { FC, useState, useEffect, useMemo } from 'react';
import { InviteData, ToastData, ToastLocation } from '@/types';
import {
  useCreateToastMutation,
  useEditToastMutation,
} from '@/store/api/toast.api';
import { useSelector } from 'react-redux';
import { RootState, useGetAllUsersQuery } from '@/store';
import {
  FormSelect,
  InvitationsSection,
  FormInput,
  ChipsInput,
} from './components';
import { Button } from '../ui/button';
import {
  useCreateInviteMutation,
  useDeleteInviteMutation,
  useGetInvitesByRelatedToastQuery,
} from '@/store/api/invites.api';
import { toast as toaster } from 'sonner';
import { useParams } from 'react-router-dom';
import { DialogTitle } from '@radix-ui/react-dialog';
import { DialogDescription } from '../ui/dialog';
import { useDebounce } from '@uidotdev/usehooks';

type Props = {
  closeModal: () => void;
  toast?: ToastData;
};

type ToastFormData = {
  title: string;
  reason: string;
  location: ToastLocation;
  customLocation?: string | null;
  dueDate: Date;
  foods: string[];
  drinks: string[];
  selectedUserId: string;
  isDone: boolean;
  invitedUsers: string[];
};

const getInitialToastData = (
  isEditMode: boolean,
  toast: ToastData | undefined,
  isAdmin: boolean,
  currentUserId: string,
  paramUserId: string | undefined,
  initialInvitedUsers: string[]
): ToastFormData => {
  if (isEditMode && toast) {
    return {
      title: toast.title || '',
      reason: toast.reason || '',
      location: toast.location || ToastLocation.IN_SECTION,
      customLocation: toast.customLocation || null,
      dueDate: toast.dueDate ? new Date(toast.dueDate) : new Date(),
      foods: toast.foods && toast.foods.length > 0 ? toast.foods : [],
      drinks: toast.drinks && toast.drinks.length > 0 ? toast.drinks : [],
      selectedUserId: toast.userId || '',
      isDone: toast.isDone || false,
      invitedUsers: initialInvitedUsers,
    };
  }

  const userId = isAdmin ? paramUserId || currentUserId : currentUserId;

  return {
    title: '',
    reason: '',
    location: ToastLocation.IN_SECTION,
    customLocation: null,
    dueDate: new Date(),
    foods: [],
    drinks: [],
    selectedUserId: userId,
    isDone: false,
    invitedUsers: [],
  };
};

const toLocalISOString = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const AddToastModal: FC<Props> = ({ closeModal, toast }) => {
  const [createToast] = useCreateToastMutation();
  const [editToast] = useEditToastMutation();
  const [createInviteTrigger] = useCreateInviteMutation();
  const [deleteInviteTrigger] = useDeleteInviteMutation();
  const { userId: paramUserId } = useParams<{ userId: string }>();

  const { data: invites } = useGetInvitesByRelatedToastQuery(toast?.id ?? '', {
    skip: !toast?.id,
  });
  const { data: allUsers } = useGetAllUsersQuery();
  const currentUser = useSelector(({ auth }: RootState) => auth.decodedToken);

  const isEditMode = !!toast;
  const isAdmin = !!currentUser?.isAdmin;

  const initialInvitedUsers = useMemo(
    () => invites?.map(({ invitee }) => invitee.id) || [],
    [invites]
  );

  const [toastData, setToastData] = useState<ToastFormData>(() =>
    getInitialToastData(
      isEditMode,
      toast,
      isAdmin,
      currentUser?.id || '',
      paramUserId,
      []
    )
  );

  const debouncedTitle = useDebounce(toastData.title, 500);
  const debouncedReason = useDebounce(toastData.reason, 500);
  const debouncedCustomLocation = useDebounce(toastData.customLocation, 500);

  useEffect(() => {
    if (isEditMode || (!isAdmin && !isEditMode)) {
      const initialData = getInitialToastData(
        isEditMode,
        toast,
        isAdmin,
        currentUser?.id || '',
        paramUserId,
        initialInvitedUsers
      );
      setToastData(initialData);
    }
  }, [
    isEditMode,
    toast,
    isAdmin,
    currentUser,
    initialInvitedUsers,
    paramUserId,
  ]);

  const allOtherUsers = useMemo(
    () => allUsers?.filter(({ id }) => id !== toastData?.selectedUserId),
    [allUsers, toastData]
  );

  if (!currentUser) {
    return null;
  }

  const updateToastData = (updates: Partial<ToastFormData>) => {
    setToastData((prev) => ({ ...prev, ...updates }));
  };

  const createInvite = async (invite: {
    inviteeId: string;
    toastId: string;
  }): Promise<InviteData> => {
    const result = await createInviteTrigger(invite);
    if ('error' in result) {
      throw new Error('Failed to create invite');
    }
    return result.data;
  };

  const deleteInvite = async (inviteId: string): Promise<number> => {
    const result = await deleteInviteTrigger(inviteId);
    if ('error' in result) {
      throw new Error('Failed to delete invite');
    }
    return result.data;
  };

  const generateInvitePromises = (
    currentInvitedUsers: string[],
    initialInvitedUsers: string[],
    existingInvites: InviteData[],
    toastId: string
  ): Promise<InviteData | number>[] => {
    const promises: Promise<InviteData | number>[] = [];

    const usersToAdd = currentInvitedUsers.filter(
      (userId) => !initialInvitedUsers.includes(userId)
    );

    const usersToRemove = initialInvitedUsers.filter(
      (userId) => !currentInvitedUsers.includes(userId)
    );

    usersToAdd.forEach((userId) => {
      promises.push(
        createInvite({
          inviteeId: userId,
          toastId,
        })
      );
    });

    usersToRemove.forEach((userId) => {
      const inviteToDelete = existingInvites.find(
        ({ invitee }) => invitee.id === userId
      );
      if (inviteToDelete) {
        promises.push(deleteInvite(inviteToDelete.id));
      }
    });

    return promises;
  };

  const resetForm = () => {
    const initialData = getInitialToastData(
      isEditMode,
      toast,
      isAdmin,
      currentUser?.id || '',
      paramUserId,
      []
    );
    setToastData(initialData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const filteredFoods = toastData.foods.filter(
        (food) => food.trim() !== ''
      );
      const filteredDrinks = toastData.drinks.filter(
        (drink) => drink.trim() !== ''
      );

      const submitData: Omit<ToastData, 'id' | 'creator'> = {
        title: debouncedTitle,
        reason: debouncedReason,
        location: toastData.location,
        customLocation:
          toastData.location === ToastLocation.OTHER_LOCATION
            ? debouncedCustomLocation
            : null,
        dueDate: new Date(toastData.dueDate),
        foods: filteredFoods,
        drinks: filteredDrinks,
        userId: isAdmin ? toastData.selectedUserId : currentUser.id,
        ...(isAdmin && { isDone: toastData.isDone }),
      };

      if (isEditMode && toast) {
        await editToast({
          toastId: toast.id,
          newToast: submitData,
        });

        const invitePromises = generateInvitePromises(
          toastData.invitedUsers,
          initialInvitedUsers,
          invites || [],
          toast.id
        );

        if (invitePromises.length > 0) {
          await Promise.all(invitePromises);
        }
      } else {
        await createToast({
          toast: submitData,
          invites: toastData.invitedUsers,
        });
      }

      resetForm();
      closeModal();
    } catch (error) {
      toaster.error(`Error submitting toast: ${error}`);
    }
  };

  const getIsSubmitDisabled = (toastData: ToastFormData): boolean => {
    if (
      !toastData.title.trim() ||
      !toastData.reason.trim() ||
      !toastData.selectedUserId ||
      !toastData.dueDate
    ) {
      return true;
    }

    const hasValidFood = toastData.foods.some((food) => food.trim() !== '');
    const hasValidDrink = toastData.drinks.some((drink) => drink.trim() !== '');

    if (!hasValidFood && !hasValidDrink) {
      return true;
    }

    return false;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="text-white py-4 pr-1 max-h-[80rem] h-[80vh] w-full overscroll-y-auto flex justify-between flex-col"
    >
      <DialogTitle className="text-lg font-semibold text-center mb-4">
        {isEditMode ? 'עריכת שתייה' : 'הוספת שתייה חדשה'}
      </DialogTitle>
      <DialogDescription />
      <div
        dir="ltr"
        className="max-h-[85%] overflow-y-auto scrollbar-theme [scrollbar-gutter:stable_both-edges]"
      >
        <div className="space-y-4 py-4 pr-4" dir="rtl">
          {isAdmin && (
            <FormSelect
              label="משתמש"
              value={toastData.selectedUserId}
              onChange={(value) => updateToastData({ selectedUserId: value })}
              options={
                allUsers?.map((user) => ({
                  value: user.id,
                  label: user.username,
                })) || []
              }
              required
            />
          )}
          <FormInput
            label="כותרת"
            value={toastData.title}
            onChange={(value) => updateToastData({ title: value })}
            placeholder="שם האירוע..."
            min={2}
            max={50}
            required
          />
          <FormInput
            label="סיבה"
            value={toastData.reason}
            onChange={(value) => updateToastData({ reason: value })}
            placeholder="למה אנחנו חוגגים..."
            rowsAmount={3}
            min={3}
            max={500}
            required
          />
          <FormSelect
            label="מיקום"
            value={toastData.location}
            onChange={(value) =>
              updateToastData({ location: value as ToastLocation })
            }
            options={Object.values(ToastLocation).map((location) => ({
              label: location,
            }))}
            required
          />
          {toastData.location === ToastLocation.OTHER_LOCATION && (
            <FormInput
              label="מיקום אחר"
              value={toastData.customLocation || ''}
              onChange={(value) => updateToastData({ customLocation: value })}
              placeholder="פרט מיקום אחר..."
              required
            />
          )}
          <FormInput
            label="תאריך ושעה"
            type="datetime-local"
            value={toLocalISOString(toastData.dueDate)}
            onChange={(dateAsString: string) => {
              const newDate = new Date(dateAsString);
              if (!isNaN(newDate.getTime())) {
                updateToastData({ dueDate: newDate });
              }
            }}
            required
            isDisabled={
              !isAdmin &&
              isEditMode &&
              new Date(toastData.dueDate) <= new Date()
            }
          />
          <ChipsInput
            label="אוכל"
            items={toastData.foods}
            onItemsChange={(foods) => updateToastData({ foods })}
            placeholder="פריט אוכל..."
          />
          <ChipsInput
            label="משקאות"
            items={toastData.drinks}
            onItemsChange={(drinks) => updateToastData({ drinks })}
            placeholder="פריט משקה..."
          />
          {isAdmin && !(new Date(toastData.dueDate) > new Date()) && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isDone"
                checked={toastData.isDone}
                onChange={(e) => updateToastData({ isDone: e.target.checked })}
                className="rounded border-gray-300 text-sunrise-500 focus:ring-sunrise-500"
              />
              <label htmlFor="isDone" className="text-white pr-2">
                השתייה הושלמה
              </label>
            </div>
          )}
          <div className="border-[1px] border-dusk-600 w-[95%] mx-auto opacity-50" />
          <InvitationsSection
            users={allOtherUsers ?? []}
            selectedUsers={toastData.invitedUsers}
            onSelectionChange={(invitedUsers) =>
              updateToastData({ invitedUsers })
            }
          />
        </div>
        <div className="flex gap-2 pt-4 px-4 lg:hidden">
          <Button
            type="button"
            onClick={closeModal}
            className="px-4 p-2 rounded bg-white/10 hover:bg-white/20 border border-white/20 text-white"
          >
            ביטול
          </Button>
          <Button
            disabled={getIsSubmitDisabled(toastData)}
            type="submit"
            className="flex-1 p-2 rounded bg-gradient-to-r from-sunrise-500 to-sunset-500 hover:from-sunrise-600 hover:to-sunset-600 text-white font-medium"
          >
            {isEditMode ? 'עדכן שתייה' : 'צור שתייה'}
          </Button>
        </div>
      </div>
      <div className="lg:flex gap-2 pt-4 px-4 hidden">
        <Button
          type="button"
          onClick={closeModal}
          className="px-4 p-2 rounded bg-white/10 hover:bg-white/20 border border-white/20 text-white"
        >
          ביטול
        </Button>
        <Button
          disabled={getIsSubmitDisabled(toastData)}
          type="submit"
          className="flex-1 p-2 rounded bg-gradient-to-r from-sunrise-500 to-sunset-500 hover:from-sunrise-600 hover:to-sunset-600 text-white font-medium"
        >
          {isEditMode ? 'עדכן שתייה' : 'צור שתייה'}
        </Button>
      </div>
    </form>
  );
};
