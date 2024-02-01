import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

export const jwtConfig = {
  secret: process.env.AUTH_SECRET,
  expiresIn: '1d',
};
