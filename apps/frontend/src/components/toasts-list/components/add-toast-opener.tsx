import { AddToastModal } from '@/components/add-toast-modal';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { LucideCalendarPlus } from 'lucide-react';
import { FC, useState } from 'react';

export const AddToastOpener: FC = () => {
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
                className="hover:scale-110 max-w-fit p-3 w-full h-full ring-4 ring-sunset-400 flex justify-center items-center focus:outline-none backdrop-blur-sm rounded-full bg-gold-600 animate-glow-pulse gradient-hover-smooth transition-all duration-400"
                tabIndex={-1}
                onClick={() => {
                  setIsDialogOpen(true);
                }}
              >
                <LucideCalendarPlus className="m-0 lg:w-9 lg:h-9 text-white" />
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="bg-gradient-to-br from-dusk-600/80 via-sunset-700/60 to-dusk-500/70 border-sunset-400/30 text-sunrise-100 shadow-xl backdrop-blur-sm"
              sideOffset={8}
            >
              <span className="font-medium text-sm">יצירת שתייה</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <DialogContent 
        className="
          rounded-3xl overflow-hidden
          w-auto min-w-[500px] max-h-[90vh] min-h-[80vh] p-0
          bg-gradient-to-br from-dusk-600/80 via-sunset-700/60 to-dusk-500/70
          backdrop-blur-sm shadow-sm shadow-sunrise-300
          animate-in fade-in-0 zoom-in-95 duration-150
          bg-clip-padding
        "
      >
        <AddToastModal
          closeModal={() => {
            setIsDialogOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
