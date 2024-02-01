import { TransactionRepository } from '../../repositories/transaction.repository';

class CreateTransactionService {
  private transactionRepository: TransactionRepository;

  constructor() {
    this.transactionRepository = new TransactionRepository();
  }

  async execute(
    name: string,
    value: number,
    description: string,
    method: string,
    cardNumber: string,
    cardholderName: string,
    cardExpirationDate: string,
    cardVerificationCode: string,
    userId: number,
  ) {
    const newCardNumber = cardNumber.split(' ').pop();
    const fee = method === 'debit_card' ? 0.03 : 0.05;
    const valuePayables = value - value * fee;
    const payables = method === 'debit_card' ? 'paid' : 'waiting_funds';
    const paymentDate = method === 'debit_card' ? new Date() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // D+0 ou D+30
    const transactionInfo = {
      name,
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
      userId,
      publicUrl: null,
      key: null,
    };
    const transaction = await this.transactionRepository.create(transactionInfo);
    return {
      name: transaction.name,
      value: transaction.value,
      description: transaction.description,
      method: transaction.method,
      cardNumber: transaction.cardNumber,
      cardholderName: transaction.cardholderName,
      cardExpirationDate: transaction.cardExpirationDate,
      payables: transaction.valuePayables,
      key: transaction.key,
      publicUrl: transaction.publicUrl,
    };
  }
}

export { CreateTransactionService };
