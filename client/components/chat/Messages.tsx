import React, { useEffect } from 'react';
import matchesStore from '../../stores/matchesStore';
import { ChatLog, MatchChats, Message, UserId } from '../../types';
import { Socket } from 'socket.io-client';
import ChatBubble from './ChatBubble';
// TODO: when a match is made, set to the chats global state MatchedUserId => []

const Messages = ({
  socket,
  // matchedUserId,
  room,
  setRoom,
}: {
  socket: Socket;
  // matchedUserId: UserId;
  room: string;
  setRoom: any;
}) => {
  // get the ChatLog for this particular match
  // allChats is a Map of UserId => ChatLog (ChatLog = Message[])
  const matchedUserId = matchesStore.use.currentMatchedUser();
  const allChats: MatchChats = matchesStore.use.chats();
  const setMatchChats = matchesStore.use.setMatchChats();
  const userChat: ChatLog = allChats.get(matchedUserId)!;
  console.log(userChat);
  // useEffect(() => {
  //   socket.connect();
  //   return () => {
  //     socket.disconnect();
  //   };
  // });
  // runs whenever a socket event is received from the server
  useEffect(() => {
    socket.on('receive_message', (msg: Message) => {
      // console.log(msg, 'at the top of socket.on');
      // console.log(userChat, 'at the top of socket.on');
      // console.log(allChats, 'at the top of socket.on');
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
      const chatsClone: ChatLog = userChat !== undefined ? [...userChat] : [];
      // console.log('*', userChat, chatsClone);
      chatsClone!.push(msg);
      // then set the global chats state
      const allChatsClone = new Map(allChats);
      allChatsClone.set(matchedUserId, chatsClone!);
      setMatchChats(allChatsClone);
      setRoom(msg.room);
    });
    // remove the event listener on component unmount
    // socket.off('receive_message');
  }, [allChats]);

  const messages = userChat
    ? userChat.map((msg, i) => {
        return <ChatBubble messageObj={msg} key={`msg-${i}`} />;
      })
    : 'nothing';
  // return a message component, which renders a message component for each message
  return <div>{messages}</div>;
};

export default Messages;
