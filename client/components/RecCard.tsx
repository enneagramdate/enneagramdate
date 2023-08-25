import React from 'react';
import { HiCheck, HiXMark } from 'react-icons/hi2';
import { User, Swipe } from '../types';
import recsStore from '../stores/recsStore';

const RecCard = (user: User) => {
  // destructure user information from props
  const { id, enneagramType, name, age, imgUrl } = user;
  // import recs state so handleSwipe can update it
  const recs = recsStore.use.recs();
  const setRecs = recsStore.use.setRecs();
  // declare a function to handleSwipe
  const handleSwipe = (swipe: Swipe) => {
    // determine the user's decision
    const outcome = swipe === 'like' ? 'like' : 'dislike';
    // * ping DB to update relationship accordingly -- better option would be to update the DB in batches, rather than on every swipe to increase performance and UX
    // update state to remove the user that was just swiped
  };

  return (
    <div className="card w-96 bg-primary text-primary-content">
      <figure>
        <img
          // TODO: replace fake src with imgUrl
          src="https://purrfectcatbreeds.com/wp-content/uploads/2014/06/abyssinian-main.jpg"
          alt="a really nice person, I bet"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {name}, {age}
        </h2>

        <h3 className="card-title">{enneagramType}</h3>
        <div className="card-actions">
          <button
            className="btn btn-error btn-circle justify-left"
            onClick={() => handleSwipe('dislike')}
          >
            <HiXMark />
          </button>
          <button
            className="btn btn-primary btn-circle justify-right"
            onClick={() => handleSwipe('like')}
          >
            <HiCheck />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecCard;
