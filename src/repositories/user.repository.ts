/* eslint-disable import/no-extraneous-dependencies */
import { hash } from 'bcryptjs';

import { prisma } from '../database';

export class UserRepository {
  users = [];
  async saveUser(name: string, email: string, password: string, avatarFileId: number | null) {
    const hashedPassword = await hash(password, 8);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, avatarFileId },
    });
    return user;
  }
  async findByUser(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });
    return user;
  }
  async findByEmail(email: string) {
    const userExists = await prisma.user.findFirst({
      where: { email },
    });
    return userExists;
  }
  async findById(id: number) {
    const userExists = await prisma.user.findFirst({
      where: { id },
    });
    return userExists;
  }
  async updateUser(name: string, email: string, avatarFileId: number, userId: number) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        avatarFileId,
      },
    });
    return user;
  }
}

export default new UserRepository();
