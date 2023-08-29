import express from 'express';

// import controller
import apiController from '../controllers/controller.js';

// create router
const apiRouter = express.Router();

// Login route (native auth with Passport)

apiRouter.post('/login', apiController.sendLatestRelationships, (req, res) => {
  res.status(200).json(res.locals);
});

// Signup route (native auth with Passport)

apiRouter.post(
  '/signup',
  apiController.createNewUserNode,
  apiController.createNewUserRecommendations,
  apiController.sendLatestRelationships,
  (req, res) => {
    res.status(200).json(res.locals);
  }
);

// User A likes User B

apiRouter.post('/likes', apiController.createLikesOrMatch, (req, res) => {
  res.status(200).json(res.locals);
});

// User A dislikes or unmatches User B

apiRouter.post('/dislikes', apiController.removeRelationships, (req, res) => {
  res.status(200).json(res.locals);
});

// to get user and relationship info, and clean DB

apiRouter.get('/users', apiController.getAllUsers, (req, res) => {
  res.status(200).json(res.locals);
});

apiRouter.get(
  '/relationships',
  apiController.getAllRelationships,
  (req, res) => {
    res.status(200).json(res.locals);
  }
);

apiRouter.get('/delete', apiController.deleteDB, (req, res) => {
  res.status(200).json(res.locals);
});

// TODO: removing testing routes
apiRouter.get('/users/info', apiController.getAllUserInfo, (req, res) => {
  res.status(200).json(res.locals.userInfo);
});

export default apiRouter;
