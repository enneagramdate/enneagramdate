import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Login = () => {
  const navigate = useNavigate();
  return (
    <>
      <button className="btn btn-primary" onClick={() => navigate('/recs')}>
        Click to go to /recs
      </button>
    </>
  );
};

export default Login;
