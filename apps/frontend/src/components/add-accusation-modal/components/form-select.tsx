import { FC } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const FormSelect: FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value?: string }[];
  required?: boolean;
  placeholder?: string;
}> = ({ label, value, onChange, options, required, placeholder }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <Select
      dir="rtl"
      value={value}
      onValueChange={onChange}
      required={required}
    >
      <SelectTrigger className="w-full p-2 rounded bg-white/10 border border-white/20 focus:border-white/40 focus:outline-none text-white focus:ring-0 focus:ring-offset-0 data-[placeholder]:text-white/70">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-dusk-600 border border-white/20 max-h-60 overflow-y-auto">
        {options.map(({ label, value: optionValue }) => (
          <SelectItem
            key={label}
            value={optionValue && optionValue !== 'ללא שתייה קשורה' ? optionValue : 'ללא שתייה קשורה'}
            className="text-white hover:bg-white/10 focus:bg-white/10 cursor-pointer"
          >
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);
