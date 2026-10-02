import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { FC, ReactElement } from 'react';

type TooltipProps = {
  icon: ReactElement;
  content: string;
  bgColor: string;
  tooltipClassName?: string;
};

export const MyTooltip: FC<TooltipProps> = ({
  icon,
  content,
  bgColor,
  tooltipClassName,
}: TooltipProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={`w-5 h-5 ${bgColor} text-white rounded-full flex items-center justify-center`}
        >
          {icon}
        </div>
      </TooltipTrigger>
      <TooltipContent
        className={cn('bg-white text-dusk-600', tooltipClassName)}
      >
        {content}
      </TooltipContent>
    </Tooltip>
  );
};
