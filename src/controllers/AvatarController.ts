import { Request, Response } from 'express';

import { BadRequestError, UnauthorizedError } from '../helpers/api-erros';
import { avatarSchema } from '../schemas/avatar';
import { CreateAvatarService } from '../service/AvatarService/createAvatar.service';

export class AvatarController {
  async createAvatar(req: Request, res: Response) {
    const validatedUserSchema = avatarSchema.safeParse(req.body);
    if (!validatedUserSchema.success) {
      throw new BadRequestError(`Não foi possível criar avatar.`);
    }
    const userId = (req as any).user?.id;
    if (userId === undefined) {
      throw new UnauthorizedError('Usuário não está autenticado.');
    }
    const userAvatar = new CreateAvatarService();
    const result = await userAvatar.execute(
      validatedUserSchema.data.name,
      validatedUserSchema.data.key,
      validatedUserSchema.data.publicUrl,
      userId as number,
    );
    return res.json({
      error: false,
      message: 'Sucesso: avatar done',
      result,
    });
  }
}
