import { Router } from 'express';
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage });
import apiController from '../controllers/apiController.js';
const apiRouter = Router();
apiRouter.post(
  '/',
  apiController.verifyUserExists,
  apiController.sendLatestRelationships,
  (req, res) => {
    res.status(200).json(res.locals);
  }
);
apiRouter.post(
  '/signup',
  upload.single('image'),
  apiController.storeUploadedMedia,
  apiController.createNewUserNode,
  apiController.createNewUserRecommendations,
  apiController.sendLatestRelationships,
  (req, res) => {
    res.status(200).json(res.locals);
  }
);
apiRouter.post('/likes', apiController.createLikesOrMatch, (req, res) => {
  res.status(200).json(res.locals);
});
apiRouter.post('/dislikes', apiController.removeRelationships, (req, res) => {
  res.status(200).json(res.locals);
});
apiRouter.post(
  '/chats',
  apiController.postNewChats,
  apiController.sendLatestRelationships,
  (req, res) => {
    res.status(200).json(res.locals);
  }
);
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
apiRouter.get('/users/info', apiController.getAllUserInfo, (req, res) => {
  res.status(200).json(res.locals.userInfo);
});
export default apiRouter;
