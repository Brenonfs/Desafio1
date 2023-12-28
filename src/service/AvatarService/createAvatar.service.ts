/* eslint-disable prettier/prettier */
import { AvatarRepository } from '../../repositories/avatar.repository';


class CreateAvatarService {
  private avatarRepository: AvatarRepository;

  constructor() {
    this.avatarRepository = new AvatarRepository();
  }

  async execute(
    name: string,
    key:string,
    publicUrl:string,
    idPerson:number,
  ) {
    const avatar = await this.avatarRepository.saveAvatar(name,key,publicUrl,idPerson);
    return avatar;
  }
}

export { CreateAvatarService };
