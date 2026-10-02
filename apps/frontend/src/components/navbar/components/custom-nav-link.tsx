import { cn } from '@/lib/utils';
import { Route } from '@/types';
import { FC, ReactElement, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { PopoverChildrenRoutes } from './popover-children-routes';
import { useIsRouteActive } from '@/hooks';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type Props = {
  route: Route;
};

export const CustomNavLink: FC<Props> = ({ route }) => {
  const { isRouteActive } = useIsRouteActive();
  const [isHovered, setIsHovered] = useState(false);

  const generateNavLink = (route: Route): ReactElement => {
    const hoverStyles = 'text-sunrise-100 bg-sunset-600';

    return (
      <NavLink
        to={route.goToPathOnClick ?? route.path}
        style={route.children ? { pointerEvents: 'none' } : {}}
        className={() =>
          cn(
            'font-medium transition-colors duration-200 rounded-full px-[20%] h-full w-full flex items-center justify-center hover:text-sunrise-100 hover:bg-sunset-600',
            isRouteActive(route)
              ? 'bg-sunrise-500 text-dusk-600 shadow-lg hover:text-dusk-500 hover:bg-sunrise-400'
              : isHovered
              ? hoverStyles
              : 'text-sunrise-300'
          )
        }
      >
        {route.icon ?? route.name}
      </NavLink>
    );
  };

  const generateTooltipContent = () => (
    <TooltipContent
      side="bottom"
      className="bg-gradient-to-br from-dusk-600/80 via-sunset-700/60 to-dusk-500/70 border-sunset-400/30 text-sunrise-100 shadow-xl backdrop-blur-sm"
      sideOffset={8}
    >
      <span className="font-medium text-sm">{route.name}</span>
    </TooltipContent>
  );

  return (
    <li key={route.name} className="h-full w-[7%]">
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild className="h-full w-full">
            {route.children ? (
              <PopoverChildrenRoutes
                navItem={route}
                popoverTrigger={generateNavLink(route)}
                onHoverChange={(newState) => setIsHovered(newState)}
              />
            ) : (
              <div className="h-full w-full">{generateNavLink(route)}</div>
            )}
          </TooltipTrigger>
          {generateTooltipContent()}
        </Tooltip>
      </TooltipProvider>
    </li>
  );
};
