import { ReactElement } from 'react';

export type Route = {
  path: string;
  goToPathOnClick?: string;
  content: ReactElement;
  icon?: ReactElement | string;
  name: string;
  isShown: boolean;
  isAdminsOnly: boolean;
  children?: Route[];
}
