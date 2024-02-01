import { TransactionRepository } from '../../repositories/transaction.repository';

class UpdateTransactionService {
  private transactionRepository: TransactionRepository;

  constructor() {
    this.transactionRepository = new TransactionRepository();
  }

  async execute(userId: number, name: string, key: string, excelUrl: string) {
    const updateTransaction = await this.transactionRepository.update(userId, name, key, excelUrl);

    return {
      name: updateTransaction.name,
      value: updateTransaction.value,
      description: updateTransaction.description,
      method: updateTransaction.method,
      cardNumber: updateTransaction.cardNumber,
      cardholderName: updateTransaction.cardholderName,
      cardExpirationDate: updateTransaction.cardExpirationDate,
      key: updateTransaction.key,
      publicUrl: updateTransaction.publicUrl,
    };
  }
}

export { UpdateTransactionService };
