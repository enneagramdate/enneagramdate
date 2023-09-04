import userStore from '../../stores/userStore';
import { Message } from '../../types';
import React from 'react';

const ChatBubble = ({ messageObj }: { messageObj: Message }) => {
  const userId = userStore.use.elementId();
  const { message, sender, time, room } = messageObj;
  const isOwnMessage = sender === userId;
  // console.log(userId);
  // console.log(messageObj.sender);
  return (
    <div className={`chat, ${isOwnMessage ? 'chat-end' : 'chat-start'}`}>
      <div className="chat-bubble bg-info">{message}</div>
    </div>
  );
};

export default ChatBubble;
