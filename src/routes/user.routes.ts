import { Router } from 'express';
import multer from 'multer';

import multerConfig from '../configs/multer';
import { UserController } from '../controllers/UserController';
import { adminAuthenticated } from '../middlewares/adminAuthenticated';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

const userRoutes = Router();
const upload = multer(multerConfig);
const userController = new UserController();

userRoutes.post('/', userController.create);
userRoutes.get('/', ensureAuthenticated, userController.getFeed);
userRoutes.put('/', ensureAuthenticated, userController.update);
userRoutes.post('/upload', upload.single('image'), ensureAuthenticated, userController.createAvatar);
userRoutes.get('/list', adminAuthenticated, userController.listUsers);

export { userRoutes };
