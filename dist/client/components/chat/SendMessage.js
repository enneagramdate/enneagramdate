var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { useState } from 'react';
import userStore from '../../stores/userStore';
import matchesStore from '../../stores/matchesStore';
const SendMessage = ({ socket, room, setRoom, }) => {
    const userId = userStore.use.elementId();
    const currentMatchedUserId = matchesStore.use.currentMatchedUser();
    const allChats = matchesStore.use.chats();
    const setMatchChats = matchesStore.use.setMatchChats();
    const userChat = allChats.get(currentMatchedUserId);
    const [message, setMessage] = useState('');
    const sendMessage = () => __awaiter(void 0, void 0, void 0, function* () {
        if (message !== '') {
            const time = Date.now();
            const messageToPost = {
                message,
                sender: userId,
                room: room,
                time: time,
            };
            socket.emit('send_message', messageToPost);
            let msgHistory = [];
            setMessage('');
        }
    });
    return (React.createElement("div", { className: "send-message-container" },
        React.createElement("input", { type: "text", placeholder: "Message...", onChange: (e) => setMessage(e.target.value), value: message }),
        React.createElement("button", { className: "btn btn-primary", onClick: sendMessage }, "Send")));
};
export default SendMessage;
