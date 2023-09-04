import React from 'react';
import { useNavigate } from 'react-router-dom';
const NavBar = () => {
    const navigate = useNavigate();
    return (React.createElement("div", { className: "btm-nav" },
        React.createElement("button", { className: "bg-pink-200 text-pink-600", onClick: () => navigate('/profile') },
            React.createElement("span", { className: "btm-nav-label" }, "Profile")),
        React.createElement("button", { className: "active bg-blue-200 text-blue-600 border-blue-600", onClick: () => navigate('/recs') },
            React.createElement("span", { className: "btm-nav-label" }, "Recs")),
        React.createElement("button", { className: "bg-teal-200 text-teal-600", onClick: () => navigate('/matches') },
            React.createElement("span", { className: "btm-nav-label" }, "Matches"))));
};
export default NavBar;
//# sourceMappingURL=Navbar.js.map