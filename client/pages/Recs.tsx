import React, { useEffect } from 'react';
import recsStore from '../stores/recsStore';
import { EnneagramType, RecommendedUser, UserId } from '../types';
import fakeUsers from '../data/fake/fakeUserData';
import RecCard from '../components/RecCard';
import NavBar from '../components/Navbar';
import userStore from '../stores/userStore';
import { useNavigate } from 'react-router-dom';

const Recs = () => {
  // import state
  const recs: RecommendedUser[] = recsStore.use.recs();
  const setRecs = recsStore.use.setRecs();
  const userId = userStore.use.elementId();
  const navigate = useNavigate();

  // React.useEffect(() => {
  //   if (userId === null) navigate('/login');
  // }, []);

  // ! TESTING FUNCTIONS
  if (!recs.length) setRecs(fakeUsers);
  // ! END OF TESTING FUNCTIONS
  // TODO: this is how more recs will be fetched ahead of time: if (recs.length === 5) await getRecs();

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
    <>
      <div className="flex flex-center justify-center align-center">
        {recCards[recCards.length - 1]}
      </div>
      <NavBar />
    </>
  );
};

export default Recs;
