import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  useNavigate,
  Navigate,
} from 'react-router-dom';
import './app.css';
import Test from './Test';
import Login from './Login';
import Error from './Error';
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
          <Route path="/" element={<Login />} />
          <Route
            path="/test"
            element={userId ? <Test /> : <Navigate to="/" />}
          />
        </Routes>
      </Router>
    </>
  );
};

export default App;
