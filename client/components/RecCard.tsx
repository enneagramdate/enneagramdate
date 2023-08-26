import React from 'react';
import { HiCheck, HiXMark } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import { User, Swipe, UserId, RecId, SwipeCache } from '../types';
import recsStore from '../stores/recsStore';
import userStore from '../stores/userStore';
import { mapToJSON } from '../data/utils';

const RecCard = (rec: User) => {
  const navigate = useNavigate();
  // destructure user information from props
  const { id, enneagramType, name, age, imgUrl } = rec;
  // import state as needed
  const user = userStore.use.name();
  const userType = userStore.use.enneagramType();
  const recs: User[] = recsStore.use.recs();
  const removeOneRec = recsStore.use.removeOneRec();
  const swipes: SwipeCache = userStore.use.swipes();
  const updateSwipes = userStore.use.updateSwipes();
  const clearSwipes = userStore.use.clearSwipes();

  // declare a function to handleSwipe
  const handleSwipe = (swipe: Swipe, swipedUserId: UserId) => {
    // determine the user's decision
    const outcome = swipe === 'like' ? 'like' : 'dislike';
    // add the current swipe to state
    const updatedSwipes = new Map(swipes);
    updatedSwipes.set(swipedUserId!, swipe);
    // state will not actually be updated until this execution context closes, it seems, so will need to pass updatedSwipes to the mapToJSON below
    updateSwipes(updatedSwipes);
    // ? ping DB to update relationship accordingly -- better option would be to update the DB in batches, rather than on every swipe to increase performance and UX
    // ! what number is best here for batch size?
    if (updatedSwipes.size === 2) {
      const swipesBatch = mapToJSON(updatedSwipes);
      console.log(swipesBatch);
      // TODO: then ping the DB with the batch -- will need to talk to Upasana about if it's feasible to do it this way in Neo4j
      // after the response, clear the swipes state
      clearSwipes();
    }
    // then update the recs state so the next recommendation renders for the user
    // * and then update the recs state to remove the person we just swiped
    const updatedState = [...recs];
    updatedState.pop();
    removeOneRec(updatedState);
    console.log(swipes);
  };

  return (
    <div className="card w-96 bg-primary text-primary-content">
      <div className="alert alert-success">
        Hello, {user}, your enneagram type is {userType}
      </div>
      <button className="btn btn-primary" onClick={() => navigate('/')}>
        Click to go to back
      </button>
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
