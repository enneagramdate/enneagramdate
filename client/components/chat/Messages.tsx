import React, { useEffect } from 'react';
import matchesStore from '../../stores/matchesStore';
import { ChatLog, MatchChats, Message, UserId } from '../../types';
import { Socket } from 'socket.io-client';

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
  useEffect(() => {
    console.log('Messages Component mounted');
    console.log(userChat);
  });
  // runs whenever a socket event is received from the server
  useEffect(() => {
    socket.on('receive_message', (msg: Message) => {
      // when we receive a message
      console.log('here is the receive message', msg);
      // update chats state to append the new message
      /* 
      TODO: must make sure that an empty array is set in the chats state on matchesStore
      TODO: at the key of matchedUserId when a match is established so userChat will
      TODO: always be an array even if its an empty one
      */
      // const chatsClone = [...userChat!] || [];
      const chatsClone: ChatLog = [];
      chatsClone!.push(msg);
      // then set the global chats state
      const allChatsClone = new Map(allChats);
      allChatsClone.set(matchedUserId, chatsClone!);
      setMatchChats(allChatsClone);
    });
    // remove the event listener on component unmount
    // socket.off('receive_message');
  }, [socket]);

  // return a message component, which renders a message component for each message
  return (
    <div>
      {/* <div>{'hello'}</div> */}
      <div>{userChat ? userChat[0].message : 'nothing'}</div>
      <div>{userChat ? userChat[0].sender : 'nothing'}</div>
    </div>
  );
};

export default Messages;
