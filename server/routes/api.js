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
apiRouter.get(
  '/api/likes/:emailA/:emailB',
  apiController.createLikesOrMatch,
  (req, res) => {
    res.status(200).json(res.locals.BtoARelationship);
  }
);

// User A dislikes or unmatches User B
apiRouter.get(
  '/api/dislikes/:emailA/:emailB',
  apiController.removeRelationships,
  (req, res) => {
    res.status(200).json(res.locals.removedRelationships);
  }
);

export default apiRouter;
