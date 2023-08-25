/* 
Objectives of this component:
  - Display one recommended person at a time (Photo, name, age, enneagram type)
  - Click left button to reject (sends request to BE route: )
  - Click right button to like (sends request to BE route: )
Challenges:
*  - how to handle fetching more recs before the user runs out
*    - maybe if recs.length < 5, fetch more or something? need to figure out how to implement
*/

import React from 'react';
import axios from 'axios';
import recsStore from '../stores/recsStore';
import { EnneagramType, User, UserId } from '../types';
import RecCard from './RecCard';

const Recs = () => {
  // import state
  const recs: User[] = recsStore.use.recs();
  const setRecs = recsStore.use.setRecs();

  // * function to fetch recs from the backend, this should be in a useEffect or something
  // TODO: refactor as this function may only need the user's id, not their type
  const getRecs = async (id: UserId, type: EnneagramType) => {
    try {
      // TODO: refactor get request to conform to API
      const response = await axios.get(`/recs/${id}/${type}`);
      const recsFromDB = response.data;
      setRecs(recsFromDB);
    } catch (err) {
      // TODO: proper error handling
      return alert('sorry, nothing!');
    }
  };

  // TODO: map over the recs and render a RecCard for each
  const recCards = recs.map((person) => console.log(person.name));

  // TODO: this component should render one UserCard at a time, populating UserCards from the recs state
  // * for better Time Complexity, render the final UserCard and make the function to like/dislike pop set state to be recs - the last element (can I use pop here? probably not)
  return (
    <>
      <h1>put a rec card here when it's built</h1>
      {recCards[recCards.length - 1]}
    </>
  );
};

export default Recs;
