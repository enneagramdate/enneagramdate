import React from 'react';
import userStore from './stores/userStore';

const Test = () => {
  const enneagramType = userStore.use.enneagramType();
  const name = userStore.use.name();

  return (
    // <div className="flex items-center justify-center">
    //   <p>is this centered?</p>
    // </div>
    <div className="border-solid border-2 border-sky-500">
      hi my name is supreet?
      <div className="flex items-center justify-center border border-white">
        <div className="alert alert-success">
          Hello, {name}, your enneagram type is {enneagramType}
        </div>
      </div>
    </div>
  );
};

export default Test;
