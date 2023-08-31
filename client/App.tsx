import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import './app.css';
import Splash from './Splash';
import Signup from './Signup';
import Recs from './pages/Recs';
import { EnneagramType, UserId } from './types';
import userStore from './stores/userStore';
import MatchList from './MatchList';
import Login from './Login';

const App = () => {
  //const userId: UserId | null = userStore.use.info.elementId();
  // * use to selectively color the UI depending on the user's type
  //const userType: EnneagramType | null = userStore.use.info.enneagramType();
  const setUserState = userStore.use.setUserState();

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/recs" element={<Recs />} />
          <Route path="/matches" element={<MatchList />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
