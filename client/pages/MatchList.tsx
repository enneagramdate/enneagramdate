import React from 'react';
import Match from '../components/Matches';
import userStore from '../stores/userStore';
import { useNavigate } from 'react-router-dom';
import matchesStore from '../stores/matchesStore';

const MatchList = () => {
  const userId = userStore.use.elementId();
  const matches = matchesStore.use.matches();
  const navigate = useNavigate();
  React.useEffect(() => {
    if (userId === null) navigate('/login');
  }, []);
  console.log(matches);

  const matchesToRender = matches.map((match) => {
    return <Match user={match} />;
  });
  return (
    <div className=" flex flex-col h-screen items-center justify-between">
      <div className="rounded-xl h-4/5 w-6/12 bg-secondary flex flex-col items-center content-center">
        {/* <Match />
        <Match />
        <Match />
        <Match />
        <Match /> */}
        {matchesToRender}
      </div>
    </div>
  );
};

export default MatchList;
