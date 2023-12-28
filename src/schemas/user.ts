import { z } from 'zod';

export const userCreateSchema = z.object({
  name: z
    .string({
      required_error: 'O  campo "name" está vazio',
      invalid_type_error: 'O  campo "name" tem caracteres inválidos',
    })
    .min(3, { message: 'O campo "name" está muito pequeno' }),
  email: z
    .string({
      required_error: 'O  campo "email" está vazio',
      invalid_type_error: 'O  campo "email" tem caracteres inválidos',
    })
    .email()
    .min(10, { message: 'O campo "email" está muito pequeno' }),
  password: z
    .string({
      required_error: 'O  campo "password" está vazio',
      invalid_type_error: 'O  campo "password" tem caracteres inválidos',
    })
    .min(3, { message: 'O campo "password" está muito pequeno' }),
  avatarFileId: z
    .number({
      invalid_type_error: 'O campo "avatarFileId" tem caracteres inválidos',
    })
    .nullable(),
});
export const userAvatarSchema = z.object({
  name: z
    .string({
      required_error: 'O  campo "name" está vazio',
      invalid_type_error: 'O  campo "name" tem caracteres inválidos',
    })
    .min(3, { message: 'O campo "name" está muito pequeno' }),
  key: z
    .string({
      required_error: 'O  campo "key" está vazio',
      invalid_type_error: 'O  campo "key" tem caracteres inválidos',
    })
    .min(3, { message: 'O campo "key" está muito pequeno' }),
  publicUrl: z
    .string({
      required_error: 'O  campo "publicUrl" está vazio',
      invalid_type_error: 'O  campo "publicUrl" tem caracteres inválidos',
    })
    .min(3, { message: 'O campo "publicUrl" está muito pequeno' }),
});
export const userUpdateSchema = z.object({
  name: z
    .string({
      required_error: 'O  campo "name" está vazio',
      invalid_type_error: 'O  campo "name" tem caracteres inválidos',
    })
    .min(3, { message: 'O campo "name" está muito pequeno' }),
  email: z
    .string({
      required_error: 'O  campo "email" está vazio',
      invalid_type_error: 'O  campo "email" tem caracteres inválidos',
    })
    .email()
    .min(10, { message: 'O campo "email" está muito pequeno' }),
  avatarFileId: z.number({
    required_error: 'O  campo "avatarFileId" está vazio',
    invalid_type_error: 'O  campo "avatarFileId" tem caracteres inválidos',
  }),
});
