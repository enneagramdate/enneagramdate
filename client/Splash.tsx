import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Splash = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="bg-primary text-primary-content flex items-center justify-center h-full">
        <div>
          <h1 className="text-white text-8xl">Wingman</h1>
          <div className="flex items-center justify-between">
            <button
              className="btn btn-secondary text-white w-1/3"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
            <button
              className="btn btn-secondary text-white w-1/3"
              onClick={() => navigate('/signup')}
            >
              Signup
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Splash;
