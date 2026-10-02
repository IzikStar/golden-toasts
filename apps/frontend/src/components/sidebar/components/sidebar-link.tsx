import { cn } from '@/lib/utils';
import { Route } from '@/types';
import { FC } from 'react';
import { NavLink } from 'react-router-dom';

type Props = {
  route: Route;
};

export const SidebarLink: FC<Props> = ({ route }) => {
  return (
    <li key={route.name} className="group flex-shrink-0">
      <NavLink
        to={route.path}
        className={({ isActive }) =>
          cn(
            'relative flex items-center gap-1 lg:gap-3 px-1 lg:px-4 py-2 lg:py-3 rounded-xl transition-all duration-300 group-hover:animate-scale-bounce transform min-w-0',
            'font-medium text-xs lg:text-sm border border-transparent',
            'before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-0 before:bg-gradient-to-b before:from-sunrise-400 before:to-sunrise-500 before:rounded-r-full before:transition-all before:duration-300',
            'hover:shadow-warm hover:animate-hover-lift',
            'overflow-x-auto scrollbar-theme',
            isActive
              ? 'bg-gradient-to-r from-sunrise-500/20 to-sunset-500/20 text-sunrise-100 border-sunrise-500/30 shadow-lg shadow-sunrise-500/10 before:h-6 lg:before:h-8 animate-fade-soft'
              : 'text-sunrise-200/80 hover:text-sunrise-100 hover:bg-gradient-to-r hover:from-sunset-600/50 hover:to-dusk-500/30 hover:border-sunset-500/50 hover:shadow-md hover:before:h-3 lg:hover:before:h-4'
          )
        }
      >
        <div className="w-4 h-4 lg:w-5 lg:h-5 rounded-md flex items-center justify-center text-xs font-bold transition-colors duration-300 bg-sunset-600/60 text-sunrise-200 group-hover:bg-sunrise-500/30 group-hover:text-white group-hover:animate-pulse-smooth">
          {route.icon}
        </div>

        <span
          className="flex-1 text-wrap min-w-0 text-right animate-slide-in-right"
          dir="rtl"
        >
          {route.name}
        </span>

        <div className="hidden lg:flex w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full transition-all duration-300 bg-transparent group-hover:bg-sunrise-400/60 flex-shrink-0" />
      </NavLink>
    </li>
  );
};
