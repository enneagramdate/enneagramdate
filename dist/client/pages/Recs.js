import React from 'react';
import recsStore from '../stores/recsStore';
import fakeUsers from '../data/fake/fakeUserData';
import RecCard from '../components/RecCard';
import NavBar from '../components/Navbar';
import userStore from '../stores/userStore';
import { useNavigate } from 'react-router-dom';
const Recs = () => {
    const recs = recsStore.use.recs();
    const setRecs = recsStore.use.setRecs();
    const userId = userStore.use.elementId();
    const navigate = useNavigate();
    if (!recs.length)
        setRecs(fakeUsers);
    const recCards = recs.map((person) => {
        return (React.createElement(RecCard, { elementId: person.elementId, enneagramType: person.enneagramType, name: person.name, age: person.age, imgUrl: person.imgUrl, key: person.elementId }));
    });
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "flex flex-center justify-center align-center" }, recCards[recCards.length - 1]),
        React.createElement(NavBar, null)));
};
export default Recs;
//# sourceMappingURL=Recs.js.map