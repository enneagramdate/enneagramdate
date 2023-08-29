import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import './app.css';
import Login from './Login';
import Splash from './Splash';
import Signup from './Signup';
import userStore, { EnneagramType, UserId, UserState } from './userStore';

const App = () => {
  const userId: UserId | null = userStore((state: UserState) => state.userId);
  const userType: EnneagramType | null = userStore(
    (state: UserState) => state.userType
  );
  const setUserState = userStore((state: UserState) => state.setUserState);
  console.log('if userId is null, this is true', userId === null);
  // setUserState('1', '5');
  // console.log('if userId is null, this is false', userId, userId === null);
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
