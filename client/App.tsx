import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import './app.css';
import Test from './Test';
import FakeHome from './FakeHome';
import Recs from './pages/Recs';
import { EnneagramType, UserId } from './types';
import userStore from './stores/userStore';
import MatchList from './MatchList';

const App = () => {
  const userId: UserId | null = userStore.use.elementId();
  // * use to selectively color the UI depending on the user's type
  const userType: EnneagramType | null = userStore.use.enneagramType();
  const setUserState = userStore.use.setUserState();
  // console.log('if userId is null, this is true', userId === null);
  setUserState('1', '5', 'Jeff', 25, ['fake1.png', 'fake2.png', 'fake3.png']);
  // console.log('userId is now', userId);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<FakeHome />} />
          <Route
            path="/test"
            element={userId ? <Test /> : <Navigate to="/" />}
          />
          // * protect this route when we have fullstack auth
          <Route path="/recs" element={<Recs />} />
          <Route path="/matches" element={<MatchList />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
