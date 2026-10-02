import { RootState } from '@/store';
import { ToastData } from '@/types';
import { Trash2 } from 'lucide-react';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useDeleteToastMutation } from '@/store/api/toast.api';
import { toast as sonner } from 'sonner';

type Props = {
  id: ToastData['id'];
  dueDate: ToastData['dueDate'];
  creator: ToastData['creator'];
};

export const DeleteToastModal: FC<Props> = ({ id, dueDate, creator }) => {
  const [deleteToast] = useDeleteToastMutation();
  const currentUser = useSelector(({ auth }: RootState) => auth.decodedToken);

  const deleteToastHandler = async (id: string) => {
    try {
      await deleteToast(id).unwrap();
      sonner.success('השתייה נמחקה בהצלחה');
    } catch (error) {
      console.error('Failed to delete toast:', error);
      sonner.error('שגיאה במחיקת השתייה, אנא נסה שוב');
    }
  };

  if (
    (creator.id !== currentUser?.id || new Date(dueDate) < new Date()) &&
    !currentUser?.isAdmin
  ) {
    return null;
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger className="flex p-2">
        <Trash2 className="text-sunrise-300 hover:text-error" size={18} />
      </AlertDialogTrigger>
      <AlertDialogContent
        className="bg-sunrise-wave
        border border-purple-600/30
        rounded-lg p-6
        w-fit h-fit
        text-center"
        dir="rtl"
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white text-center text-lg font-bold">
            למחוק את השתייה?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-error font-bold text-center text-sm mt-2">
            אי אפשר לבטל את הפעולה הזו, השתייה תימחק לצמיתות
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-3 mt-6 justify-center items-center">
          <AlertDialogCancel className="bg-transparent hover:bg-orange-100 hover:text-purple-900 text-white px-4 py-2 rounded-md">
            בטל
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteToastHandler(id)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
          >
            מחק
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
