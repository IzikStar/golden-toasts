import { Route } from '@/types';
import { Popover, PopoverTrigger, PopoverContent } from '../../ui/popover';
import { FC, ReactElement, useState } from 'react';
import { useIsRouteActive } from '@/hooks';
import { NavLink } from 'react-router-dom';

type Props = {
  navItem: Route;
  popoverTrigger: ReactElement;
  onHoverChange?: (isHovered: boolean) => void;
};

export const PopoverChildrenRoutes: FC<Props> = ({
  navItem: route,
  popoverTrigger: trigger,
  onHoverChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isRouteActive } = useIsRouteActive();

  const handleMouseEnter = () => {
    if (!isRouteActive(route)) {
      setIsOpen(true);
    }
    onHoverChange?.(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
    onHoverChange?.(false);
  };

  return (
    <Popover open={isOpen}>
      <div className="relative w-full h-full">
        <PopoverTrigger
          className="w-full h-full flex justify-center items-center focus:outline-none"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          tabIndex={-1}
        >
          {trigger}
        </PopoverTrigger>

        <PopoverContent
          className="
            w-auto min-w-[200px] p-2
            bg-gradient-to-br from-dusk-600/80 via-sunset-700/60 to-dusk-500/70
            backdrop-blur-sm
            shadow-sm rounded-lg shadow-sunrise-300
            animate-in fade-in-0 zoom-in-95 duration-150
          "
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleMouseLeave}
          sideOffset={8}
        >
          <div className="space-y-1">
            {route.children?.map((childRoute) => {
              return (
                <NavLink
                  key={childRoute.name}
                  className="
                    block w-full px-3 py-2 rounded-md
                    hover:shadow-sm hover:shadow-sunrise-100
                    text-white text-sm
                    hover:bg-sunset-700 hover:text-sunrise-500 hover:font-bold
                    transition-colors duration-150
                    focus:outline-none focus-visible:ring-0 focus:ring-2 focus:ring-sunset-700
                  "
                  to={`${route.path}/${childRoute.path}`}
                >
                  {childRoute.name}
                </NavLink>
              );
            })}
          </div>
        </PopoverContent>
      </div>
    </Popover>
  );
};
