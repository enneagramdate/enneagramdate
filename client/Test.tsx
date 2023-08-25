import React, { useState } from 'react';
import userStore from './stores/userStore';
import { EnneagramType } from './types';

const Test = () => {
  const userType: EnneagramType = userStore((state) => state.userType);
  return (
    <>
      <h1>Hello, your enneagram type is {userType}</h1>
    </>
  );
};

export default Test;
