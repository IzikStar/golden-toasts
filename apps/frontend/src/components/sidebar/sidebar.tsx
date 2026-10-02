import { FC } from 'react';
import { Route, User } from '@/types';
import { SidebarLink } from './components';

type Props = {
  routes: Route[];
  user: User;
  isCurrentUser: boolean;
};

export const Sidebar: FC<Props> = ({ routes, user, isCurrentUser }) => {
  return (
    <div className="w-full flex flex-col justify-between h-full overflow-y-clip bg-gradient-to-b from-dusk-500 via-sunset-700 to-dusk-600 border-r border-sunset-600/50 shadow-2xl">
      <div className="p-4 lg:p-6 border-b border-sunset-600/50 bg-gradient-to-r from-dusk-500/80 to-transparent flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="lg:flex hidden md:flex max-w-[30%] max-h-[5%] w-8 h-8 lg:w-10 lg:h-10 rounded-full animate-wave-gradient items-center justify-center text-white font-semibold text-xs lg:text-sm shadow-lg bg-gradient-wave">
            {user.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex flex-col overflow-x-auto scrollbar-theme">
            <span className="text-sunrise-200 font-medium text-xs lg:text-sm text-wrap break-words">
              {user.username || 'User'}
            </span>
            <span className="text-sunrise-300/70 text-xs truncate">
              {user?.description
                ? user.description
                : isCurrentUser
                ? 'את/ה'
                : 'ללא סטטוס'}
            </span>
          </div>
        </div>
      </div>

      <nav
        style={{ direction: 'ltr' }}
        className="flex-1 p-3 lg:p-4 overflow-y-auto scrollbar-theme min-h-0"
      >
        <ul
          style={{ direction: 'rtl' }}
          className="flex flex-col gap-2 lg:gap-2"
        >
          {routes
            .filter((route: Route) => route.isShown)
            .map((route: Route) => (
              <SidebarLink key={route.name} route={route} />
            ))}
        </ul>
      </nav>

      <div className="px-[5%] lg:px-4 h-[10%] mb-[10%] overflow-y-clip scrollbar-theme border-t border-sunset-600/50 bg-gradient-to-r from-dusk-500/50 to-transparent flex-shrink-0 justify-center items-center">
        <div className="flex justify-between text-xs text-center align-middle leading-normal text-sunrise-300/70 min-w-0 w-full h-full items-center animate-fade-in-up">
          <span className="truncate">GoldenToasts</span>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-gold-400 animate-pulse-smooth" />
            <span className="text-[0.5rem] lg:text-[0.6rem] whitespace-nowrap max-w-[80%] lg:max-w-[90%] truncate">
              {isCurrentUser ? 'עמוד פרופיל' : 'עמוד ניהול'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
