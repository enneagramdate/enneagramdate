import React from 'react';
import { HiCheck, HiXMark } from 'react-icons/hi2';
import { User, Swipe, UserId, RecId, SwipeCache } from '../types';
import recsStore from '../stores/recsStore';
import userStore from '../stores/userStore';

const RecCard = (user: User) => {
  // destructure user information from props
  const { id, enneagramType, name, age, imgUrl } = user;
  // import recs state so handleSwipe can update it
  const recs: User[] = recsStore.use.recs();
  const removeOneRec = recsStore.use.removeOneRec();
  const swipes: SwipeCache = userStore.use.swipes();
  const updateSwipes = userStore.use.updateSwipes();
  const clearSwipes = userStore.use.clearSwipes();

  console.log('HERE ARE THE STORED SWIPES FOR BATCH INSERT', swipes);
  console.log('HERE IS THE  NUMBER OF SWIPES STORED', swipes.size);

  // declare a function to handleSwipe
  const handleSwipe = (swipe: Swipe, swipedUserId: UserId) => {
    // * determine the user's decision
    const outcome = swipe === 'like' ? 'like' : 'dislike';
    // * ping DB to update relationship accordingly -- better option would be to update the DB in batches, rather than on every swipe to increase performance and UX
    // ! what number is best here for batch size?
    if (swipes.size >= 5) {
      // first convert swipes state (a Map) into an object
      const swipesObj = Object.fromEntries(swipes);
      // then convert to JSON
      const swipesBatch = JSON.stringify(swipesObj);
      // ? then ping the DB with the batch -- will need to talk to Upasana about if it's feasible to do it this way in Neo4j
      // after the response, clear the swipes state
      clearSwipes();
    }
    // * if it isn't time to ping the DB yet, we just update swipes state
    const updatedSwipes = new Map(swipes);
    updatedSwipes.set(swipedUserId!, swipe);
    updateSwipes(updatedSwipes);
    // * and then update the recs state to remove the person we just swiped
    const updatedState = [...recs];
    updatedState.pop();
    removeOneRec(updatedState);
  };

  // // ! probably need to store the swipe cache in user state so it is globally persisted, put this on userStore
  // const handleSwipeCache = () => {
  //   const cache: SwipeCache = new Map();
  //   return async (swipe: Swipe, swipedUserId: RecId) => {
  //     // determine which swipe this is
  //     const outcome = swipe === 'like' ? 'like' : 'dislike';
  //     // store that outcome in the cache
  //     cache.set(swipedUserId, swipe);
  //     // if the cache is a certain size, ping the DB with the batched updated
  //     // first convert map to an object
  //     i;
  //     const swipes = Object.fromEntries(cache);

  //     // update the recs state to remove the just-swiped person
  //     const updatedState = [...recs];
  //     updatedState.pop();
  //     removeOneRec(updatedState);
  //   };
  // };

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
            onClick={() => handleSwipe('dislike', id)}
          >
            <HiXMark />
          </button>
          <button
            className="btn btn-primary btn-circle justify-right"
            onClick={() => handleSwipe('like', id)}
          >
            <HiCheck />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecCard;
