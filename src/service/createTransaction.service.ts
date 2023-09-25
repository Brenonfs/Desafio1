import { BadRequestError } from '../helpers/api-erros';
import { TransactionRepository } from '../repositories/transaction.repository';

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
    try {
      const newCardNumber = cardNumber.split(' ').pop();
      let payables: string;
      let valuePayables: number;
      let fee: number;
      if (method === 'debit_card') {
        fee = 0.03;
        valuePayables = value - value * fee;
        payables = 'paid';
      } else if (method === 'credit_card') {
        fee = 0.05;
        valuePayables = value - value * fee;
        payables = 'waiting_funds';
      } else {
        throw new BadRequestError(`Método de pagamento errado`);
      }
      const paymentDate = method === 'debit_card' ? new Date() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // D+0 ou D+30

      const transaction = await this.transactionRepository.create(
        value,
        description,
        method,
        newCardNumber as string,
        cardholderName,
        cardExpirationDate,
        cardVerificationCode,
        payables,
        valuePayables,
        paymentDate,
      );
      return transaction;
    } catch (error: any) {
      // Aqui você pode lidar com a exceção, por exemplo, logá-la ou lançar outra exceção personalizada
      throw new BadRequestError(`Não foi possível criar a transação: ${error.message}`);
    }
  }
}

export { CreateTransactionService };
