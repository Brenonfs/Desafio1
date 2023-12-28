import { z } from 'zod';

export const avatarSchema = z.object({
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
