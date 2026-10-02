import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { Route } from '@/types';
import { CustomNavLink } from './components/custom-nav-link';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

type Props = {
  routes: Route[];
};

export const Navbar: FC<Props> = ({ routes }) => {
  const isAdmin = useSelector(
    ({ auth }: RootState) => auth.decodedToken?.isAdmin ?? false
  );

  return (
    <nav className="bg-dusk-500 text-sunrise-500 shadow-md border-b border-[10%] border-sunset-500 h-full w-full">
      <div className="w-full flex flex-row items-center justify-between h-full gap-3">
        <ul className="flex flex-wrap gap-2 h-[80%] w-[65%] items-center px-3">
          {routes
            .filter(
              (route: Route) =>
                route.isShown && (!route.isAdminsOnly || isAdmin)
            )
            .map((route: Route) => (
              <CustomNavLink key={route.name} route={route} />
            ))}
        </ul>
        <div className="flex items-center justify-end gap-[10%] h-full w-[35%]">
          <NavLink to={'/'} className="flex items-center h-full w-[60%]">
            <img
              src="/logo.svg"
              alt="GoldenToasts Logo"
              className="h-full w-full object-contain"
            />
          </NavLink>
        </div>
      </div>
    </nav>
  );
};
