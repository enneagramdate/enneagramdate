import React, { useState } from 'react';
import useUserStore from './userStore';
import { EnneagramType } from './userStore';

const Test = () => {
  const userType: EnneagramType | null = useUserStore(
    (state) => state.userType
  );
  return (
    <>
      <h1>Hello, your enneagram type is {userType}</h1>
    </>
  );
};

export default Test;
