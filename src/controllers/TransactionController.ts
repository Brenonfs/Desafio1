import { Request, Response } from 'express';

import { BadRequestError } from '../helpers/api-erros';

// eslint-disable-next-line import/no-extraneous-dependencies
import { transactionCreateSchema } from '../schemas/transaction';
import { ImportAvatarService } from '../service/AvatarService/importAvatar.service';
import { CreateTransactionService } from '../service/TransactionService/createTransaction.service';
import { ExportTransactionService } from '../service/TransactionService/exportTransaction.service';
import { ListTransactionService } from '../service/TransactionService/listTransaction.service';
import { QueryTransactionService } from '../service/TransactionService/queryTransaction.service';

export class TransactionController {
  private listTransactionService: ListTransactionService;
  private queryTransactionService: QueryTransactionService;

  constructor() {
    this.listTransactionService = new ListTransactionService();
    this.queryTransactionService = new QueryTransactionService();
  }

  async create(req: Request, res: Response) {
    const validatedtransactionSchema = transactionCreateSchema.safeParse(req.body);
    if (!validatedtransactionSchema.success) {
      throw new BadRequestError(`Não foi possível fazer a transição.`);
    }
    const createTransaction = new CreateTransactionService();
    const result = await createTransaction.execute(
      validatedtransactionSchema.data.value,
      validatedtransactionSchema.data.description,
      validatedtransactionSchema.data.method,
      validatedtransactionSchema.data.cardNumber,
      validatedtransactionSchema.data.cardholderName,
      validatedtransactionSchema.data.cardExpirationDate,
      validatedtransactionSchema.data.cardVerificationCode,
    );
    return res.json({
      error: false,
      message: 'Sucesso: transaction done',
      result,
    });
  }

  async list(req: Request, res: Response) {
    const listTransaction = new ListTransactionService();
    const result = await listTransaction.execute();

    return res.json({
      error: false,
      message: 'Sucess: list transaction ',
      result,
    });
  }
  async exportTransactionToExcel(req: Request, res: Response) {
    const exportTransaction = new ExportTransactionService();
    const result = await exportTransaction.execute(res);

    return res.json({
      error: false,
      message: 'Sucess: query done',
      result,
    });
  }
  async importTransactionToExcel(req: Request, res: Response) {
    const importTransaction = new ImportAvatarService();
    const result = await importTransaction.execute(res);

    return res.json({
      error: false,
      message: 'Sucess: query done',
      result,
    });
  }

  async consult(req: Request, res: Response) {
    const queryTransaction = new QueryTransactionService();
    const result = await queryTransaction.execute();

    return res.json({
      error: false,
      message: 'Sucess: query done',
      result,
    });
  }
}
