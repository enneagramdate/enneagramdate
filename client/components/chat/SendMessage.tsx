import React, { useState } from 'react';
import userStore from '../../stores/userStore';
import { Socket } from 'socket.io-client';
import matchesStore from '../../stores/matchesStore';
import axios from 'axios';
import { MatchChats } from '../../types';
import { ChatLog } from '../../types';

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
  const currentMatchedUserId = matchesStore.use.currentMatchedUser();
  const allChats: MatchChats = matchesStore.use.chats();
  const setMatchChats = matchesStore.use.setMatchChats();
  const userChat: ChatLog = allChats.get(currentMatchedUserId)!;
  const [message, setMessage] = useState('');
  const sendMessage = async () => {
    if (message !== '') {
      const time = Date.now();
      const messageToPost = {
        message,
        sender: userId,
        room: room,
        time: time,
      };
      socket.emit('send_message', messageToPost);
      let msgHistory: ChatLog = [];
      // if (!userChat) {
      //   msgHistory = [];
      // } else {
      //   msgHistory = [...userChat];
      // }
      // await axios.post('/api/chats', {
      //   elementIdA: userId,
      //   elementIdB: currentMatchedUserId,
      //   allChats: [...msgHistory, messageToPost],
      // });
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
