import React from 'react';
import { useNavigate } from 'react-router-dom';
const Splash = () => {
    const navigate = useNavigate();
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "bg-primary text-primary-content flex items-center justify-center h-full" },
            React.createElement("div", null,
                React.createElement("h1", { className: "text-white text-8xl" }, "Wingman"),
                React.createElement("div", { className: "flex items-center justify-between" },
                    React.createElement("button", { className: "btn btn-secondary text-white w-1/3", onClick: () => navigate('/login') }, "Login"),
                    React.createElement("button", { className: "btn btn-secondary text-white w-1/3", onClick: () => navigate('/signup') }, "Signup"))))));
};
export default Splash;
//# sourceMappingURL=Splash.js.map