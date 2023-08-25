/* 
Objectives of this component:
  - Display one recommended person at a time (Photo, name, age, enneagram type)
  - Click left button to reject (sends request to BE route: )
  - Click right button to like (sends request to BE route: )
*/

import React from 'react';
import axios from 'axios';
import { HiCheck, HiXMark } from 'react-icons/hi2';
import recsStore from '../stores/recsStore';
import { EnneagramType, User, UserId } from '../types';

const Recs = () => {
  // import state
  const recs: User[] = recsStore.use.recs();
  const setRecs = recsStore.use.setRecs();

  // function to fetch recs from the backend
  const getRecs = async (id: UserId, type: EnneagramType) => {
    try {
      const response = await axios.get(`/recs/${id}/${type}`);
      const recsFromDB = response.data;
      setRecs(recsFromDB);
    } catch (err) {
      // error handling
      return alert('sorry, nothing!');
    }
  };

  // return component
  return (
    <div className="card w-96 bg-primary text-primary-content">
      <figure>
        <img
          src="https://purrfectcatbreeds.com/wp-content/uploads/2014/06/abyssinian-main.jpg"
          alt="a really nice person, I bet"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">The person's name, age</h2>

        <h3 className="card-title">Type</h3>
        <div className="card-actions">
          <button className="btn btn-error btn-circle justify-left">
            <HiXMark />
          </button>
          <button className="btn btn-primary btn-circle justify-right">
            <HiCheck />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Recs;
