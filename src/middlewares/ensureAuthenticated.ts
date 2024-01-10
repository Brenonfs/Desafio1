/* eslint-disable import/no-extraneous-dependencies */
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import { jwtConfig } from '../configs/auth';
import { UnauthorizedError } from '../helpers/api-erros';

// Move the declaration merging outside the function
declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: number;
    };
  }
}

const ensureAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next();
  }

  const [, token] = authHeader.split(' ');

  try {
    if (jwtConfig && jwtConfig.secret !== undefined) {
      const decodedToken = verify(token, jwtConfig.secret) as { sub: string };
      req.user = {
        id: Number(decodedToken.sub),
      };
      return next();
    } else {
      throw new Error('JWT configuration is not properly set');
    }
  } catch {
    throw new UnauthorizedError('JWT Token invalid');
  }
};

export { ensureAuthenticated };
