import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  redirect,
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import Cookies from 'js-cookie';
import './app.css';
import Splash from './Splash';
import Signup from './Signup';
import Recs from './pages/Recs';
import { EnneagramType, UserId } from './types';
import userStore from './stores/userStore';
import MatchList from './pages/MatchList';
import Chat from './components/Chat';
import { io } from 'socket.io-client';
import { socket } from './socket';

import Login from './Login';

const App = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Splash />,
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/signup',
      element: <Signup />,
    },
    {
      path: '/recs',
      element: <Recs />,
    },
    {
      path: '/matches',
      element: <MatchList />,
    },
    {
      path: '/chat',
      element: <Chat />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
