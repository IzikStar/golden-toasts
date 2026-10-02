import { UserCard } from '@/components/user';
import { User } from '@/types';
import { Check } from 'lucide-react';
import { FC } from 'react';

export const SelectableUserCard: FC<{
  user: User;
  isSelected: boolean;
  onToggle: (userId: string) => void;
}> = ({ user, isSelected, onToggle }) => (
  <div
    className={`w-full flex items-center justify-between p-2 rounded-lg border cursor-pointer hover:bg-white/5 ${
      isSelected
        ? 'border-sunrise-300 bg-sunrise-500/10'
        : 'border-white/20 bg-white/5'
    }`}
    onClick={() => onToggle(user.id)}
  >
    <UserCard
      user={user}
      clickable={false}
      className="bg-transparent text-white min-w-fit max-w-[80%] border-none"
    />
    <div
      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
        isSelected ? 'border-sunrise-300 bg-sunrise-500' : 'border-white/40'
      }`}
    >
      {isSelected && <Check size={12} className="text-white" />}
    </div>
  </div>
);
