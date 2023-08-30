import React, { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';

const Matches = (): ReactElement => {
  const navigate = useNavigate();
  return (
    <>
      <div className=" rounded-xl mt-2 w-11/12 bg-primary flex justify-between items-center">
        <a className="flex items-center w-full">
          <img
            className=" rounded-tl-xl rounded-bl-xl w-10"
            src={require('../pug.jpg')}
          />
          <p>Full Name</p>
        </a>
        <button>Button</button>
      </div>
    </>
  );
};
export default Matches;
