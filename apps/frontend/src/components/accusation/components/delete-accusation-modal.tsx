import { RootState } from '@/store';
import { AccusationData } from '@/types';
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
import { useDeleteAccusationMutation } from '@/store/api/accusation.api';
import { toast } from 'sonner';

type Props = {
  id: AccusationData['id'];
  reporter: AccusationData['reporter'];
  reason: AccusationData['reason'];
};

export const DeleteAccusationModal: FC<Props> = ({ id, reporter, reason }) => {
  const [deleteAccusation] = useDeleteAccusationMutation();
  const currentUser = useSelector(({ auth }: RootState) => auth.decodedToken);

  const deleteAccusationHandler = async () => {
    try {
      await deleteAccusation(id).unwrap();
      toast.success('ההאשמה נמחקה בהצלחה');
    } catch (error) {
      console.error('Failed to delete accusation:', error);
      toast.error('שגיאה במחיקת ההאשמה, אנא נסה שוב');
    }
  };

  const canDelete =
    currentUser?.isAdmin &&
    (reporter.id === currentUser?.id || !reason || reason.trim() === '');

  if (!canDelete) {
    return null;
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger className="flex p-2">
        <Trash2 className="text-red-300 hover:text-red-500" size={18} />
      </AlertDialogTrigger>
      <AlertDialogContent
        className="bg-red-900
        border border-red-700/50
        rounded-lg p-6
        w-fit h-fit
        text-center"
        dir="rtl"
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white text-center text-lg font-bold">
            למחוק את ההאשמה?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-red-300 font-bold text-center text-sm mt-2">
            אי אפשר לבטל את הפעולה הזו, ההאשמה תימחק לצמיתות
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-3 mt-6 justify-center items-center">
          <AlertDialogCancel className="bg-transparent hover:bg-red-100 hover:text-red-900 text-white px-4 py-2 rounded-md">
            בטל
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={deleteAccusationHandler}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
          >
            מחק
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
