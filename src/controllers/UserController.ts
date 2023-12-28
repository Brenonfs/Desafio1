import { Request, Response } from 'express';

import { BadRequestError, UnauthorizedError } from '../helpers/api-erros';
import { userCreateSchema, userUpdateSchema } from '../schemas/user';
import { CreateUserService } from '../service/UserService/createUser.service';
import { UpdateUserService } from '../service/UserService/updateUser.serviceA';

export class UserController {
  async create(req: Request, res: Response) {
    console.log('to aqui');
    const validatedUserSchema = userCreateSchema.parse(req.body);
    if (!validatedUserSchema) {
      throw new BadRequestError(`Não foi possível criar usuário.`);
    }
    console.log('to aqui2');
    const createUser = new CreateUserService();
    const result = await createUser.execute(
      validatedUserSchema.name,
      validatedUserSchema.email,
      validatedUserSchema.password,
      validatedUserSchema.avatarFileId,
    );
    return res.json({
      error: false,
      message: 'Sucesso: user done',
      result,
    });
  }
  async update(req: Request, res: Response) {
    const updateUserService = new UpdateUserService();
    const validatedUserSchema = userUpdateSchema.safeParse(req.body);
    if (!validatedUserSchema.success) {
      throw new BadRequestError(`Não foi possível atualizar usuário.`);
    }
    const userId = (req as any).user?.id;
    if (userId === undefined) {
      throw new UnauthorizedError('Usuário não está autenticado.');
    }
    const result = await updateUserService.execute(
      validatedUserSchema.data.name,
      validatedUserSchema.data.email,
      validatedUserSchema.data.avatarFileId,
      userId as number,
    );

    return res.json({
      error: false,
      message: 'Sucess: user updated',
      result,
    });
  }
}
