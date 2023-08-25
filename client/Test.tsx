import React, { useState } from 'react';
import userStore from './stores/userStore';
import { EnneagramType } from './types';

const Test = () => {
  const userType: EnneagramType = userStore((state) => state.userType);
  return (
    <>
      <div className="alert alert-success">
        Hello, your enneagram type is {userType}
      </div>
    </>
  );
};

export default Test;
