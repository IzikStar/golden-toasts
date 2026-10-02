import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';

type InputProps = {
  label: string;
  placeholder: string;
  type: 'text' | 'password';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: string | null;
};

export const Input = ({
  label,
  placeholder,
  type,
  value,
  error,
  onChange,
}: InputProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(
    type !== 'password'
  );

  return (
    <div className="flex flex-col gap-1 h-16">
      <label
        className="text-sm font-medium text-white text-opacity-90"
        htmlFor={label}
      >
        {label}
      </label>
      <div className="flex relative">
        <input
          type={showPassword ? 'text' : 'password'}
          id={label}
          className={`w-full p-2 ${
            type === 'password' ? 'pl-10' : ''
          } text-black rounded-xl backdrop-blur-sm transition-all duration-200 ${
            error !== null
              ? 'border-2 border-error focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-error'
              : 'border-2 border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 hover:border-white hover:border-opacity-50'
          }`}
          placeholder={placeholder}
          required
          value={value}
          onChange={onChange}
        />
        {type === 'password' &&
          (showPassword ? (
            <EyeOffIcon
              onClick={() => setShowPassword(false)}
              className="cursor-pointer absolute left-3 top-3 w-5 h-5 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            />
          ) : (
            <EyeIcon
              onClick={() => setShowPassword(true)}
              className="cursor-pointer absolute left-3 top-3 w-5 h-5 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            />
          ))}
      </div>
      {error && (
        <p className="text-error text-sm leading-none pt-0 pr-1">{error}</p>
      )}
    </div>
  );
};
