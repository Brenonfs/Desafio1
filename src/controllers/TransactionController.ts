import { Request, Response } from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies

import { BadRequestError, UnauthorizedError } from '../helpers/api-erros';
import { transactionCreateSchema } from '../schemas/transaction';
import { CreateTransactionService } from '../service/createTransaction.service';
import { ListTransactionService } from '../service/listTransaction.service';
import { QueryTransactionService } from '../service/queryTransaction.service';

export class TransactionController {
  private listTransactionService: ListTransactionService;
  private queryTransactionService: QueryTransactionService;

  constructor() {
    this.listTransactionService = new ListTransactionService();
    this.queryTransactionService = new QueryTransactionService();
  }

  async create(req: Request, res: Response) {
    try {
      const validatedtransactionSchema = transactionCreateSchema.parse(req.body);
      console.log('temos isso aqui');
      const createTransaction = new CreateTransactionService();
      const result = await createTransaction.execute(
        validatedtransactionSchema.value,
        validatedtransactionSchema.description,
        validatedtransactionSchema.method,
        validatedtransactionSchema.cardNumber,
        validatedtransactionSchema.cardholderName,
        validatedtransactionSchema.cardExpirationDate,
        validatedtransactionSchema.cardVerificationCode,
      );
      return res.json({
        error: false,
        message: 'Sucesso: transaction done',
        result,
      });
    } catch (error) {
      console.error('Erro durante a execução do método create:', error);
      throw new BadRequestError(`Não foi possível fazer a transição: ${error}`);
    }
  }

  async list(req: Request, res: Response) {
    try {
      const listTransaction = new ListTransactionService();
      const result = await listTransaction.execute();

      return res.json({
        error: false,
        message: 'Sucess: list transaction ',
        result,
      });
    } catch (error) {
      throw new UnauthorizedError(`Não foi possível listar as transições: ${error}`);
    }
  }
  async consult(req: Request, res: Response) {
    try {
      const queryTransaction = new QueryTransactionService();
      const result = await queryTransaction.execute();

      return res.json({
        error: false,
        message: 'Sucess: query done',
        result,
      });
    } catch (error) {
      throw new UnauthorizedError(`Não foi possível consultar: ${error}`);
    }
  }
}
