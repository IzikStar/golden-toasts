import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout, Login, Signup } from './routes';
import { routes } from './router';
import { Provider } from 'react-redux';
import { store } from './store';
import { AnimationDots } from './components/animation-dots';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: routes.map((route) => ({
      path: route.path,
      element: route.content,
      children: route.children?.map(({ path, content: element }) => ({
        path,
        element,
      })),
    })),
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Signup />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <Provider store={store}>
      <main className="text-right w-full h-screen md:overflow-y-hidden overflow-hidden relative z-0 bg-contain bg-gradient-wave">
        <RouterProvider router={router} />
        <AnimationDots />
      </main>
    </Provider>
  </StrictMode>
);
