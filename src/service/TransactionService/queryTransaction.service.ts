import { BadRequestError } from '../../helpers/api-erros';
import { TransactionRepository } from '../../repositories/transaction.repository';
import { UserRepository } from '../../repositories/user.repository';

class QueryTransactionService {
  private userRepository: UserRepository;
  private transactionRepository: TransactionRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.transactionRepository = new TransactionRepository();
  }

  async execute(userId: number) {
    const user = await this.userRepository.findByUserFeed(userId);
    if (!user) {
      throw new BadRequestError(`Usuário não encontrado.`);
    }

    const transactionsQuery = await this.transactionRepository.query(user.id);
    let available = 0;
    let waiting_funds = 0;
    for (const transaction of transactionsQuery) {
      if (transaction.payables === 'paid') {
        available += transaction.valuePayables;
      } else if (transaction.payables === 'waiting_funds') {
        waiting_funds += transaction.valuePayables;
      }
    }
    available = parseFloat(available.toFixed(2));
    waiting_funds = parseFloat(waiting_funds.toFixed(2));
    return {
      available,
      waiting_funds,
    };
  }
}
export { QueryTransactionService };
