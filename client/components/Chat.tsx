import React from 'react';

/* chat component should render 3 subcomponents 
- top bar which displays the matches name and photo and maybe type?
- Messages component which displays all messages
- ChatInput component which lets the user send messages
*/

import { UserId } from '../types';
import Messages from './chat/Messages';
import { Socket } from 'socket.io';

const Chat = ({
  socket,
  matchedUserId,
}: {
  socket: any;
  matchedUserId: UserId;
}) => {
  return (
    <div className="chat-container">
      <div>
        <Messages socket={socket} matchedUserId={matchedUserId} />
      </div>
    </div>
  );
};

export default Chat;
