import { BadRequestError } from '../../helpers/api-erros';
import { TransactionRepository } from '../../repositories/transaction.repository';
import { UserRepository } from '../../repositories/user.repository';

class ListTransactionService {
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

    const transactionsExists = await this.transactionRepository.listAll(user.id);
    return transactionsExists;
  }
}
export { ListTransactionService };
