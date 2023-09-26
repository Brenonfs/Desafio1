/* eslint-disable @typescript-eslint/naming-convention */
import { prisma } from '../database';

export interface TransactionData {
  value: number;
  description: string;
  method: string;
  cardNumber: string;
  cardholderName: string;
  cardExpirationDate: string;
  cardVerificationCode: string;
}

export class TransactionRepository {
  transactions = [];

  async create(data: { transactionData: TransactionData; payables: string; valuePayables: number; paymentDate: Date }) {
    const transaction = await prisma.transaction.create({
      data: {
        ...data.transactionData,
        payables: data.payables,
        valuePayables: data.valuePayables,
        paymentDate: data.paymentDate,
      },
    });
    return transaction;
  }

  async listAll() {
    const transactionsExists = await prisma.transaction.findMany({
      select: {
        value: true,
        description: true,
        method: true,
        cardNumber: true,
        cardholderName: true,
        cardExpirationDate: true,
        cardVerificationCode: true,
      },
    });
    return transactionsExists;
  }
  async query() {
    const transactionsExists = await prisma.transaction.findMany();
    return transactionsExists;
  }
}
