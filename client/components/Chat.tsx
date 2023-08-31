import React, { useEffect, useState } from 'react';

/* chat component should render 3 subcomponents 
- top bar which displays the matches name and photo and maybe type?
- Messages component which displays all messages
- ChatInput component which lets the user send messages
*/

import { Message, UserId } from '../types';
import Messages from './chat/Messages';
import { Socket } from 'socket.io';
import SendMessage from './chat/SendMessage';
import userStore from '../stores/userStore';

const Chat = ({
  socket,
  matchedUserId,
}: {
  socket: any;
  matchedUserId: UserId;
}) => {
  const userId = userStore.use.elementId();
  const [room, setRoom] = useState('');

  useEffect(() => {
    socket.connect();
    return () => socket.disconnect();
  });
  useEffect(() => {
    socket.emit('join_room', { userId: 'fake user id', matchedUserId });
  }, []);
  return (
    <div className="chat-container">
      <div>
        <Messages
          socket={socket}
          matchedUserId={matchedUserId}
          room={room}
          setRoom={setRoom}
        />
        <SendMessage socket={socket} room={room} setRoom={setRoom} />
      </div>
    </div>
  );
};

export default Chat;
