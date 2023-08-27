import React from 'react';
import { HiCheck, HiXMark } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import { User, Swipe, UserId, SwipeCache } from '../types';
import recsStore from '../stores/recsStore';
import userStore from '../stores/userStore';
import { mapToJSON } from '../data/utils';
import EnneagramBadge from './EnneagramBadge';

const RecCard = (rec: User) => {
  const navigate = useNavigate();
  // destructure user information from props
  const { id, enneagramType, name, age, imgUrl } = rec;
  // import state as needed
  // user state
  const user = userStore.use.name();
  const userType = userStore.use.enneagramType();
  const userId = userStore.use.id();
  // recs state
  const recs: User[] = recsStore.use.recs();
  const removeOneRec = recsStore.use.removeOneRec();
  const swipes: SwipeCache = userStore.use.swipes();
  const updateSwipes = userStore.use.updateSwipes();
  const clearSwipes = userStore.use.clearSwipes();

  // declare a function to handleSwipe
  // ! WIP
  const handleSwipe = async (swipe: Swipe, swipedUserId: UserId) => {
    // determine the user's decision
    const outcome = swipe === 'like' ? 'like' : 'dislike';
    // add the current swipe to state
    const updatedSwipes = new Map(swipes);
    // ! at this point, need to discuss with Upasana how the BE is expecting the data to look regarding setting relationships
    // ? if the route is something like /swipes/:userId, this should work for batch processing / single processing
    // ? since the BE will get the user's ID from the params, and the swipee's ID(s) from the req.body
    updatedSwipes.set(swipedUserId!, swipe);
    // updatedSwipes.set({ swiper: userId, swipee: swipedUserId }, swipe);
    // state will not actually be updated until this execution context closes, so will need to pass updatedSwipes to the mapToJSON below, not swipes
    updateSwipes(updatedSwipes);
    // ? ping DB to update relationship accordingly -- better option would be to update the DB in batches, rather than on every swipe to increase performance and UX
    // ! what number is best here for batch size? is batching even worth it for MVP? If no, then all this logic is emptied out and we don't even need to store swipes in state
    // ! and we simple ping the DB on each swipe --- could also implement server-side caching of swipes to batch update the DB with all swipes every X minutes or something?
    // ! in which case this API would simple ping the route that updates the cache on the server; this might be the best option
    if (updatedSwipes.size === 2) {
      const swipesBatch = mapToJSON(updatedSwipes);
      console.log('Swipes Batch send to DB --->', swipesBatch);
      // TODO: then ping the DB with the batch -- will need to talk to Upasana about if it's feasible to do it this way in Neo4j
      // after the response, clear the swipes state
      clearSwipes();
    }
    // then update the recs state so the next recommendation renders for the user
    const updatedState = [...recs];
    updatedState.pop();
    removeOneRec(updatedState);
  };

  const images = imgUrl.map((url) => {
    return (
      <div className="carousel-item h-full" key={id}>
        <img src={url} />
      </div>
    );
  });

  return (
    <div className="card w-96 bg-primary text-primary-content">
      <div className="alert alert-success">
        Hello, {user}, your enneagram type is {userType}
      </div>
      <button className="btn btn-info" onClick={() => navigate('/')}>
        Click to go to back
      </button>
      <div className="h-96 carousel carousel-vertical rounded-box">
        {images}
      </div>
      <div className="card-body">
        <div className="card-title">
          {name}, {age}
        </div>
        <EnneagramBadge enneagramType={enneagramType} />
        <div className="card-actions">
          <button
            className="btn btn-error btn-circle justify-left"
            onClick={() => handleSwipe('dislike', id)}
          >
            <HiXMark />
          </button>
          <button
            className="btn btn-success btn-circle justify-right"
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
