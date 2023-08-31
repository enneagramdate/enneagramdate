import React, { useEffect } from 'react';

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

  useEffect(() => {
    socket.emit('join_room', { userId: 'fake user id', matchedUserId });
  });
  return (
    <div className="chat-container">
      <div>
        <Messages socket={socket} matchedUserId={matchedUserId} />
        <SendMessage socket={socket} />
      </div>
    </div>
  );
};

export default Chat;
