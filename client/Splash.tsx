import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    </>
  );
};

export default Splash;
