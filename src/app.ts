import express, { Request, Response } from 'express';

// eslint-disable-next-line import/no-extraneous-dependencies
import 'express-async-errors';
// eslint-disable-next-line import/no-extraneous-dependencies
import dotenv from 'dotenv';

import 'dotenv/config';
import { BadRequestError, UnauthorizedError } from './helpers/api-erros';
import { router } from './routes';

dotenv.config();
const app = express();

app.use(express.json());
app.use(router);

app.use((error: Error, req: Request, res: Response) => {
  if (error instanceof UnauthorizedError) {
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
  }
  if (error instanceof BadRequestError) {
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
  }

  console.error(error);

  return res.status(500).json({
    status: 'error',
    message: 'internal error',
  });
});

export { app };
