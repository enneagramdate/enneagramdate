import React from 'react';
import { createBrowserRouter, RouterProvider, } from 'react-router-dom';
import './app.css';
import Splash from './Splash';
import Signup from './Signup';
import Recs from './pages/Recs';
import MatchList from './pages/MatchList';
import Chat from './components/Chat';
import Login from './Login';
const App = () => {
    const router = createBrowserRouter([
        {
            path: '/',
            element: React.createElement(Splash, null),
        },
        {
            path: '/login',
            element: React.createElement(Login, null),
        },
        {
            path: '/signup',
            element: React.createElement(Signup, null),
        },
        {
            path: '/recs',
            element: React.createElement(Recs, null),
        },
        {
            path: '/matches',
            element: React.createElement(MatchList, null),
        },
        {
            path: '/chat',
            element: React.createElement(Chat, null),
        },
    ]);
    return (React.createElement(React.Fragment, null,
        React.createElement(RouterProvider, { router: router })));
};
export default App;
//# sourceMappingURL=App.js.map