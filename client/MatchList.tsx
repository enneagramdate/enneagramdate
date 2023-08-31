import React from 'react';
import Matches from './Matches';
import userStore from './stores/userStore';
import { useNavigate } from 'react-router-dom';

const MatchList = () => {
  const userId = userStore.use.elementId();
  const navigate = useNavigate();
  React.useEffect(() => {
    if (userId === null) navigate('/login');
  }, []);
  return (
    <div className=" flex flex-col h-screen items-center justify-between">
      <div className="rounded-xl h-4/5 w-6/12 bg-secondary flex flex-col items-center content-center">
        <Matches />
        <Matches />
        <Matches />
        <Matches />
        <Matches />
      </div>
    </div>
  );
};

export default MatchList;
