/* eslint-disable import/no-extraneous-dependencies */

import { prisma } from '../database';

export class FileRepository {
  async saveAvatar(name: string, key: string, publicUrl: string, idPerson: number) {
    const user = await prisma.files.create({
      data: { name, key, publicUrl, idPerson },
    });
    return user;
  }
  async findAvatarById(avatarFileId: number) {
    const avatarExist = await prisma.files.findUnique({
      where: { id: Number(avatarFileId) },
    });
    return avatarExist;
  }
  async findAvatarUrlById(avatarFileId: number) {
    const avatar = await prisma.files.findUnique({
      where: { id: Number(avatarFileId) },
      select: {
        publicUrl: true,
      },
    });
    return avatar;
  }
}
