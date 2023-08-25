import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import './app.css';
import Test from './Test';
import Login from './Login';
import Recs from './components/Recs';
import { EnneagramType, UserId } from './types';
import userStore from './stores/userStore';

const App = () => {
  const userId: UserId = userStore.use.userId();
  // // use to selectively color the UI depending on the user's type
  const userType: EnneagramType = userStore.use.userType();
  const setUserState = userStore.use.setUserState();
  console.log('if userId is null, this is true', userId === null);
  setUserState('1', '5');
  console.log('if userId is null, this is false', userId, userId === null);
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
