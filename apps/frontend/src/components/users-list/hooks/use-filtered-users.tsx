import { User } from '@/types';
import { useMemo } from 'react';

export const useFilteredUsers = (users: User[], searchTerm: string) => {
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) {
      return users;
    }

    const searchLower = searchTerm.toLowerCase().trim();

    const filterUser = (user: User) =>
      user.username.toLowerCase().includes(searchLower);

    return users.filter(filterUser);
  }, [users, searchTerm]);

  return filteredUsers;
};
