import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { X, Plus } from 'lucide-react';
import { FC, useState, KeyboardEvent, useRef, useEffect } from 'react';

export const ChipsInput: FC<{
  label: string;
  items: string[];
  onItemsChange: (items: string[]) => void;
  placeholder: string;
  maxChips?: number;
}> = ({ label, items, onItemsChange, placeholder, maxChips }) => {
  const [inputValue, setInputValue] = useState('');

  const addItem = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue) {
      if (!maxChips || items.length < maxChips) {
        onItemsChange([...items, trimmedValue]);
        setInputValue('');
      }
    }
  };

  const removeItem = (indexToRemove: number) => {
    onItemsChange(items.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItem();
    } else if (e.key === 'Backspace' && inputValue === '' && items.length > 0) {
      removeItem(items.length - 1);
    }
  };

  const ChipItem: FC<{ item: string; index: number }> = ({ item, index }) => {
    const spanRef = useRef<HTMLSpanElement>(null);
    const [isTruncated, setIsTruncated] = useState(false);

    useEffect(() => {
      if (spanRef.current) {
        const element = spanRef.current;
        const isOverflowing = element.scrollWidth > element.clientWidth;
        setIsTruncated(isOverflowing);
      }
    }, [item]);

    const chipContent = (
      <div
        className="inline-flex items-center gap-1 px-2 py-1.5 bg-gradient-to-br from-dusk-600/80 via-sunset-700/60 to-dusk-500/70
        backdrop-blur-sm shadow-sm shadow-sunrise-300 hover:bg-purple-500/30 border border-purple-500 rounded-full text-xs text-purple-200 transition-colors duration-200 group max-w-[150px]"
      >
        <span ref={spanRef} className="truncate">
          {item}
        </span>
        <button
          type="button"
          onClick={() => removeItem(index)}
          className="p-0.5 rounded-full hover:bg-purple-500/40 transition-colors duration-200 opacity-70 group-hover:opacity-100"
          aria-label={`הסר ${item}`}
        >
          <X size={12} />
        </button>
      </div>
    );

    if (isTruncated) {
      return (
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>{chipContent}</TooltipTrigger>
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

    return chipContent;
  };

  const canAddMore = !maxChips || items.length < maxChips;

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-purple-200">
        {label}
      </label>
      <div
        className="relative p-3 bg-white/10 rounded-lg border border-white/20 focus:border-white/40 focus:outline-none text-white placeholder-white/60 resize-none 
        placeholder={placeholder} transition-colors duration-200"
      >
        <div className="flex flex-wrap items-center gap-2">
          {items.map((item, index) => (
            <ChipItem key={index} item={item} index={index} />
          ))}
          {canAddMore && (
            <div className="flex-1 min-w-[120px]">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                onBlur={() => {
                  if (inputValue.trim()) {
                    addItem();
                  }
                }}
                className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none"
                placeholder={placeholder}
              />
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={addItem}
          disabled={!canAddMore || inputValue.trim() === ''}
          className="absolute bottom-2 left-2 flex items-center justify-center p-2 size-8 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 disabled:hover:scale-100 
           rounded-full transition-colors duration-200 flex-shrink-0 bg-gradient-to-r from-sunrise-500 to-sunset-500 hover:from-sunrise-600 hover:to-sunset-600 text-white font-medium"
        >
          <Plus size={16} />
        </button>
      </div>
      {maxChips && (
        <div className="text-xs text-gray-400 text-right">
          {items.length}/{maxChips} פריטים
        </div>
      )}
    </div>
  );
};
