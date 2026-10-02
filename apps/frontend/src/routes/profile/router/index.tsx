import { Route } from '@/types';
import { UserDetails, UserToasts, UserAccusations } from '../routes';

const baseRoutes: Omit<Route, 'name'>[] = [
  {
    path: 'toasts',
    content: <UserToasts />,
    isShown: true,
    isAdminsOnly: false,
    icon: '🍻'
  },
  {
    path: 'accusations',
    content: <UserAccusations />,
    isShown: true,
    isAdminsOnly: false,
    icon: '🕵️‍♂️'
  },
  {
    path: 'edit',
    content: <UserDetails />,
    isShown: true,
    isAdminsOnly: false,
    icon: '⚙️'
  },
];

export const profileRoutes: Route[] = baseRoutes.map((route, index) => ({
  ...route,
  name: ['השתיות שלי', 'הפשעים שלי', 'פרופיל'][index],
}));

export const otherUserProfileRoutes: Route[] = baseRoutes.map(
  (route, index) => ({
    ...route,
    name: ['שתיות', 'פשעים', 'פרופיל'][index],
  })
);
