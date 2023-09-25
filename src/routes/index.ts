import { Router } from 'express';

import { transactionRoutes } from './transaction.routes';

const router = Router();
router.use('/transaction', transactionRoutes);

export { router };
