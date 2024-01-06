/* eslint-disable prettier/prettier */
import { FileRepository } from '../../repositories/file.repository';


class CreateUserAvatarService {
  private fileRepository: FileRepository;

  constructor() {
    this.fileRepository = new FileRepository();
  }

  async execute(
    key:string,
    publicUrl:string,
    idPerson:number,

  ) {
    const avatarName = `${idPerson}_avatar`;
    const avatar = await this.fileRepository.saveAvatar(avatarName,key,publicUrl,idPerson);
    return avatar;
  }
}

export { CreateUserAvatarService };
