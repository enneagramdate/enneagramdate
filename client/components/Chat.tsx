import React, { useEffect, useState } from 'react';

/* chat component should render 3 subcomponents 
- top bar which displays the matches name and photo and maybe type?
- Messages component which displays all messages
- ChatInput component which lets the user send messages
*/

import { Message, UserId } from '../types';
import { useNavigate } from 'react-router-dom';
import Messages from './chat/Messages';
import { Socket } from 'socket.io';
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
    if (userId === null) navigate('/login');
  }, []);
  useEffect(() => {
    socket.connect();
    return () => socket.disconnect(true);
  });
  useEffect(() => {
    socket.emit('join_room', { userId, matchedUserId });
  }, []);
  return (
    <>
      <div className="chat-container">
        <div>
          <Messages
            socket={socket}
            // matchedUserId={matchedUserId}
            room={room}
            setRoom={setRoom}
          />
          <SendMessage socket={socket} room={room} setRoom={setRoom} />
        </div>
      </div>
      <NavBar />
    </>
  );
};

export default Chat;
