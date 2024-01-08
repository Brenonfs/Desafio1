/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';

import { BadRequestError, UnauthorizedError } from '../helpers/api-erros';
import { userCreateSchema, userUpdateSchema } from '../schemas/user';
import { ImportFileService } from '../service/FileService/importFile.service';
import { UploadFileService } from '../service/FileService/uploadFile.service';
import { CreateUserService } from '../service/UserService/createUser.service';
import { CreateUserAvatarService } from '../service/UserService/createUserAvatar.service';
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
    console.log(file);

    // Upload do arquivo
    const key = await uploadAvatar.execute(file, userId);

    // Obtenção da URL do arquivo
    const importService = new ImportFileService();
    const avatarUrl = await importService.execute(key);
    if (avatarUrl === undefined) {
      throw new Error('A URL do avatar não foi obtida corretamente.');
    }
    // Criação do avatar
    const result = await userAvatar.execute(key, avatarUrl, userId as number);

    return res.json({
      error: false,
      message: 'Sucesso: avatar done',
      result,
    });
  }
}
