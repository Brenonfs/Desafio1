/* eslint-disable prettier/prettier */
import { UserRepository } from '../../repositories/user.repository';
import S3Storage from '../../utils/S3Storage';

class UploadAvatarUserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async execute(file: Express.Multer.File) : Promise<void> {
    const s3Storage = new S3Storage();
    await s3Storage.saveFile(file.filename); // Pass the filename instead of the entire file object

  }
}
export { UploadAvatarUserService };
