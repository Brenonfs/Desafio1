/* eslint-disable prettier/prettier */
import { UserRepository } from '../../repositories/user.repository';
import S3Storage from '../../utils/S3Storage';

class UploadFileUserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async execute(file: Express.Multer.File, userId: number) : Promise<string> {
    const s3Storage = new S3Storage();
    // await s3Storage.saveFile(file.filename);
    const key = `avatars/user${userId}/${file.originalname}`;

    await s3Storage.saveFile(file.filename, key)

    return key;
  }
}
export { UploadFileUserService };
