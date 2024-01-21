/* eslint-disable import/no-extraneous-dependencies */
import AWS from 'aws-sdk-mock';
import faker from 'faker';
import path from 'path';
import request from 'supertest';

import { app } from './app';
import { ImportFileService } from './service/FileService/importFile.service';
import { ExportTransactionService } from './service/TransactionService/exportTransaction.service';
import { generateCardNumber, generateCardVerificationCode } from './utils/cardGenerator';

const secretToken = process.env.SECRET_TOKEN;
if (!secretToken) {
  throw new Error('A variável de ambiente SECRET_TOKEN não está definida.');
}

interface IUserTest {
  name?: string;
  email?: string;
  password?: string;
  avatarFileId?: string | null;
}
const userTest: IUserTest = {};

async function createUser() {
  const name = faker.name.findName();
  const email = faker.internet.email();
  const password = faker.random.number({ min: 100, max: 500 }).toString();
  const avatarFileId = null;
  userTest.name = name;
  userTest.email = email;
  userTest.password = password;
  userTest.avatarFileId = avatarFileId;

  const response = await request(app).post('/user').send({
    name,
    email,
    password,
    avatarFileId,
  });

  return response;
}
interface ITransactionTest {
  value?: number;
  description?: string;
  method?: string;
  cardNumber?: string;
  cardholderName?: string;
  cardExpirationDate?: string;
  cardVerificationCode?: string;
}
const transactionTest: ITransactionTest = {};

async function createTransaction() {
  const value = faker.random.number({ min: 100, max: 500 });
  const description = 'Descrição da transação';
  const method = 'debit_card';
  const cardNumber = generateCardNumber();
  const cardholderName = faker.name.findName();
  const cardExpirationDate = faker.date.future().toISOString();
  const cardVerificationCode = generateCardVerificationCode();

  transactionTest.value = value;
  transactionTest.description = description;
  transactionTest.method = method;
  transactionTest.cardNumber = cardNumber;
  transactionTest.cardholderName = cardholderName;
  transactionTest.cardExpirationDate = cardExpirationDate;
  transactionTest.cardVerificationCode = cardVerificationCode;

  const response = await request(app).post('/transaction').send({
    value,
    description,
    method,
    cardNumber,
    cardholderName,
    cardExpirationDate,
    cardVerificationCode,
  });

  return response;
}

jest.mock('./service/FileService/importFile.service');
jest.mock('./service/TransactionService/exportTransaction.service');

describe('Test all', () => {
  let name: string;
  let email: string;
  let token: string;
  let avatarFileId: number;

  it('Criar usuário', async () => {
    const response = await createUser();
    email = response.body.result.email;
    name = response.body.result.name;
    expect(response.body.result.name).toEqual(userTest.name);
    expect(response.body.result.email).toEqual(userTest.email);
    expect(response.statusCode).toEqual(200);
  });

  it('fazer login ', async () => {
    const loginResponse = await request(app).post('/session').send({
      email,
      password: userTest.password,
    });
    token = loginResponse.body.result.token;
    expect(loginResponse.body.result.name).toEqual(userTest.name);
    expect(loginResponse.body.result.email).toEqual(userTest.email);
    expect(loginResponse.statusCode).toEqual(200);
  });

  it('Enviar arquivo', async () => {
    const filePath = path.resolve(__dirname, 'github.png');

    const executeMock = ImportFileService.prototype.execute as jest.Mock;
    executeMock.mockResolvedValue('http://url-aleatoria.com');
    AWS.restore();

    const response = await request(app)
      .post('/user/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('image', filePath);
    expect(response.body.result.publicUrl).toEqual('http://url-aleatoria.com');
    expect(response.statusCode).toEqual(200);
    avatarFileId = response.body.result.id;
  });

  it('Updated User ', async () => {
    const updatedResponse = await request(app)
      .put('/user')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'biscoito', avatarFileId });
    name = updatedResponse.body.result.name;
    expect(updatedResponse.body.result.name).toEqual(name);
    expect(updatedResponse.body.result.email).toEqual(userTest.email);
    expect(updatedResponse.body.result.avatarFileId).toEqual(avatarFileId);
    expect(updatedResponse.statusCode).toEqual(200);
  });

  it('Feed User ', async () => {
    const response = await request(app).get('/user').set('Authorization', `Bearer ${token}`);
    expect(response.body.result.name).toEqual(name);
    expect(response.body.result.email).toEqual(userTest.email);
    expect(response.body.result.avatarUrl).toEqual('http://url-aleatoria.com');
    expect(response.statusCode).toEqual(200);
  });

  it('List User Admin', async () => {
    const response = await request(app).get('/user/list').set('secret', secretToken);
    expect(response.statusCode).toEqual(200);
  });

  it('Create transaction', async () => {
    const response = await createTransaction();

    expect(response.body.result.value).toEqual(transactionTest.value);
    expect(response.body.result.description).toEqual(transactionTest.description);
    expect(response.body.result.method).toEqual(transactionTest.method);

    expect(response.body.result.cardNumber).toEqual(transactionTest.cardNumber);
    expect(response.body.result.cardholderName).toEqual(transactionTest.cardholderName);
    expect(response.body.result.cardExpirationDate).toEqual(transactionTest.cardExpirationDate);

    expect(response.body.result.payables).toEqual('paid');

    expect(response.statusCode).toEqual(200);
  });
  it('List transaction', async () => {
    const transicaoResponse = await request(app).get('/transaction/list');
    expect(transicaoResponse.statusCode).toEqual(200);
  });
  it('Consult transaction', async () => {
    const transicaoResponse = await request(app).get('/transaction/consult');
    expect(transicaoResponse.statusCode).toEqual(200);
  });
  it('Export transaction', async () => {
    const executeMock = ExportTransactionService.prototype.execute as jest.Mock;
    executeMock.mockResolvedValue('http://url-aleatoria.com');
    AWS.restore();
    const transicaoResponse = await request(app).get('/transaction/consult');

    // console.log('Response Body:', transicaoResponse.body); // Adicionando o log do corpo da resposta

    expect(transicaoResponse.statusCode).toEqual(200);
  });
});
