import React from 'react';
import Matches from '../components/Matches';
import NavBar from '../components/Navbar';
import matchesStore from '../stores/matchesStore';

const MatchList = () => {
  const matches = matchesStore.use.matches();
  console.log(matches);
  return (
    <>
      <div className=" flex flex-col h-screen items-center justify-between">
        <div className="rounded-xl h-4/5 w-6/12 bg-secondary flex flex-col items-center content-center">
          <Matches />
          <Matches />
          <Matches />
          <Matches />
          <Matches />
        </div>
      </div>
      <NavBar />
    </>
  );
};

export default MatchList;