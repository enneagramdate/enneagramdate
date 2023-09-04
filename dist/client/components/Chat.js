import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Messages from './chat/Messages';
import SendMessage from './chat/SendMessage';
import userStore from '../stores/userStore';
import { socket } from '../socket';
import matchesStore from '../stores/matchesStore';
import NavBar from './Navbar';
const Chat = () => {
    const userId = userStore.use.elementId();
    const matchedUserId = matchesStore.use.currentMatchedUser();
    const [room, setRoom] = useState('');
    const navigate = useNavigate();
    React.useEffect(() => {
        if (userId === null)
            navigate('/login');
    }, []);
    useEffect(() => {
        socket.connect();
        return () => socket.disconnect(true);
    });
    useEffect(() => {
        socket.emit('join_room', { userId, matchedUserId });
    }, []);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "chat-container" },
            React.createElement("div", null,
                React.createElement(Messages, { socket: socket, room: room, setRoom: setRoom }),
                React.createElement(SendMessage, { socket: socket, room: room, setRoom: setRoom }))),
        React.createElement(NavBar, null)));
};
export default Chat;
