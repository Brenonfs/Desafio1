import { Request, Response, NextFunction } from 'express';

import { UnauthorizedError } from '../helpers/api-erros';

const adminAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const { secret } = req.headers;

  if (!secret) {
    throw new UnauthorizedError('JWT Token admin não informado ');
  } //
  try {
    if (secret === process.env.SECRET_TOKEN) {
      return next();
    } else {
      throw new Error('JWT  admin configuration is not properly set');
    }
  } catch {
    throw new UnauthorizedError('JWT Token admin invalid');
  }
};

export { adminAuthenticated };
