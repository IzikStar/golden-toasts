import { AddAccusationModal } from '@/components/add-accusation-modal';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { PlusIcon } from 'lucide-react';
import { FC, useState } from 'react';

export const AddAccusationOpener: FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={() => {
        setIsDialogOpen((prev) => !prev);
      }}
    >
      <div className="relative w-full h-full">
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger>
              <div
                className="hover:scale-110 max-w-fit p-2 w-full h-full ring-2 ring-error flex justify-center items-center focus:outline-none backdrop-blur-sm rounded-full bg-sun-gradient transition-all duration-400"
                tabIndex={-1}
                onClick={() => {
                  setIsDialogOpen(true);
                }}
              >
                <PlusIcon className="m-0 lg:w-9 lg:h-9 text-white" />
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="bg-gradient-to-br from-red-900/80 to-black/60 border-error/30 text-white shadow-xl backdrop-blur-sm"
              sideOffset={8}
            >
              <span className="font-medium text-sm">יצירת האשמה</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <DialogContent
        className="
          rounded-3xl overflow-hidden  
          ring-error ring-4
          w-auto min-w-[500px] max-h-[90vh] lg:min-h-[50vh] min-h-[90vh] p-0
          bg-gradient-to-br from-red-900/90 to-black/50
          backdrop-blur-xl shadow-sm shadow-sunrise-300
          animate-in fade-in-0 zoom-in-95 duration-150
          bg-clip-padding border-0                 
        "
      >
        <AddAccusationModal
          closeModal={() => {
            setIsDialogOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
