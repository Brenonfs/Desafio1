import { Request, Response } from 'express';
import { BadRequestError } from '../helpers/api-erros';
import { sessionCreateSchema } from '../schemas/session';
import { CreateSessionService } from '../service/SessionService/createSession.service';

export class CreateSession {
  private createSessionService: CreateSessionService;

  constructor() {
    this.createSessionService = new CreateSessionService();
  }

  create = async (req: Request, res: Response) => {
    const validatedSessionSchema = sessionCreateSchema.safeParse(req.body);
    if (!validatedSessionSchema.success) {
      throw new BadRequestError(`Não foi possível criar avatar.`);
    }

    const result = await this.createSessionService.execute(
      validatedSessionSchema.data.email,
      validatedSessionSchema.data.password,
    );

    res.json({ result });
  };
}
