import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { FC, useEffect, useRef, useState } from 'react';

type TagsArrayProps = {
  tags: string[];
  label: string;
  color: string;
};

export const TagsArray: FC<TagsArrayProps> = ({ tags, label, color }) => {
  const TagItem: FC<{ item: string }> = ({ item }) => {
    const spanRef = useRef<HTMLSpanElement>(null);
    const [isTruncated, setIsTruncated] = useState(false);

    useEffect(() => {
      if (spanRef.current) {
        const el = spanRef.current;
        const overflowing = el.scrollWidth > el.clientWidth;
        setIsTruncated(overflowing);
      }
    }, [item]);

    const content = (
      <span
        ref={spanRef}
        className={`${color} px-3 py-1 rounded-full truncate max-w-[150px]`}
      >
        {item}
      </span>
    );

    if (isTruncated) {
      return (
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>{content}</TooltipTrigger>
            <TooltipContent
              side="top"
              className="bg-gradient-to-br from-dusk-600/80 via-sunset-700/60 to-dusk-500/70 border-sunset-400/30 text-sunrise-100 shadow-xl backdrop-blur-sm"
              sideOffset={8}
            >
              <span className="font-medium text-sm">{item}</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return content;
  };

  return (
    tags.length > 0 && (
      <div>
        <strong className="text-sunrise-300">{label}:</strong>
        <div className="flex flex-wrap gap-2 mt-1">
          {tags.map((item, i) => (
            <TagItem key={i} item={item} />
          ))}
        </div>
      </div>
    )
  );
};
