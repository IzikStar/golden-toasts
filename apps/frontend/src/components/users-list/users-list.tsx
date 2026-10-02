import { User } from '@/types';
import { FC, useState } from 'react';
import { usersListStyles } from './styles.consts';
import { Search } from 'lucide-react';
import { useFilteredUsers } from './hooks/use-filtered-users';
import { UserCard } from '../user/user-card';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { LoadingSpinner } from '../loading-spinner';
import { ErrorDisplay } from '../error-display';

type Props = {
  users: User[];
  isLoading: boolean;
  error: FetchBaseQueryError | SerializedError | undefined;
};

export const UsersList: FC<Props> = ({ users, isLoading, error }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredUsers = useFilteredUsers(users, searchTerm);

  const renderUsers = () => {
    return filteredUsers.map((user: User) => (
      <div key={user.id} className={usersListStyles.cardWrapper} dir="rtl">
        <UserCard
          user={user}
          className="bg-transparent ring-0 w-full text-white border-none hover:ring-error hover:ring-1"
          navigateTo="accusations"
        />
      </div>
    ));
  };

  const renderSearchBar = () => {
    if (users.length === 0) {
      return null;
    }

    return (
      <div className={usersListStyles.searchContainer}>
        <div className={usersListStyles.searchWrapper}>
          <Search className={usersListStyles.searchIcon} />
          <input
            type="text"
            placeholder="חפש משתמש..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={usersListStyles.searchInput}
          />
        </div>
      </div>
    );
  };

  const renderContent = () => {
    return isLoading ? (
      <LoadingSpinner />
    ) : error ? (
      <div className={usersListStyles.errorWrapper}>
        <ErrorDisplay />
      </div>
    ) : filteredUsers.length ? (
      renderUsers()
    ) : searchTerm ? (
      <p className={usersListStyles.noToastMessage}>
        לא נמצאו תוצאות עבור "{searchTerm}". נסה טקסט חיפוש אחר
      </p>
    ) : (
      <p className={usersListStyles.noToastMessage}>{'אין תוצאות להצגה'}</p>
    );
  };

  return (
    <section className={usersListStyles.container}>
      {renderSearchBar()}

      <div
        style={{
          direction: 'ltr',
        }}
        className={usersListStyles.listWrapper}
        aria-live="polite"
        aria-relevant="additions"
      >
        {renderContent()}
      </div>
    </section>
  );
};
