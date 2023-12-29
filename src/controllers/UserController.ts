/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';

import { BadRequestError, UnauthorizedError } from '../helpers/api-erros';
import { userAvatarSchema, userCreateSchema, userUpdateSchema } from '../schemas/user';
import { CreateUserService } from '../service/UserService/createUser.service';
import { CreateUserAvatarService } from '../service/UserService/createUserAvatar.service';
import { UpdateUserService } from '../service/UserService/updateUser.serviceA';
import { UploadAvatarUserService } from '../service/UserService/uploadAvatarUser.service';

export class UserController {
  async create(req: Request, res: Response) {
    const validatedUserSchema = userCreateSchema.safeParse(req.body);
    if (!validatedUserSchema.success) {
      throw new BadRequestError(`Não foi possível criar usuário.`);
    }

    const createUser = new CreateUserService();
    const result = await createUser.execute(
      validatedUserSchema.data.name,
      validatedUserSchema.data.email,
      validatedUserSchema.data.password,
      validatedUserSchema.data.avatarFileId,
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
      validatedUserSchema.data.avatarFileId,
      userId as number,
    );

    return res.json({
      error: false,
      message: 'Sucess: user updated',
      result,
    });
  }

  async createAvatar(req: Request, res: Response) {
    const validatedUserSchema = userAvatarSchema.safeParse(req.body);
    if (!validatedUserSchema.success) {
      throw new BadRequestError(`Não foi possível criar avatar.`);
    }
    const userId = (req as any).user?.id;
    if (userId === undefined) {
      throw new UnauthorizedError('Usuário não está autenticado.');
    }
    const userAvatar = new CreateUserAvatarService();
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

  async uploadAvatar(req: Request, res: Response) {
    const { file } = req;
    if (!file) {
      throw new BadRequestError('Error: upload');
    }
    const userAvatar = new UploadAvatarUserService();
    const result = await userAvatar.execute(file);
    return res.json({
      error: false,
      message: 'Sucesso: avatar done',
      result,
    });
  }
}
