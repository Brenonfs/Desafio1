import { TransactionRepository } from '../../repositories/transaction.repository';

class CreateTransactionService {
  private transactionRepository: TransactionRepository;

  constructor() {
    this.transactionRepository = new TransactionRepository();
  }

  async execute(
    value: number,
    description: string,
    method: string,
    cardNumber: string,
    cardholderName: string,
    cardExpirationDate: string,
    cardVerificationCode: string,
  ) {
    const newCardNumber = cardNumber.split(' ').pop();
    const fee = method === 'debit_card' ? 0.03 : 0.05;
    const valuePayables = value - value * fee;
    const payables = method === 'debit_card' ? 'paid' : 'waiting_funds';
    const paymentDate = method === 'debit_card' ? new Date() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // D+0 ou D+30

    const transactionInfo = {
      value,
      description,
      method,
      cardNumber: newCardNumber as string,
      cardholderName,
      cardExpirationDate,
      cardVerificationCode,
      payables,
      valuePayables,
      paymentDate,
    };
    const transaction = await this.transactionRepository.create(transactionInfo);
    return transaction;
  }
}

export { CreateTransactionService };
