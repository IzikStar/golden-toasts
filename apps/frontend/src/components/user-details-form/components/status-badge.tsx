import React from 'react';

interface Props {
  isActive: boolean;
  label: string;
  activeColor?: string;
}

export const StatusBadge: React.FC<Props> = ({
  isActive,
  label,
  activeColor = 'bg-green-500',
}) => (
  <div
    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
      isActive ? `${activeColor} text-white` : 'bg-gray-200 text-gray-700'
    }`}
  >
    {label}
  </div>
);
