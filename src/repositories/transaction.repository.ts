/* eslint-disable @typescript-eslint/naming-convention */
import { prisma } from '../database';

export interface TransactionData {
  name: string;
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
  userId: number;
  publicUrl: null;
  key: null;
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

  async listAll(userId: number) {
    const transactionsExists = await prisma.transaction.findMany({
      where: { userId: Number(userId) },
      select: {
        value: true,
        description: true,
        method: true,
        cardNumber: true,
        cardholderName: true,
        cardExpirationDate: true,
      },
    });
    return transactionsExists;
  }
  async findTransiction(userId: number, name: string) {
    const transactionsExists = await prisma.transaction.findUnique({
      where: { userId: Number(userId), name },
    });
    return transactionsExists;
  }
  async query(userId: number) {
    const transactionsExists = await prisma.transaction.findMany({
      where: { userId: Number(userId) },
    });
    return transactionsExists;
  }
  async update(userId: number, name: string, key: string, excelUrl: string) {
    const user = await prisma.transaction.update({
      where: { userId: Number(userId), name },
      data: {
        key,
        publicUrl: excelUrl,
      },
    });
    return user;
  }
}
