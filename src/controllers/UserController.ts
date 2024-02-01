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
  private createUserService: CreateUserService;
  private updateUserService: UpdateUserService;
  private uploadAvatarService: UploadFileService;
  private importFileService: ImportFileService;
  private createUserAvatarService: CreateUserAvatarService;
  private feedUserService: FeedUserService;
  private listUserService: ListUserService;

  constructor() {
    this.createUserService = new CreateUserService();
    this.updateUserService = new UpdateUserService();
    this.uploadAvatarService = new UploadFileService();
    this.importFileService = new ImportFileService();
    this.createUserAvatarService = new CreateUserAvatarService();
    this.feedUserService = new FeedUserService();
    this.listUserService = new ListUserService();
  }

  create = async (req: Request, res: Response) => {
    const validatedUserSchema = userCreateSchema.safeParse(req.body);
    if (!validatedUserSchema.success) {
      throw new BadRequestError(`Não foi possível criar usuário.`);
    }

    const result = await this.createUserService.execute(
      validatedUserSchema.data.name,
      validatedUserSchema.data.email,
      validatedUserSchema.data.password,
      validatedUserSchema.data.avatarFileId,
    );
    return res.json({
      result,
    });
  };

  update = async (req: Request, res: Response) => {
    const validatedUserSchema = userUpdateSchema.safeParse(req.body);
    if (!validatedUserSchema.success) {
      throw new BadRequestError(`Não foi possível atualizar usuário.`);
    }
    const userId = (req as any).user?.id;
    if (userId === undefined) {
      throw new UnauthorizedError('Usuário não está autenticado.');
    }

    const result = await this.updateUserService.execute(
      validatedUserSchema.data.name,
      validatedUserSchema.data.avatarFileId,
      userId as number,
    );

    return res.json({
      result,
    });
  };

  createAvatar = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    if (userId === undefined) {
      throw new UnauthorizedError('Usuário não está autenticado.');
    }

    const { file } = req;
    if (!file) {
      throw new BadRequestError('Erro: upload');
    }
    const key = await this.uploadAvatarService.execute(file, userId);

    const avatarUrl = await this.importFileService.execute(key);
    if (avatarUrl === undefined) {
      throw new Error('A URL do avatar não foi obtida corretamente.');
    }

    const result = await this.createUserAvatarService.execute(key, avatarUrl, userId as number);

    return res.json({
      result,
    });
  };

  getFeed = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    if (userId === undefined) {
      throw new UnauthorizedError('Usuário não está autenticado.');
    }

    const user = await this.feedUserService.execute(userId);

    return res.json({
      result: user,
    });
  };
  listUsers = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;

    const result = await this.listUserService.execute(page, pageSize);

    return res.json({
      result,
    });
  };
}
