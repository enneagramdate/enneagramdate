import React, { useEffect } from 'react';
import matchesStore from '../stores/matchesStore';
import { ChatLog, MatchChats, Message, UserId } from '../types';
import { Socket, SocketOptions, io } from 'socket.io-client';

// TODO: when a match is made, set to the chats global state MatchedUserId => []

const Messages = ({
  socket,
  matchedUserId,
}: {
  socket: Socket;
  matchedUserId: UserId;
}) => {
  // get the ChatLog for this particular match
  // allChats is a Map of UserId => ChatLog (ChatLog = Message[])
  const allChats: MatchChats = matchesStore.use.chats();
  const setMatchChats = matchesStore.use.setMatchChats();
  const userChat: ChatLog = allChats.get(matchedUserId)!;

  // runs whenever a socket event is received from the server
  useEffect(() => {
    socket.on('receive_message', (msg: Message) => {
      // when we receive a message
      console.log(msg);
      // update chats state to append the new message
      const chatsClone = [...userChat!];
      chatsClone!.push(msg);
      // then set the global chats state
      const allChatsClone = new Map(allChats);
      allChatsClone.set(matchedUserId, chatsClone!);
      setMatchChats(allChatsClone);
    });
    // remove the event listener on component unmount
    socket.off('receive_message');
  }, [socket]);
};
