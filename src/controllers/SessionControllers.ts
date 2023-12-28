import { Request, Response } from 'express';

import { BadRequestError } from '../helpers/api-erros';
import { sessionCreateSchema } from '../schemas/session';
import { CreateSessionService } from '../service/SessionService/createSession.service';

export class CreateSession {
  async create(req: Request, res: Response) {
    const validatedSessionSchema = sessionCreateSchema.safeParse(req.body);
    if (!validatedSessionSchema.success) {
      throw new BadRequestError(`Não foi possível criar avatar.`);
    }
    const createSessionService = new CreateSessionService();
    const result = await createSessionService.execute(
      validatedSessionSchema.data.email,
      validatedSessionSchema.data.password,
    );

    return res.json({
      error: false,
      message: 'Sucess',
      result,
    });
  }
}
