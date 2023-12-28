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
  payables: string;
  valuePayables: number;
  paymentDate: Date;
}

export class TransactionRepository {
  transactions = [];

  async create(transactionData: TransactionData) {
    const transaction = await prisma.transaction.create({
      data: {
        ...transactionData,
      },
    });
    return transaction;
  }
  async getAllTransactions() {
    const transactions = await prisma.transaction.findMany();
    return transactions;
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
