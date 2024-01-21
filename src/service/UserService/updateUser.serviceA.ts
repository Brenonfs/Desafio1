/* eslint-disable prettier/prettier */
import { BadRequestError, UnauthorizedError } from '../../helpers/api-erros';
import { FileRepository } from '../../repositories/file.repository';
import { UserRepository } from '../../repositories/user.repository';

// ...

class UpdateUserService {
  private userRepository: UserRepository;
  private avatarRepository: FileRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.avatarRepository = new FileRepository();
  }

  async execute(
    name: string,
    avatarFileId: number | null,
    userId: number
  ) {
    const userRepository = new UserRepository();
    const avatarRepository = new FileRepository();

    const userExists = await userRepository.findByUser(userId);

    if (!userExists) {
      throw new UnauthorizedError(`Usuário não encontrado.`);
    }

    let avatarExists;
    if (avatarFileId !== null) {
      avatarExists = await avatarRepository.findAvatarById(avatarFileId);
    }

    if (!avatarExists) {
      throw new BadRequestError('Avatar não encontrado');
    }

    if (userId !== avatarExists.idPerson) {
      throw new UnauthorizedError('Esse avatar não pertence ao usuário.');
    }

    userExists.name = name !== undefined ? name : userExists.name;
    userExists.avatarFileId = avatarFileId  !== undefined ? avatarFileId : userExists.avatarFileId;


    const user = await this.userRepository.updateUser(
      userExists.name,
      userExists.avatarFileId as number,
      userId
    );
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarFileId:user.avatarFileId,
    };
  }
}




export { UpdateUserService };
