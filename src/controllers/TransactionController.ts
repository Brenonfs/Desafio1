/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';

import { BadRequestError, UnauthorizedError } from '../helpers/api-erros';
import { transactionCreateSchema, transactionExportSchema } from '../schemas/transaction';
import { ImportFileService } from '../service/FileService/importFile.service';
import { CreateTransactionService } from '../service/TransactionService/createTransaction.service';
import { ExportTransactionService } from '../service/TransactionService/exportTransaction.service';
import { ListTransactionService } from '../service/TransactionService/listTransaction.service';
import { QueryTransactionService } from '../service/TransactionService/queryTransaction.service';
import { UpdateTransactionService } from '../service/TransactionService/updateTrasaction.service';

export class TransactionController {
  private listTransactionService: ListTransactionService;
  private queryTransactionService: QueryTransactionService;
  private createTransactionService: CreateTransactionService;
  private exportTransactionService: ExportTransactionService;
  private importFileService: ImportFileService;
  private updateTransactionService: UpdateTransactionService;

  constructor() {
    this.listTransactionService = new ListTransactionService();
    this.queryTransactionService = new QueryTransactionService();
    this.createTransactionService = new CreateTransactionService();
    this.exportTransactionService = new ExportTransactionService();
    this.importFileService = new ImportFileService();
    this.updateTransactionService = new UpdateTransactionService();
  }

  create = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    if (userId === undefined) {
      throw new UnauthorizedError('Usuário não está autenticado.');
    }
    const validatedtransactionSchema = transactionCreateSchema.safeParse(req.body);
    if (!validatedtransactionSchema.success) {
      throw new BadRequestError(`Não foi possível fazer a transição.`);
    }

    const transaction = await this.createTransactionService.execute(
      validatedtransactionSchema.data.name,
      validatedtransactionSchema.data.value,
      validatedtransactionSchema.data.description,
      validatedtransactionSchema.data.method,
      validatedtransactionSchema.data.cardNumber,
      validatedtransactionSchema.data.cardholderName,
      validatedtransactionSchema.data.cardExpirationDate,
      validatedtransactionSchema.data.cardVerificationCode,
      userId as number,
    );

    return res.json({
      transaction,
    });
  };

  list = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    if (userId === undefined) {
      throw new UnauthorizedError('Usuário não está autenticado.');
    }

    const result = await this.listTransactionService.execute(userId);
    return res.json({
      result,
    });
  };
  exportTransaction = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    if (userId === undefined) {
      throw new UnauthorizedError('Usuário não está autenticado.');
    }
    const validatedtransactionSchema = transactionExportSchema.safeParse(req.body);
    if (!validatedtransactionSchema.success) {
      throw new BadRequestError(`Não foi possível fazer a transição.`);
    }

    const key = await this.exportTransactionService.execute(userId, validatedtransactionSchema.data.name);
    if (key === undefined) {
      throw new BadRequestError('Falha com conexão com AWS S3.');
    }

    const excelUrl = await this.importFileService.execute(key);
    if (excelUrl === undefined) {
      throw new BadRequestError('A URL do avatar não foi obtida corretamente.');
    }
    const result = await this.updateTransactionService.execute(
      userId,
      validatedtransactionSchema.data.name,
      key,
      excelUrl,
    );
    return res.json({
      result,
    });
  };

  consult = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    if (userId === undefined) {
      throw new UnauthorizedError('Usuário não está autenticado.');
    }
    const result = await this.queryTransactionService.execute(userId);
    return res.json({
      result,
    });
  };
}
