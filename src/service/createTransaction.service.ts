import { BadRequestError } from '../helpers/api-erros';
import { TransactionRepository, TransactionData } from '../repositories/transaction.repository';

class CreateTransactionService {
  private transactionRepository: TransactionRepository;

  constructor() {
    this.transactionRepository = new TransactionRepository();
  }

  async execute(transactionData: TransactionData) {
    try {
      const newCardNumber = transactionData.cardNumber.split(' ').pop();

      const fee = transactionData.method === 'debit_card' ? 0.03 : 0.05;
      const valuePayables = transactionData.value - transactionData.value * fee;
      const payables = transactionData.method === 'debit_card' ? 'paid' : 'waiting_funds';

      const paymentDate =
        transactionData.method === 'debit_card' ? new Date() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // D+0 ou D+30

      const transactionInfo = {
        transactionData: {
          value: transactionData.value,
          description: transactionData.description,
          method: transactionData.method,
          cardNumber: newCardNumber as string,
          cardholderName: transactionData.cardholderName,
          cardExpirationDate: transactionData.cardExpirationDate,
          cardVerificationCode: transactionData.cardVerificationCode,
        },
        payables,
        valuePayables,
        paymentDate,
      };

      const transaction = await this.transactionRepository.create(transactionInfo);
      return transaction;
    } catch (error: any) {
      throw new BadRequestError(`Não foi possível criar a transação: ${error.message}`);
    }
  }
}

export { CreateTransactionService };
