import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import './app.css';
import Test from './Test';
import Login from './Login';
import Recs from './pages/Recs';
import { EnneagramType, UserId } from './types';
import userStore from './stores/userStore';

const App = () => {
  const userId: UserId = userStore.use.id();
  // * use to selectively color the UI depending on the user's type
  const userType: EnneagramType = userStore.use.enneagramType();
  const setUserState = userStore.use.setUserState();
  // console.log('if userId is null, this is true', userId === null);
  setUserState('1', '5', 'Jeff', 25, ['fake1.png', 'fake2.png', 'fake3.png']);
  // console.log('userId is now', userId);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/test"
            element={userId ? <Test /> : <Navigate to="/" />}
          />
          <Route path="/recs" element={<Recs />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
