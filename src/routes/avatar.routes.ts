import { Router } from 'express';

import { AvatarController } from '../controllers/AvatarController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

const avatarRoutes = Router();

const avatarController = new AvatarController();

avatarRoutes.post('/', ensureAuthenticated, avatarController.createAvatar);

export { avatarRoutes };
