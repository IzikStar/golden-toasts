import { FC, useState, useEffect } from 'react';

export const FormInput: FC<{
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  rowsAmount?: number;
  min?: number;
  max?: number;
  isDisabled?: boolean;
}> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  rowsAmount,
  min,
  max,
  isDisabled,
}) => {
  const [error, setError] = useState<string | null>(null);
  const FormFieldType = rowsAmount ? 'textarea' : 'input';

  useEffect(() => {
    if (min && value.length < min && value.length > 0) {
      setError(`נדרשים לפחות ${min} תווים (${value.length})`);
    } else {
      setError(null);
    }
  }, [value, min, max]);

  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>

      <FormFieldType
        type={rowsAmount ? undefined : type}
        value={value}
        onChange={(
          e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => onChange(e.target.value)}
        className={`w-full p-2 rounded bg-white/10 border ${
          error ? 'border-red-500' : 'border-white/20'
        } ${
          isDisabled ? 'opacity-50 cursor-not-allowed' : ''
        } focus:border-white/40 focus:outline-none text-white placeholder-white/60 resize-none`}
        placeholder={placeholder}
        required={required}
        rows={rowsAmount}
        minLength={min || undefined}
        maxLength={max || undefined}
        disabled={isDisabled}
      />

      <div className="flex justify-between mt-1 text-xs">
        {error && <span className="text-red-400">{error}</span>}
      </div>
    </div>
  );
};
