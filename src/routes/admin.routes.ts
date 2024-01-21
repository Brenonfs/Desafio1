import { Router } from 'express';

import { AdminController } from '../controllers/AdminController';

const adminRoutes = Router();

const adminController = new AdminController();

adminRoutes.get('/users', adminController.list);

export { adminRoutes };
