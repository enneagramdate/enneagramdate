/* 
Objectives of this component:
  - Display one recommended person at a time (Photo, name, age, enneagram type)
  - Click left button to reject (sends request to BE route: )
  - Click right button to like (sends request to BE route: )
Challenges:
*  - how to handle fetching more recs before the user runs out
*    - maybe if recs.length < 5, fetch more or something? need to figure out how to implement
*/

import React, { useEffect } from 'react';
import axios from 'axios';
import recsStore from '../stores/recsStore';
import { EnneagramType, RecommendedUser, UserId } from '../types';
import fakeUsers from '../data/fake/fakeUserData';
import RecCard from '../components/RecCard';

const Recs = () => {
  // import state
  const recs: RecommendedUser[] = recsStore.use.recs();
  const setRecs = recsStore.use.setRecs();

  // ! TESTING FUNCTIONS
  if (!recs.length) setRecs(fakeUsers);
  // ! END OF TESTING FUNCTIONS
  // TODO: this is how more recs will be fetched ahead of time: if (recs.length === 5) await getRecs();

  // * function to fetch recs from the backend, this should be in a useEffect or something
  // TODO: refactor as this function may only need the user's id, not their type
  const getRecs = async (id: UserId, type: EnneagramType) => {
    try {
      // TODO: refactor get request to conform to API
      const response = await axios.get(`/recs/${id}/${type}`);
      const recsFromDB = response.data;
      // set recs to append the existing recs to the top of the recs stack so they go first
      setRecs([...recsFromDB, ...recs]);
    } catch (err) {
      // TODO: proper error handling
      return alert('sorry, nothing!');
    }
  };

  // map over the recs state and return a RecCard for each rec
  const recCards = recs.map((person) => {
    return (
      <RecCard
        elementId={person.elementId}
        enneagramType={person.enneagramType}
        name={person.name}
        age={person.age}
        imgUrl={person.imgUrl}
        key={person.elementId}
      />
    );
  });
  // render the last recCard from the recs state (a stack); this is because handleSwipe (see RecCard.tsx) will pop the top rec off the stack and set the state
  return (
    <div className="flex flex-center justify-center align-center">
      {recCards[recCards.length - 1]}
    </div>
  );
};

export default Recs;
