import { Request, Response } from 'express';
// import{ ApiError} from '../helpers/api-erros';
export const errorMiddleware = (
  error: Error & Partial<Response>, // altera
  req: Request,
  res: Response,
) => {
  const statusCode = error.statusCode ?? 500;
  const message = error.statusCode ? error.message : 'Internal Server Error';
  return res.status(statusCode).json({ message });
};
