import 'dotenv/config';
import express from 'express';
// import { cookieParser } from 'cookie-parser';

// import router
import apiRouter from './routes/api.js';

// define server port
const PORT = process.env.PORT || 3000;

// create express server instance
const app = express();

// handle parsing request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// handle requests for static files
app.use(express.static('./../client'));

// define route handler
app.use('/api', apiRouter);

// catch-all route handler for any requests to an unknown route
app.use((req, res) =>
  res.status(404).send("This is not the page you're looking for...")
);

// global error handler
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

// express server listening
app.listen(PORT, () => console.log(`Currently listening on port: ${PORT}`));

export default app;
