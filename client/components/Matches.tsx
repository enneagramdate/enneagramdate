import { EnneagramType, RecommendedUser, UserId } from '../types';
import React, { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import EnneagramBadge from './EnneagramBadge';
import matchesStore from '../stores/matchesStore';

// interface MatchProps {
//   enneagramType: EnneagramType;
//   name: string;
//   imgUrl: string[];
//   age: number;
//   elementId: UserId;
// }

const Match = ({ user }: { user: RecommendedUser }): ReactElement => {
  //console.log(user);
  const { enneagramType, name, imgUrl, age, elementId } = user;
  const navigate = useNavigate();
  const setCurrentMatchedUser = matchesStore.use.setMatchedUser();

  const handleChatClick = () => {
    // set currentMatchedUser in state
    setCurrentMatchedUser(elementId);
    // navigate to /chat
    navigate('/chat');
  };

  return (
    <>
      <div className=" rounded-xl mt-2 w-11/12 bg-primary flex justify-between items-center">
        <a className="flex items-center w-full">
          <img className=" rounded-tl-xl rounded-bl-xl w-10" src={imgUrl[0]} />
          <p>{name}</p>
          <EnneagramBadge enneagramType={enneagramType} />
        </a>
        <button className="btn btn-secondary" onClick={handleChatClick}>
          Chat
        </button>
      </div>
    </>
  );
};
export default Match;
