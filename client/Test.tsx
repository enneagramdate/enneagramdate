import React, { useState } from 'react';
import userStore from './stores/userStore';
import { EnneagramType } from './types';

const Test = () => {
  const enneagramType = userStore.use.enneagramType();
  const name = userStore.use.name();
  return (
    <>
      <div className="alert alert-success">
        Hello, {name}, your enneagram type is {enneagramType}
      </div>
    </>
  );
};

export default Test;
