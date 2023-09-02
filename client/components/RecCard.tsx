import React from 'react';
import { HiCheck, HiXMark } from 'react-icons/hi2';
import { RecommendedUser, Swipe, UserId, SwipeCache } from '../types';
import recsStore from '../stores/recsStore';
import userStore from '../stores/userStore';
// import { mapToJSON } from '../data/utils';
import EnneagramBadge from './EnneagramBadge';
import axios from 'axios';
import matchesStore from '../stores/matchesStore';

const RecCard = (rec: RecommendedUser) => {
  // destructure user information from props
  const { elementId, enneagramType, name, age, imgUrl } = rec;
  // import state as needed
  // user state - just need the user's elementId for handleSwipe
  const userId = userStore.use.elementId();
  const matches = matchesStore.use.matches();
  const setMatches = matchesStore.use.setMatches();

  // recs state
  const recs: RecommendedUser[] = recsStore.use.recs();
  const setRecs = recsStore.use.setRecs();
  // const swipes: SwipeCache = userStore.use.swipes();
  // const updateSwipes = userStore.use.updateSwipes();
  // const clearSwipes = userStore.use.clearSwipes();

  // declare a function to handleSwipe
  // ! WIP
  const handleSwipe = async (swipe: Swipe, swipedUserId: UserId) => {
    // determine which api route to hit
    const route = swipe === 'like' ? '/api/likes' : '/api/dislikes';
    // ! don't need to save swipes to state at this time since a caching solution will forego batching from FE
    // add the current swipe to state
    // const updatedSwipes = new Map(swipes);
    // updatedSwipes.set(swipedUserId!, swipe);
    // updateSwipes(updatedSwipes);
    // const swipesBatch = mapToJSON(updatedSwipes);
    // console.log('Swipes Batch send to DB --->', swipesBatch);
    const body = {
      elementIdA: userId,
      elementIdB: swipedUserId,
    };
    const { data } = await axios.post(route, body);
    console.log('here is the swipeResponse for A matches B', data.AmatchesB);
    console.log('here is the swipeResponse for A likes B', data.AlikesB);
    // if it is a match, update matches state
    if (data.AmatchesB) {
      const matchesClone: RecommendedUser[] = [...matches, rec];
      setMatches(matchesClone);
      alert(`You just matched with ${name}!`);
    }
    // ! after the response, clear the swipes state (can delete all this if swipe state is made unnecessary)
    // clearSwipes();
    // then update the recs state so the next recommendation renders for the user
    const updatedRecsState = [...recs];
    updatedRecsState.pop();
    setRecs(updatedRecsState);
  };

  const images = imgUrl.map((url) => {
    return (
      <div className="carousel-item h-full" key={url}>
        <img src={url} />
      </div>
    );
  });

  return (
    <div className="card-container">
      <div className="card w-96 bg-primary text-primary-content flex items-center justify-center">
        <div className="h-8 bg-primary"></div>
        <div className="h-96 carousel carousel-vertical">{images}</div>
        <div className="card-body">
          <div className="rec-info flex flex-center justify-between items-center">
            <div className="card-title text-white text-md">
              {`${name},\n\ ${age}`}
            </div>
            <div className="flex flex-end">
              <EnneagramBadge enneagramType={enneagramType} />
            </div>
          </div>
          <div className="card-actions flex flex-center space-x-48">
            <button
              className="btn btn-error btn-circle justify-left"
              onClick={() => handleSwipe('dislike', elementId)}
            >
              <HiXMark />
            </button>
            <button
              className="btn btn-success btn-circle justify-right"
              onClick={() => handleSwipe('like', elementId)}
            >
              <HiCheck />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecCard;
