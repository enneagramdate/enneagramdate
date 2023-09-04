import 'dotenv/config';
import { AsyncError } from './types/types';
import { Server } from 'socket.io';
import http from 'node:http';
import express, { Application, Request, Response, NextFunction } from 'express';
// import { cookieParser } from 'cookie-parser';

// import router
import apiRouter from './routes/api';

// define server port
const PORT: string = process.env.PORT || '3000';

// create express server instance
const app: Application = express();

// handle parsing request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// handle requests for static files
app.use(express.static('./../client'));

// define route handler
app.use('/api', apiRouter);

// catch-all route handler for any requests to an unknown route
app.use((req: Request, res: Response) =>
  res.status(404).send("This is not the page you're looking for...")
);

// global error handler
app.use((err: AsyncError, req: Request, res: Response, next: NextFunction) => {
  const defaultErr: AsyncError = {
    log: 'Express error handler caught unknown middleware error.',
    status: 500,
    message: {
      err: 'An error occurred',
    },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

// Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:9999', 'http://localhost:8000'],
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`User connected ${socket.id}`);

  // ? insert socket event listeners here
  // send a welcome message to test
  // socket.emit('receive_message', {
  //   message: 'Welcome',
  //   time: 'NOW',
  //   sender: 'CHAT_BOT',
  // });
  socket.on('join_room', (data) => {
    const { userId, matchedUserId } = data;
    // find the room in the rooms cache
    // if it doesn't exist, create it for userId AND matchedUserId
    // the room name must be universal, just do it alphabetically
    const roomName = [userId, matchedUserId].sort((a, b) => a - b);
    let room = roomName[0] + '-' + roomName[1];
    // console.log(roomName);
    // if (roomCache[userId] && roomCache[userId][matchedUserId]) {
    //   room = roomCache[userId][matchedUserId];
    // } else {
    //   // create a universal room name for both users
    //   roomCache[userId] = {};
    //   roomCache[userId][matchedUserId] = room;
    //   roomCache[matchedUserId] = {};
    //   roomCache[matchedUserId][userId] = room;
    //   room = room;
    // }
    // console.log('here is the room cache --->', roomCache);
    // console.log(room);
    socket.join(room);
    let time = Date.now();
    // socket.to(room).emit('receive_message'),
    // io.to(room).emit('receive_message', {
    //   message: `Welcome to room ${room}`,
    //   time: time,
    //   sender: userId,
    //   room: room,
    // });
  });
  socket.on('send_message', (data) => {
    console.log('send_message listener ---->', data);
    const { message, time, sender, room } = data;
    socket.join(room);
    io.in(room).emit('receive_message', data);
  });

  socket.on('disconnect', (data) => {
    console.log('a user disconnected');
  });
});
// http server listening
server.listen(PORT, () => console.log(`Currently listening on port: ${PORT}`));

export default app;
