/* eslint-disable import/no-extraneous-dependencies */
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import { jwtConfig } from '../../configs/auth';
import { UnauthorizedError } from '../../helpers/api-erros';
import { SessionRepository } from '../../repositories/session.repository';

class CreateSessionService {
  private sessionRepository: SessionRepository;

  constructor() {
    this.sessionRepository = new SessionRepository();
  }
  async execute(email: string, password: string) {
    const userExist = await this.sessionRepository.findByEmail(email);

    if (!userExist) {
      throw new UnauthorizedError('Email e/ou senha incorreta');
    }
    const passwordMatched = await compare(password, userExist.password);

    if (!passwordMatched) {
      throw new UnauthorizedError('Email e/ou senha incorreta');
    }
    if (jwtConfig && jwtConfig.secret !== undefined) {
      const { secret, expiresIn } = jwtConfig;
      const token = sign({}, secret, {
        subject: String(userExist.id),
        expiresIn,
      });
      return {
        user: userExist,
        token,
      };
    }
  }
}

export { CreateSessionService };
