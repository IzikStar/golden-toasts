import { User } from '@/types';
import { FC } from 'react';
import { SelectableUserCard } from './';

type Props = {
  users: User[];
  selectedUsers: User['id'][];
  onSelectionChange: (userIds: string[]) => void;
};

export const InvitationsSection: FC<Props> = ({
  users,
  selectedUsers,
  onSelectionChange,
}) => {
  const toggleUser = (userId: string) => {
    const isCurrentlySelected = selectedUsers.includes(userId);
    const newSelection = isCurrentlySelected
      ? selectedUsers.filter((id) => id !== userId)
      : [...selectedUsers, userId];

    onSelectionChange(newSelection);
  };

  const selectAll = () => {
    onSelectionChange(users.map((user) => user.id));
  };

  const selectNone = () => {
    onSelectionChange([]);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-medium">הזמנות</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={selectAll}
            className="text-xs text-sunrise-300 hover:text-sunrise-200"
          >
            בחר הכל
          </button>
          <span className="text-white/40">|</span>
          <button
            type="button"
            onClick={selectNone}
            className="text-xs text-white/60 hover:text-white/80"
          >
            בטל הכל
          </button>
        </div>
      </div>
      <div className='overflow-y-auto scrollbar-theme pr-1' dir='ltr'>
        <div className={`space-y-2 max-h-40`} dir='rtl'>
          {users?.map((user) => (
            <SelectableUserCard
              key={user.id}
              user={user}
              isSelected={selectedUsers.includes(user.id)}
              onToggle={toggleUser}
            />
          ))}
        </div>
      </div>

      <div className="mt-2 text-xs text-sunrise-300">
        {selectedUsers.length > 0
          ? `נבחרו ${selectedUsers.length} מתוך ${users?.length || 0} משתמשים`
          : 'לא נבחרו משתמשים'}
      </div>
    </div>
  );
};
