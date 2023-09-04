import 'dotenv/config';
import { Server } from 'socket.io';
import http from 'node:http';
import express from 'express';
import apiRouter from './routes/api.js';
const PORT = process.env.PORT || '3000';
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./../client'));
app.use('/api', apiRouter);
app.use((req, res) =>
  res.status(404).send("This is not the page you're looking for...")
);
app.use((err, req, res, next) => {
  const defaultErr = {
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
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:9999', 'http://localhost:8000'],
    methods: ['GET', 'POST'],
  },
});
io.on('connection', (socket) => {
  console.log(`User connected ${socket.id}`);
  socket.on('join_room', (data) => {
    const { userId, matchedUserId } = data;
    const roomName = [userId, matchedUserId].sort((a, b) => a - b);
    let room = roomName[0] + '-' + roomName[1];
    socket.join(room);
    let time = Date.now();
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
server.listen(PORT, () => console.log(`Currently listening on port: ${PORT}`));
export default app;
