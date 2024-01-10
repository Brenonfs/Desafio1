// ListUserService.ts
import { FileRepository } from '../../repositories/file.repository';
import { UserRepository } from '../../repositories/user.repository';

export interface User {
  id: number;
  name: string;
  email: string;
  avatarFileId: number | null;
  avatarUrl?: string | null; // Adicione esta linha para a URL do avatar
}

export class ListUserService {
  private userRepository: UserRepository;
  private fileRepository: FileRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.fileRepository = new FileRepository();
  }

  async execute(page: number, pageSize: number) {
    const startIndex = (page - 1) * pageSize;

    const usersExists = await this.userRepository.listAll(startIndex, pageSize);

    const usersWithAvatarUrl: User[] = await Promise.all(
      usersExists.map(async (user) => {
        if (user.avatarFileId) {
          const file = await this.fileRepository.findAvatarUrlById(user.avatarFileId);
          return { ...user, avatarUrl: file?.publicUrl || null };
        } else {
          return { ...user, avatarUrl: null };
        }
      }),
    );

    return usersWithAvatarUrl;
  }
}
