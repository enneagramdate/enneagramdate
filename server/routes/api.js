import express from 'express';

// import controller
import apiController from '../controllers/controller.js';

// create router
const apiRouter = express.Router();

// Login route (native auth)

// Signup route (native auth)
apiRouter.post('/signup', apiController.createNewUser, (req, res) => {
  res.status(200).json({});
});

// Like route

// Dislike route

export default apiRouter;
