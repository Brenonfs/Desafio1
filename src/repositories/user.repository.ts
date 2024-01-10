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
  async findByUserFeed(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: {
        id: true,
        name: true,
        email: true,
        avatarFileId: true,
      },
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
  async updateUser(name: string, avatarFileId: number, userId: number) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        avatarFileId,
      },
    });
    return user;
  }
  async listAll(startIndex: number, pageSize: number) {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        avatarFileId: true,
      },
      skip: startIndex, // Pular registros até o índice de início
      take: pageSize, // Retornar apenas a quantidade especificada de registros
    });

    return users;
  }
}

export default new UserRepository();
