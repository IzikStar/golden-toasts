import {
  useGetRecordQuery,
  useGetCurrentPeriodToastsAmountQuery,
} from '@/store/api/toast.api';
import { UserCard } from '@/components/user';
import { toast } from 'sonner';
import { recordStyles } from './styles.const';
import {
  calculateRankColor,
  calculateUsersRating,
  getClassNameFromRating,
} from './utils';
import { RatingIcon } from './components/rating-icon';
import { ErrorDisplay } from '../error-display';

export const Record = () => {
  const {
    data: allTime = 0,
    isLoading: loadingAllTime,
    isError: errorAllTime,
  } = useGetRecordQuery();

  const {
    data: periodData,
    isLoading: loadingPeriod,
    isError: errorPeriod,
  } = useGetCurrentPeriodToastsAmountQuery();

  const loading = loadingAllTime || loadingPeriod;
  const error = errorAllTime || errorPeriod;
  const users = periodData?.users ?? [];
  const total = periodData?.total ?? 0;
  const record = allTime;

  if (loading) {
    return (
      <div className={recordStyles.mainContainer}>
        <div className={recordStyles.loadingContainer}>
          <div className={recordStyles.loadingHeader} />
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className={recordStyles.loadingRow} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    toast.error('אופס! לא הצלחנו לקבל את נתוני הניקוד');
    return (
      <div className={recordStyles.mainContainer}>
        <div className={recordStyles.errorContainer}>
          <ErrorDisplay />
        </div>
      </div>
    );
  }

  const getProgressIcon = () => {
    if (total > record) {
      return '🏆'
    }

    if (total === record) {
      return '🎉'
    }

    if (total > record / 2) {
      return '👍'
    }

    return '😞'
  }

  return (
    <div className={recordStyles.mainContainer}>
      <div className={recordStyles.decorativeBadge}>
        <div className={recordStyles.recordScoreText}>{record}</div>
        <div className={recordStyles.recordScoreText}>
          <span role='img' aria-label='שיא'>🏆</span>
        </div>
      </div>

      <div className={recordStyles.contentWrapper}>
        <h1 className={recordStyles.headerSection}>
          <span
            className={recordStyles.currentScoreText}
            style={{ color: calculateRankColor(record, total) }}
          >
            {`ניקוד נוכחי: ${total} ${getProgressIcon()}`}
          </span>
        </h1>

        <div
          className={recordStyles.usersListContainer}
          style={recordStyles.usersListStyle}
          tabIndex={-1}
        >
          {users.length > 0 ? (
            calculateUsersRating(users).map((user) => (
              <div
                key={user.id}
                className={`${
                  recordStyles.userRowBase
                } ${getClassNameFromRating(user.rating)}`}
                style={recordStyles.userRowStyle}
              >
                <UserCard
                  user={user}
                  className="max-w-[90%] w-fit bg-transparent border-none shadow-none"
                  hoverClassName='hover:text-white transition-all duration-100'
                />
                <div className="flex justify-end gap-3 items-center">
                  <span
                    className={`${recordStyles.userScoreText} ${
                      user.toastsCount ? 'text-white' : 'text-red-700'
                    }`}
                  >
                    {user.toastsCount}
                  </span>
                  <RatingIcon rating={user.rating} />
                </div>
              </div>
            ))
          ) : (
            <div className={recordStyles.noDataText}>אין נתונים להצגה</div>
          )}
        </div>
      </div>
    </div>
  );
};
