import React from 'react';

const ChatBubble = ({ msg }: { msg: string }) => {
  return (
    <div className="chat">
      <div className="chat-bubble bg-info">{msg}</div>
    </div>
  );
};

export default ChatBubble;
