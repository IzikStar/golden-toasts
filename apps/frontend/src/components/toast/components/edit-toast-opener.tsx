import { AddToastModal } from '@/components/add-toast-modal';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { RootState } from '@/store';
import { ToastData } from '@/types';
import { Pencil } from 'lucide-react';
import { FC, useState } from 'react';
import { useSelector } from 'react-redux';

type Props = {
  toast: ToastData;
};

export const EditToastOpener: FC<Props> = ({ toast }) => {
  const currentUser = useSelector(
    (state: RootState) => (state.auth as RootState['auth']).decodedToken
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (toast.creator.id !== currentUser?.id && !currentUser?.isAdmin) {
    return null;
  }

  return (
    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
      <DialogTrigger asChild>
        <button className="flex p-2">
          <Pencil
            className="text-sunrise-300 hover:text-sunrise-500"
            size={18}
          />
        </button>
      </DialogTrigger>

      <DialogContent
        className="
          rounded-3xl overflow-hidden
          w-auto min-w-[400px] max-h-[80vh] p-0
          bg-gradient-to-br from-dusk-600/80 via-sunset-700/60 to-dusk-500/70
          backdrop-blur-sm shadow-sm shadow-sunrise-300
          animate-in fade-in-0 zoom-in-95 duration-150
          bg-clip-padding
        "
      >
        <AddToastModal
          closeModal={() => setIsEditModalOpen(false)}
          toast={toast}
        />
      </DialogContent>
    </Dialog>
  );
};
