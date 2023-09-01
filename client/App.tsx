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

// TODO: for production, just can instantiate like const socket = io(), only need this domain for dev mode
import Login from './Login';

const App = () => {
  //const userId: UserId | null = userStore.use.info.elementId();
  // * use to selectively color the UI depending on the user's type
  //const userType: EnneagramType | null = userStore.use.info.enneagramType();
  const setUserState = userStore.use.setUserState();

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
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
