import { TransactionRepository } from '../../repositories/transaction.repository';

class ListTransactionService {
  private transactionRepository: TransactionRepository;

  constructor() {
    this.transactionRepository = new TransactionRepository();
  }

  async execute() {
    const transactionsExists = await this.transactionRepository.listAll();
    return transactionsExists;
  }
}
export { ListTransactionService };
