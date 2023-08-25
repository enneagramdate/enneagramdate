import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Test from './Test';
import { UserContext } from './UserContext';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/test',
    element: <Test />,
  },
  // {
  //   path: '/recs',
  //   element: <UserContext.Provider value={userId}></UserContext.Provider>,
  // },
  // {
  //   path: '/auth',
  //   element: userId ? <Home /> : <Login />,
  // },
]);

const root = createRoot(document.getElementById('root') as Element);
root.render(
  // TO-DO: remove strict mode for production
  <React.StrictMode>
    {/* <RouterProvider router={router} /> */}
    <App />
  </React.StrictMode>
);
