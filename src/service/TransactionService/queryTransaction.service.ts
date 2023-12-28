import { TransactionRepository } from '../../repositories/transaction.repository';

class QueryTransactionService {
  private transactionRepository: TransactionRepository;

  constructor() {
    this.transactionRepository = new TransactionRepository();
  }

  async execute() {
    const transactionsQuery = await this.transactionRepository.query();
    let available = 0;
    let waiting_funds = 0;
    for (const transaction of transactionsQuery) {
      if (transaction.payables === 'paid') {
        available += transaction.valuePayables;
      } else if (transaction.payables === 'waiting_funds') {
        waiting_funds += transaction.valuePayables;
      }
    }
    return {
      available,
      waiting_funds,
    };
  }
}
export { QueryTransactionService };
