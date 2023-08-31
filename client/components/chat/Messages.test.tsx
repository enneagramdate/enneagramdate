import React, { useEffect } from 'react';
import matchesStore from '../../stores/matchesStore';
import { ChatLog, MatchChats, Message, UserId } from '../../types';
import { Socket } from 'socket.io-client';
import ChatBubble from './ChatBubble';
import singleMatchesStore from '../../stores/singleMatchStore';
// TODO: when a match is made, set to the chats global state MatchedUserId => []

const MessagesTest = ({
  socket,
  matchedUserId,
  room,
  setRoom,
}: {
  socket: Socket;
  matchedUserId: UserId;
  room: string;
  setRoom: any;
}) => {
  // get the ChatLog for this particular match
  // allChats is a Map of UserId => ChatLog (ChatLog = Message[])
  const chat = singleMatchesStore.use.chat();
  const setChat = singleMatchesStore.use.setChat();

  // const allChats: MatchChats = matchesStore.use.chats();
  // const setMatchChats = matchesStore.use.setMatchChats();
  // const userChat: ChatLog = allChats.get(matchedUserId)!;
  useEffect(() => {
    // console.log('Messages Component mounted');
    console.log('chat', chat);
  });
  // runs whenever a socket event is received from the server
  useEffect(() => {
    socket.on('receive_message', (msg: Message) => {
      // console.log(msg, 'at the top of socket.on');
      console.log(chat, 'at the top of socket.on');
      // when we receive a message
      // console.log('here is the receive message', msg);
      // update chats state to append the new message
      /* 
      TODO: must make sure that an empty array is set in the chats state on matchesStore
      TODO: at the key of matchedUserId when a match is established so userChat will
      TODO: always be an array even if its an empty one
      */
      // const chatsClone = [...userChat!] || [];
      // const chatsClone: ChatLog = userChat || [];
      const chatsClone: ChatLog = [...chat];
      chatsClone.push(msg);
      // then set the global chats state
      setChat(chatsClone);
      setRoom(msg.room);
    });
    // remove the event listener on component unmount
    // socket.off('receive_message');
  }, [socket, chat]);

  const messages = chat
    ? chat.map((msg, i) => {
        return <ChatBubble msg={msg.message} key={`msg-${i}`} />;
      })
    : 'nothing';
  // return a message component, which renders a message component for each message
  return <div>{messages}</div>;
};

export default MessagesTest;
