import { z } from 'zod';

export const sessionCreateSchema = z.object({
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
});
