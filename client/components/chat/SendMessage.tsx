import React, { useState } from 'react';
import userStore from '../../stores/userStore';
import { Socket } from 'socket.io-client';

const SendMessage = ({ socket }: { socket: Socket }) => {
  const userId = userStore.use.elementId();
  const [message, setMessage] = useState('');
  const sendMessage = () => {
    if (message !== '') {
      const time = Date.now();
      console.log(time);
      console.log(userId);
      socket.emit('send_message', { message, time, sender: 'abc' });
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
