import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  useNavigate,
} from 'react-router-dom';
import './app.css';
import Test from './Test';
import Login from './Login';

const App = () => {
  // import zustand state here
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/test" element={<Test />} />
        </Routes>
        {/* <button className="btn">Test</button> */}
      </Router>
    </>
  );
};

export default App;
