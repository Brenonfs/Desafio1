import { z } from 'zod';
const allowedMethods = ['debit_card', 'credit_card'];
export const transactionCreateSchema = z.object({
  name: z
    .string({
      required_error: 'O  campo "name" está vazio',
      invalid_type_error: 'O  campo "name" tem caracteres inválidos',
    })
    .min(3, { message: 'O campo "name" está muito pequeno' }),

  value: z.number({
    required_error: 'O  campo "title" está vazio',
    invalid_type_error: 'O  campo "title" tem caracteres inválidos',
  }),

  description: z
    .string({
      required_error: 'O  campo "description" está vazio',
      invalid_type_error: 'O  campo "description" tem caracteres inválidos',
    })
    .min(3, { message: 'O campo "description" está muito pequeno' }),

  method: z
    .string({
      required_error: 'O  campo "  method" está vazio',
      invalid_type_error: 'O  campo "  method" tem caracteres inválidos',
    })
    .min(3, { message: 'O campo "  method" está muito pequeno' })
    .refine((method) => allowedMethods.includes(method), {
      message: 'O campo "method" deve ser "debit_card" ou "credit_card"',
    }),

  cardNumber: z
    .string({
      required_error: 'O  campo "cardNumber" está vazio',
      invalid_type_error: 'O  campo "cardNumber" tem caracteres inválidos',
    })
    .refine((cardNumber) => cardNumber.length === 19, {
      message: 'O campo "cardNumber" deve ter exatamente 19 caracteres',
    }),

  cardholderName: z
    .string({
      required_error: 'O  campo "CardholderName" está vazio',
      invalid_type_error: 'O  campo "CardholderName" tem caracteres inválidos',
    })
    .min(3, { message: 'O campo "  CardExpirationDate" está muito pequeno' }),

  cardExpirationDate: z
    .string({
      required_error: 'O  campo "  CardExpirationDate" está vazio',
      invalid_type_error: 'O  campo "  CardExpirationDate" tem caracteres inválidos',
    })
    .min(3, { message: 'O campo "  CardExpirationDate" está muito pequeno' }),

  cardVerificationCode: z
    .string({
      required_error: 'O  campo "CardVerificationCode" está vazio',
      invalid_type_error: 'O  campo "CardVerificationCode" tem caracteres inválidos',
    })
    .min(3, { message: 'O campo "CardVerificationCode" está muito pequeno' }),
});
export const transactionExportSchema = z.object({
  name: z
    .string({
      required_error: 'O  campo "name" está vazio',
      invalid_type_error: 'O  campo "name" tem caracteres inválidos',
    })
    .min(3, { message: 'O campo "name" está muito pequeno' }),
});
