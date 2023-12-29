/* eslint-disable prettier/prettier */
import { FileRepository } from '../../repositories/file.repository';


class CreateUserAvatarService {
  private fileRepository: FileRepository;

  constructor() {
    this.fileRepository = new FileRepository();
  }

  async execute(
    name: string,
    key:string,
    publicUrl:string,
    idPerson:number,
  ) {
    const avatar = await this.fileRepository.saveAvatar(name,key,publicUrl,idPerson);
    return avatar;
  }
}

export { CreateUserAvatarService };
