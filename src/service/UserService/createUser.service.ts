/* eslint-disable prettier/prettier */
import { UnauthorizedError } from '../../helpers/api-erros';
import { UserRepository } from '../../repositories/user.repository';

class CreateUserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async execute(name: string, email: string, password: string, avatarFileId: number | null) {
    const userExists = await this.userRepository.findByEmail(email);
    if (userExists) {
      throw new UnauthorizedError(`Este email ja está em uso.`);
    }
    const user = await this.userRepository.saveUser(name, email, password, avatarFileId);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarFileId:user.avatarFileId,
    };
  }
}
export { CreateUserService };
