import React from 'react';
import userStore from './stores/userStore';

const Test = () => {
  const enneagramType = userStore.use.enneagramType();
  const name = userStore.use.name();

  const imgUrl =
    'https://miro.medium.com/v2/resize:fill:176:176/1*TzfP1ghe_d994dWtFWvaGg.jpeg';
  return (
    // <div className="flex items-center justify-center">
    //   <p>is this centered?</p>
    // </div>
    <div className="border-solid border-2 border-sky-500">
      do you see this?
      {/* <div className="flex items-center justify-center border border-white">
        <div className="alert alert-success">
          Hello, {name}, your enneagram type is {enneagramType}
        </div>
        <div className="h-96 carousel carousel-vertical carousel-center rounded-box">
          <div className="carousel-item h-full">
            <img src={imgUrl} />
          </div>
          <div className="carousel-item h-full">
            <img src={imgUrl} />
          </div>
          <div className="carousel-item h-full">
            <img src={imgUrl} />
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Test;
