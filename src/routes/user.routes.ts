import { Router } from 'express';

import { UserController } from '../controllers/UserController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

const userRoutes = Router();

const userController = new UserController();

userRoutes.post('/', userController.create);
userRoutes.put('/', ensureAuthenticated, userController.update);
export { userRoutes };
