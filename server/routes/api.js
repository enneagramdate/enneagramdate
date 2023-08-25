import express from 'express';

// import controller
import apiController from '../controllers/controller.js';

// create router
const apiRouter = express.Router();

// Login route (native auth with Passport)

// Signup route (native auth with Passport)
apiRouter.post(
  '/signup',
  apiController.createNewUserNode,
  apiController.createNewUserRecommendations,
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

export default apiRouter;
