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
import { EnneagramType, User, UserId } from '../types';
// import RecCard from './RecCard';
import fakeUsers from '../data/fakeUserData';
import RecCard from '../components/RecCard';

const Recs = () => {
  // import state
  const recs: User[] = recsStore.use.recs();
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

  // TODO: map over the recs and render a RecCard for each
  const recCards = recs.map((person) => {
    return (
      <RecCard
        id={person.id}
        enneagramType={person.enneagramType}
        name={person.name}
        age={person.age}
        imgUrl={person.imgUrl}
        key={person.id}
      />
    );
  });
  // console.log(recCards);
  // TODO: this component should render one RecCard at a time, populating RecCards from the recs state
  // * for better Time Complexity, render the final RecCard and make the function to like/dislike pop set state to be recs - the last element
  return (
    <div className="flex flex-center justify-center align-center">
      {recCards[recCards.length - 1]}
    </div>
  );
};

export default Recs;
