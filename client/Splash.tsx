import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { populateDB } from './data/fake/generateFakeUsers';
const Splash = () => {
  const navigate = useNavigate();
  return (
    <>
      <h1>EnneagramDate</h1>
      <button className="btn" onClick={() => navigate('/login')}>
        Login
      </button>
      <button className="btn" onClick={() => navigate('/signup')}>
        Signup
      </button>
      <button
        className="btn"
        onClick={async () => {
          populateDB();
        }}
      >
        Get some fake users
      </button>
    </>
  );
};

export default Splash;
