import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Error = () => {
  const navigate = useNavigate();
  return (
    <>
      <p> ERROR NOT LOGGED IN</p>
      <button className="btn" onClick={() => navigate('/')}>
        Click to go to the main page
      </button>
    </>
  );
};

export default Error;
