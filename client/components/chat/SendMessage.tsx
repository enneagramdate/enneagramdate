import React, { useState } from 'react';
import userStore from '../../stores/userStore';
import { Socket } from 'socket.io-client';

const SendMessage = ({
  socket,
  room,
  setRoom,
}: {
  socket: Socket;
  room: string;
  setRoom: any;
}) => {
  const userId = userStore.use.elementId();
  const [message, setMessage] = useState('');
  const sendMessage = () => {
    if (message !== '') {
      const time = Date.now();
      socket.emit('send_message', { message, time, sender: 'abc', room: room });
      setMessage('');
    }
  };

  return (
    <div className="send-message-container">
      <input
        type="text"
        placeholder="Message..."
        onChange={(e) => setMessage(e.target.value)}
        value={message}
      />
      <button className="btn btn-primary" onClick={sendMessage}>
        Send
      </button>
    </div>
  );
};

export default SendMessage;
