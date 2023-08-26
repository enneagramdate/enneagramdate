import React from 'react';
import { HiCheck, HiXMark } from 'react-icons/hi2';
import { User, Swipe, UserId } from '../types';
import recsStore from '../stores/recsStore';

const RecCard = (user: User) => {
  // destructure user information from props
  const { id, enneagramType, name, age, imgUrl } = user;
  // import recs state so handleSwipe can update it
  const recs: User[] = recsStore.use.recs();
  const removeOneRec = recsStore.use.removeOneRec();

  // declare a function to handleSwipe
  const handleSwipe = (swipe: Swipe, swipedUserId: UserId) => {
    // determine the user's decision
    const outcome = swipe === 'like' ? 'like' : 'dislike';
    // * ping DB to update relationship accordingly -- better option would be to update the DB in batches, rather than on every swipe to increase performance and UX
    // update state to remove the user that was just swiped
    //const updatedState = new Map(recs);
    // updatedState.delete(swipedUserId);
    // // call removeOneRec -- does it need to be passed anything? currently, no
    // removeOneRec(updatedState);
    const updatedState = [...recs];
    updatedState.pop();
    removeOneRec(updatedState);
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
            onClick={() => handleSwipe('dislike', '_39572397')}
          >
            <HiXMark />
          </button>
          <button
            className="btn btn-primary btn-circle justify-right"
            onClick={() => handleSwipe('like', '_+932752097')}
          >
            <HiCheck />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecCard;
