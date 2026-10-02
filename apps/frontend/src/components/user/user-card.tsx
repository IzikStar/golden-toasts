import { FC } from 'react';
import { User } from '@/types';
import { ShieldCheck, SkullIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MyTooltip } from '../tooltip';
import { useNavigate } from 'react-router-dom';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';

type UserCardProps = {
  user: User;
  className?: string;
  iconSize?: number | string;
  textClassName?: string;
  hoverClassName?: string;
  textHoverClassName?: string;
  tooltipClassName?: string;
  variant?: 'default' | 'inline';
  navigateTo?: 'toasts' | 'accusations';
  clickable?: boolean;
};

export const UserCard: FC<UserCardProps> = ({
  user,
  className,
  iconSize = 12,
  textClassName = 'text-sm',
  hoverClassName,
  textHoverClassName,
  tooltipClassName,
  variant = 'default',
  navigateTo = 'toasts',
  clickable = true,
}) => {
  const { id, username, isAdmin, isPersonaNonGrata } = user;
  const navigate = useNavigate();
  const currentUser = useSelector(({ auth }: RootState) => auth.decodedToken);
  const isCurrentUserAdmin = currentUser?.isAdmin ?? false;
  const allowClick = clickable && isCurrentUserAdmin;

  const goToUserProfilePage = () => {
    if (allowClick) {
      navigate(`/other-user-profile/${id}/${navigateTo}`);
    }
  };

  if (variant === 'inline') {
    return (
      <div
        onClick={goToUserProfilePage}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            goToUserProfilePage();
          }
        }}
        className={cn(
          'flex items-center gap-2 ',
          allowClick &&
            'cursor-pointer hover:ring-error hover:ring-1 rounded-md',
          className
        )}
        tabIndex={allowClick ? 0 : -1}
      >
        <span className="font-medium">
          {username}{' '}
          <span className="text-sunset-500 font-bold">
            {currentUser?.id === id ? ' (את/ה)' : ''}
          </span>
        </span>
        {isAdmin && (
          <ShieldCheck size={iconSize} className="text-sunrise-400" />
        )}
        {isPersonaNonGrata && (
          <SkullIcon size={iconSize} className="text-red-500" />
        )}
      </div>
    );
  }

  return (
    <div
      onClick={goToUserProfilePage}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          goToUserProfilePage();
        }
      }}
      dir="rtl"
      className={cn(
        'flex items-center justify-start px-3 py-1.5',
        'bg-sunrise-50 text-dusk-600 border border-sunrise-200',
        'rounded-xl shadow-sm w-fit',
        allowClick && 'cursor-pointer',
        className,
        allowClick && hoverClassName
      )}
      tabIndex={allowClick ? 0 : -1}
    >
      <span
        className={cn(
          'font-medium text-3xl truncate',
          textClassName,
          allowClick && textHoverClassName
        )}
      >
        {username}{' '}
        <span className="text-sunset-600 font-bold">
          {currentUser?.id === id ? ' (את/ה)' : ''}
        </span>
      </span>

      <div className="flex gap-1 items-center ms-3">
        {isAdmin && (
          <MyTooltip
            content="מנהל"
            icon={<ShieldCheck size={iconSize} />}
            bgColor="bg-sunrise-400"
            tooltipClassName={cn(
              'bg-gradient-to-br from-dusk-600/80 via-sunset-700/60 to-dusk-500/70 border-sunset-400/30 text-sunrise-100 shadow-xl backdrop-blur-sm',
              tooltipClassName
            )}
          />
        )}
        {isPersonaNonGrata && (
          <MyTooltip
            content="פרסונה נון גרטה"
            icon={<SkullIcon size={iconSize} />}
            bgColor="bg-red-500"
            tooltipClassName={cn(
              'bg-gradient-to-br from-dusk-600/80 via-sunset-700/60 to-dusk-500/70 border-sunset-400/30 text-sunrise-100 shadow-xl backdrop-blur-sm',
              tooltipClassName
            )}
          />
        )}
      </div>
    </div>
  );
};
