/* eslint-disable prettier/prettier */
import { BadRequestError, UnauthorizedError } from '../../helpers/api-erros';
import { AvatarRepository } from '../../repositories/avatar.repository';
import { UserRepository } from '../../repositories/user.repository';

// ...

class UpdateUserService {
  private userRepository: UserRepository;
  private avatarRepository: AvatarRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.avatarRepository = new AvatarRepository();
  }

  async execute(
    name: string,
    email: string,
    avatarFileId: number | null,
    userId: number
  ) {
    const userRepository = new UserRepository();
    const avatarRepository = new AvatarRepository();

    const userExists = await userRepository.findByUser(userId);

    if (!userExists) {
      throw new UnauthorizedError(`Usuário não encontrado.`);
    }

    let avatarExists;
    if (avatarFileId !== null) {
      avatarExists = await avatarRepository.findByAvatarId(avatarFileId);
    }

    if (!avatarExists) {
      throw new BadRequestError('Avatar não encontrado');
    }

    if (userId !== avatarExists.idPerson) {
      throw new UnauthorizedError('Esse avatar não pertence ao usuário.');
    }

    userExists.name = name !== undefined ? name : userExists.name;
    userExists.email = email !== undefined ? email : userExists.email;
    userExists.avatarFileId = avatarFileId  !== undefined ? avatarFileId : userExists.avatarFileId;


    const user = await this.userRepository.updateUser(
      userExists.name,
      userExists.email,
      userExists.avatarFileId as number,
      userId
    );
    return user;
  }
}




export { UpdateUserService };
