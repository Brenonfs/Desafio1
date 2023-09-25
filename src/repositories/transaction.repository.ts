import { prisma } from '../database';

export class TransactionRepository {
  transactions = [];

  async create(
    value: number,
    description: string,
    method: string,
    cardNumber: string,
    cardholderName: string,
    cardExpirationDate: string,
    cardVerificationCode: string,
    payables: string,
    valuePayables: number,
    paymentDate: Date,
  ) {
    const transaction = await prisma.transaction.create({
      data: {
        value,
        description,
        method,
        cardNumber,
        cardholderName,
        cardExpirationDate,
        cardVerificationCode,
        payables,
        valuePayables,
        paymentDate,
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
