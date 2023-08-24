import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
]);

const root = createRoot(document.getElementById('root') as Element);
root.render(
  // TO-DO: remove strict mode for production
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
