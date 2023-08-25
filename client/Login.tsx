import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Login = () => {
  const navigate = useNavigate();
  return (
    <>
      <button className="btn btn-primary" onClick={() => navigate('/test')}>
        Click to go to /test
      </button>
    </>
  );
};

export default Login;
