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
userRoutes.post('/avatar', ensureAuthenticated, userController.createAvatar); // Corregir aquí
userRoutes.post('/upload', upload.single('image'), userController.uploadAvatar); // Corregir aquí

export { userRoutes };
