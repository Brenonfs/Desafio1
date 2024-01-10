/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';

import { BadRequestError, UnauthorizedError } from '../helpers/api-erros';
import { userCreateSchema, userUpdateSchema } from '../schemas/user';
import { ImportFileService } from '../service/FileService/importFile.service';
import { UploadFileService } from '../service/FileService/uploadFile.service';
import { CreateUserService } from '../service/UserService/createUser.service';
import { CreateUserAvatarService } from '../service/UserService/createUserAvatar.service';
import { FeedUserService } from '../service/UserService/feedUser.service';
import { ListUserService } from '../service/UserService/listUser.service';
import { UpdateUserService } from '../service/UserService/updateUser.serviceA';

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
      result,
    });
  }

  async createAvatar(req: Request, res: Response) {
    const userId = (req as any).user?.id;
    if (userId === undefined) {
      throw new UnauthorizedError('Usuário não está autenticado.');
    }

    const userAvatar = new CreateUserAvatarService();
    const uploadAvatar = new UploadFileService();

    const { file } = req;
    if (!file) {
      throw new BadRequestError('Erro: upload');
    }
    const key = await uploadAvatar.execute(file, userId);

    const importService = new ImportFileService();
    const avatarUrl = await importService.execute(key);
    if (avatarUrl === undefined) {
      throw new Error('A URL do avatar não foi obtida corretamente.');
    }

    const result = await userAvatar.execute(key, avatarUrl, userId as number);

    return res.json({
      result,
    });
  }
  async getFeed(req: Request, res: Response) {
    const userId = (req as any).user?.id;
    if (userId === undefined) {
      throw new UnauthorizedError('Usuário não está autenticado.');
    }

    const feedUserService = new FeedUserService();
    const user = await feedUserService.execute(userId);

    return res.json({
      result: user,
    });
  }
  async listUsers(req: Request, res: Response) {
    const listUser = new ListUserService();
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;

    const result = await listUser.execute(page, pageSize);

    return res.json({
      result,
    });
  }
}
