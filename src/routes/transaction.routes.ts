import { Router } from 'express';

import { TransactionController } from '../controllers/TransactionController';

import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

const transactionRoutes = Router();

const transactionController = new TransactionController();

transactionRoutes.post('/', ensureAuthenticated, transactionController.create);
transactionRoutes.get('/list', ensureAuthenticated, transactionController.list);
transactionRoutes.get('/consult', ensureAuthenticated, transactionController.consult);
transactionRoutes.post('/export', ensureAuthenticated, transactionController.exportTransaction);
// transactionRoutes.get('/import', ensureAuthenticated, transactionController.importTransactionToExcel);

export { transactionRoutes };
