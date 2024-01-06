import { Router } from 'express';
import multer from 'multer';

import multerConfig from '../configs/multer';
import { UserController } from '../controllers/UserController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

const userRoutes = Router();
const upload = multer(multerConfig);
const userController = new UserController();

userRoutes.post('/', userController.create);
userRoutes.put('/', ensureAuthenticated, userController.update);
userRoutes.post('/upload', upload.single('image'), ensureAuthenticated, userController.createAvatar);

export { userRoutes };
