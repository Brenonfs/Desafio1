import { Router } from 'express';

import { sessionRoutes } from './session.routes';
import { transactionRoutes } from './transaction.routes';
import { userRoutes } from './user.routes';

const router = Router();

router.use('/transaction', transactionRoutes);
router.use('/user', userRoutes);
router.use('/session', sessionRoutes);

export { router };
