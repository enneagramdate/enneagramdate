import React, { useEffect } from 'react';
import matchesStore from '../../stores/matchesStore';
import ChatBubble from './ChatBubble';
const Messages = ({ socket, room, setRoom, }) => {
    const matchedUserId = matchesStore.use.currentMatchedUser();
    const allChats = matchesStore.use.chats();
    const setMatchChats = matchesStore.use.setMatchChats();
    const userChat = allChats.get(matchedUserId);
    console.log(userChat);
    useEffect(() => {
        socket.on('receive_message', (msg) => {
            const chatsClone = userChat !== undefined ? [...userChat] : [];
            chatsClone.push(msg);
            const allChatsClone = new Map(allChats);
            allChatsClone.set(matchedUserId, chatsClone);
            setMatchChats(allChatsClone);
            setRoom(msg.room);
        });
    }, [allChats]);
    const messages = userChat
        ? userChat.map((msg, i) => {
            return React.createElement(ChatBubble, { messageObj: msg, key: `msg-${i}` });
        })
        : 'nothing';
    return React.createElement("div", null, messages);
};
export default Messages;
//# sourceMappingURL=Messages.js.map