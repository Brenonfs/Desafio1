import { Router } from 'express';

import { TransactionController } from '../controllers/TransactionController';

const transactionRoutes = Router();

const transactionController = new TransactionController();

transactionRoutes.post('/', transactionController.create);
transactionRoutes.get('/list', transactionController.list);
transactionRoutes.get('/consult', transactionController.consult);
transactionRoutes.post('/excel', transactionController.exportTransactionToExcel);
transactionRoutes.get('/import', transactionController.importTransactionToExcel);

export { transactionRoutes };
