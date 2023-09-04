import React from 'react';
import { useNavigate } from 'react-router-dom';
import EnneagramBadge from './EnneagramBadge';
import matchesStore from '../stores/matchesStore';
const Match = ({ user }) => {
    const { enneagramType, name, imgUrl, age, elementId } = user;
    const navigate = useNavigate();
    const setCurrentMatchedUser = matchesStore.use.setMatchedUser();
    const handleChatClick = () => {
        setCurrentMatchedUser(elementId);
        navigate('/chat');
    };
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: " rounded-xl mt-2 w-11/12 bg-primary flex justify-between items-center" },
            React.createElement("a", { className: "flex items-center w-full" },
                React.createElement("img", { className: " rounded-tl-xl rounded-bl-xl w-10", src: imgUrl[0] }),
                React.createElement("p", null, name),
                React.createElement(EnneagramBadge, { enneagramType: enneagramType })),
            React.createElement("button", { className: "btn btn-secondary", onClick: handleChatClick }, "Chat"))));
};
export default Match;
