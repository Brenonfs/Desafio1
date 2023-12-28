import { prisma } from '../database';

export class SessionRepository {
  users = [];
  async findByEmail(email: string) {
    const userExists = await prisma.user.findFirst({
      where: { email },
    });
    return userExists;
  }
}
