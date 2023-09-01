import express from 'express';
import multer from 'multer';

// memoryStorage engine stores uploads in the server's file system memory (i.e. not disk) as Buffer objects; we can access entire files from req.file.buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// import controller
import apiController from '../controllers/controller.js';

// create router
const apiRouter = express.Router();

// Get User with a cookie / token their profile info

// Login route

apiRouter.post(
  '/',
  apiController.verifyUserExists,
  apiController.sendLatestRelationships,
  (req, res) => {
    res.status(200).json(res.locals);
  }
);

// Signup route

apiRouter.post(
  '/signup',
  // express doesn't handle multipart form data; here, multer's upload middleware handles uploads in memory
  upload.single('image'),
  apiController.storeUploadedMedia,
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

// Logout route

// apiRouter.post('/logout', apiController.logout, (req, res) => {
//   res.status(200).json({});
// });

// TEST ROUTES to get user and relationship info, and clean DB (TO BE REMOVED LATER)

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
