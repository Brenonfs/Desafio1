/* eslint-disable prettier/prettier */
import { UserRepository } from '../../repositories/user.repository';
import S3Storage from '../../utils/S3Storage';

export class UploadFileService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async execute(file: Express.Multer.File, userId: number) : Promise<string> {
    const s3Storage = new S3Storage();

    const key = `avatars/user/${userId}/${file.originalname}`;

    await s3Storage.saveFile(file.filename, key)

    return key;
  }
}

