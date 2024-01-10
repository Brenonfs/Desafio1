import { BadRequestError } from '../../helpers/api-erros';
import { FileRepository } from '../../repositories/file.repository';
import { UserRepository } from '../../repositories/user.repository';

export class FeedUserService {
  private userRepository: UserRepository;
  private fileRepository: FileRepository;
  constructor() {
    this.userRepository = new UserRepository();
    this.fileRepository = new FileRepository();
  }

  async execute(userId: number) {
    const user = await this.userRepository.findByUserFeed(userId);
    if (!user) {
      throw new BadRequestError(`Usuário não encontrado.`);
    }
    if (!user.avatarFileId) {
      throw new BadRequestError(`Usuário não encontrado.`);
    }

    const file = await this.fileRepository.findAvatarUrlById(user.avatarFileId);
    if (!file) {
      throw new BadRequestError(`File não encontrado.`);
    }
    const avatarUrl = file.publicUrl;
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      avatarUrl,
    };
  }
}
