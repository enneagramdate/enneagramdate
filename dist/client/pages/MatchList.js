import React from 'react';
import Match from '../components/Matches';
import userStore from '../stores/userStore';
import { useNavigate } from 'react-router-dom';
import matchesStore from '../stores/matchesStore';
import NavBar from '../components/Navbar';
const MatchList = () => {
    const userId = userStore.use.elementId();
    const matches = matchesStore.use.matches();
    const navigate = useNavigate();
    React.useEffect(() => {
        if (userId === null)
            navigate('/login');
    }, []);
    console.log(matches);
    const matchesToRender = matches.map((match) => {
        return React.createElement(Match, { user: match, key: `match-page-${match.elementId}` });
    });
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: " flex flex-col h-screen items-center justify-between" },
            React.createElement("div", { className: "rounded-xl h-4/5 w-6/12 bg-secondary flex flex-col items-center content-center" }, matchesToRender)),
        React.createElement(NavBar, null)));
};
export default MatchList;
//# sourceMappingURL=MatchList.js.map