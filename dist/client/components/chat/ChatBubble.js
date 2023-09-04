import userStore from '../../stores/userStore';
import React from 'react';
const ChatBubble = ({ messageObj }) => {
    const userId = userStore.use.elementId();
    const { message, sender, time, room } = messageObj;
    const isOwnMessage = sender === userId;
    return (React.createElement("div", { className: `chat, ${isOwnMessage ? 'chat-end' : 'chat-start'}` },
        React.createElement("div", { className: "chat-bubble bg-info" }, message)));
};
export default ChatBubble;
