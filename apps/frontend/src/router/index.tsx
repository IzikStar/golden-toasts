import { Home } from '../routes';
import { NotFoundPage } from '@/components/not-found';
import HomeIcon from '@mui/icons-material/Home';
import { Profile } from '@/routes/profile/profile.route';
import { MailIcon, ShieldCheck, User2Icon } from 'lucide-react';
import { OtherUserProfile } from '@/routes/profile/other-user-profile.route';
import { Route } from '@/types';
import { otherUserProfileRoutes, profileRoutes } from '@/routes/profile/router';
import { Admin } from '@/routes/admin';
import { Invites } from '@/routes/invites';

export const routes: Route[] = [
  {
    path: '/',
    content: <Home />,
    name: 'בית',
    icon: (
      <HomeIcon
        sx={{
          '& svg': {
            width: '5vh',
            height: '5vh',
          },
          padding: 0,
          height: '100%',
          width: '100%',
        }}
      />
    ),
    isShown: true,
    isAdminsOnly: false,
  },
  {
    path: '/profile',
    content: <Profile />,
    goToPathOnClick: '/profile/edit',
    name: 'פרופיל',
    icon: (
      <User2Icon
        style={{
          padding: 0,
          height: '100%',
          width: '100%',
        }}
      />
    ),
    isShown: true,
    children: profileRoutes,
    isAdminsOnly: false,
  },
  {
    path: '/other-user-profile/:userId',
    content: <OtherUserProfile />,
    goToPathOnClick: '/other-user-profile/:userId/toasts',
    name: 'עמוד משתמש',
    isShown: false,
    children: otherUserProfileRoutes,
    isAdminsOnly: true,
  },
  {
    path: '/invites',
    content: <Invites />,
    name: 'הזמנות',
    icon: (
      <MailIcon
        style={{
          height: '100%',
          width: '100%',
        }}
      />
    ),
    isShown: true,
    isAdminsOnly: false,
  },
  {
    path: '/admin',
    content: <Admin />,
    name: 'ניהול',
    icon: (
      <ShieldCheck
        style={{
          height: '100%',
          width: '100%',
        }}
      />
    ),
    isShown: true,
    isAdminsOnly: true,
  },
  {
    path: '*',
    content: <NotFoundPage />,
    name: 'לא נמצא',
    isShown: false,
    isAdminsOnly: false,
  },
];
