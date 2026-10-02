import { Route } from '@/types';
import { useLocation } from 'react-router-dom';

export const useIsRouteActive = () => {
  const location = useLocation();

  const isRouteActive = (route: Route) =>
    route.goToPathOnClick
      ? location.pathname.indexOf(route.path) === 0
      : location.pathname === route.path;

  return { isRouteActive };
};
