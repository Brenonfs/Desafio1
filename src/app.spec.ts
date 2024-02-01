/* eslint-disable import/no-extraneous-dependencies */
import AWS from 'aws-sdk-mock';
import faker from 'faker';
import request from 'supertest';
import path from 'path';
import { app } from './app';
import { generateCardNumber, generateCardVerificationCode } from './utils/cardGenerator';
import { ExportTransactionService } from './service/TransactionService/exportTransaction.service';
import { ImportFileService } from './service/FileService/importFile.service';

jest.mock('./service/TransactionService/exportTransaction.service');
jest.mock('./service/FileService/importFile.service');

const secretToken = process.env.SECRET_TOKEN;
if (!secretToken) {
  throw new Error('A variável de ambiente SECRET_TOKEN não está definida.');
}

interface IUserTest {
  name: string;
  email: string;
  password: string;
  avatarFileId: number | null;
  token: string | null;
}
async function createUser() {
  const name = faker.name.findName();
  const email = faker.internet.email();
  const password = faker.random.number({ min: 100, max: 500 }).toString();
  const avatarFileId = null;
  const token = null;

  const userTest: IUserTest = {
    name,
    email,
    password,
    avatarFileId,
    token,
  };

  const response = await request(app).post('/user').send({
    name,
    email,
    password,
    avatarFileId,
  });

  return { userTest, response };
}
async function loginUser() {
  const { userTest } = await createUser();
  const loginResponse = await request(app).post('/session').send({
    email: userTest.email,
    password: userTest.password,
  });
  userTest.token = loginResponse.body.result.token;
  return userTest;
}
async function uploadUser() {
  const user = await loginUser();
  const filePath = path.resolve(__dirname, 'github.png');
  const executeMock = ImportFileService.prototype.execute as jest.Mock;
  executeMock.mockResolvedValue('http://url-aleatoria.com');
  AWS.restore();
  const response = await request(app)
    .post('/user/upload')
    .set('Authorization', `Bearer ${user.token}`)
    .attach('image', filePath);
  user.avatarFileId = response.body.result.id;
  return user;
}
async function updatedUser() {
  const user = await uploadUser();
  const updatedResponse = await request(app)
    .put('/user')
    .set('Authorization', `Bearer ${user.token}`)
    .send({ name: 'biscoito', avatarFileId: user.avatarFileId });
  user.name = updatedResponse.body.result.name;
  user.avatarFileId = updatedResponse.body.result.avatarFileId;

  return user;
}
interface ITransactionTest {
  name: string;
  value: number;
  description: string;
  method: string;
  valuePayables: number;
  cardNumber: string;
  cardholderName: string;
  cardExpirationDate: string;
  cardVerificationCode: string;
}
async function transaction(token: string) {
  if (!token) {
    throw new Error('Token de usuário nulo.');
  }
  const name = faker.name.jobTitle();
  const value = faker.random.number({ min: 100, max: 500 });
  const description = 'Descrição da transação';
  const method = 'debit_card';
  const valuePayables = value * 0.97;
  const cardNumber = generateCardNumber();
  const cardholderName = faker.name.findName();
  const cardExpirationDate = faker.date.future().toISOString();
  const cardVerificationCode = generateCardVerificationCode();

  const transactionTest: ITransactionTest = {
    name,
    value,
    description,
    method,
    valuePayables,
    cardNumber,
    cardholderName,
    cardExpirationDate,
    cardVerificationCode,
  };

  const response = await request(app).post('/transaction').set('Authorization', `Bearer ${token}`).send({
    name,
    value,
    description,
    method,
    cardNumber,
    cardholderName,
    cardExpirationDate,
    cardVerificationCode,
  });

  return { response, transactionTest };
}
async function createTransaction() {
  const user = await loginUser();
  if (user.token === null) {
    return null;
  }
  const { response, transactionTest } = await transaction(user.token);
  return { response, transactionTest, user };
}
async function createTransactionMoreTime() {
  const user = await loginUser();
  if (user.token === null) {
    return null;
  }

  const transactions = [];
  for (let i = 0; i < 2; i++) {
    const transactionResult = await transaction(user.token);
    transactions.push(transactionResult);
  }
  return { transactions, user };
}

describe('Test all', () => {
  it('Create User ', async () => {
    const user = await createUser();
    expect(user.response.body.result.name).toEqual(user.userTest.name);
    expect(user.response.body.result.email).toEqual(user.userTest.email);
    expect(user.response.statusCode).toEqual(200);
  });

  it('fazer login', async () => {
    const { userTest } = await createUser();
    const loginResponse = await request(app).post('/session').send({
      email: userTest.email,
      password: userTest.password,
    });
    userTest.token = loginResponse.body.result.token;
    expect(loginResponse.body.result.name).toEqual(userTest.name);
    expect(loginResponse.body.result.email).toEqual(userTest.email);
    expect(loginResponse.statusCode).toEqual(200);
  });

  it('Enviar arquivo', async () => {
    const userTest = await loginUser();
    const filePath = path.resolve(__dirname, 'github.png');
    const executeMock = ImportFileService.prototype.execute as jest.Mock;
    executeMock.mockResolvedValue('http://url-aleatoria.com');
    AWS.restore();
    const response = await request(app)
      .post('/user/upload')
      .set('Authorization', `Bearer ${userTest.token}`)
      .attach('image', filePath);
    expect(response.body.result.publicUrl).toEqual('http://url-aleatoria.com');
    expect(response.statusCode).toEqual(200);
  });

  it('Updated User ', async () => {
    const userTest = await uploadUser();
    const updatedResponse = await request(app)
      .put('/user')
      .set('Authorization', `Bearer ${userTest.token}`)
      .send({ name: 'biscoito', avatarFileId: userTest.avatarFileId });
    userTest.name = updatedResponse.body.result.name;
    expect(updatedResponse.statusCode).toEqual(200);
    expect(updatedResponse.body.result.name).toEqual(userTest.name);
    expect(updatedResponse.body.result.email).toEqual(userTest.email);
    expect(updatedResponse.body.result.avatarFileId).toEqual(userTest.avatarFileId);
  });

  it('Feed User ', async () => {
    const userTest = await updatedUser();
    const response = await request(app).get('/user').set('Authorization', `Bearer ${userTest.token}`);
    expect(response.body.result.name).toEqual(userTest.name);
    expect(response.body.result.email).toEqual(userTest.email);
    expect(response.body.result.avatarUrl).toEqual('http://url-aleatoria.com');
    expect(response.statusCode).toEqual(200);
  });

  it('List User Admin', async () => {
    const response = await request(app).get('/user/list').set('secret', secretToken);
    expect(response.statusCode).toEqual(200);
  });

  it('Create transaction', async () => {
    const result = await createTransaction();
    if (!result) {
      return null;
    }
    expect(result.response.body.transaction.name).toEqual(result.transactionTest.name);
    expect(result.response.body.transaction.value).toEqual(result.transactionTest.value);
    expect(result.response.body.transaction.description).toEqual(result.transactionTest.description);
    expect(result.response.body.transaction.method).toEqual(result.transactionTest.method);
    expect(result.response.body.transaction.cardNumber).toEqual(result.transactionTest.cardNumber);
    expect(result.response.body.transaction.cardholderName).toEqual(result.transactionTest.cardholderName);
    expect(result.response.body.transaction.cardExpirationDate).toEqual(result.transactionTest.cardExpirationDate);
    expect(result.response.statusCode).toEqual(200);
  });

  it('Consult Transaction', async () => {
    const result = await createTransactionMoreTime();
    if (!result || !result.user || !result.user.token) {
      return null;
    }
    const transactionConsult = await request(app)
      .get('/transaction/consult')
      .set('Authorization', `Bearer ${result.user.token}`)
      .send({});
    expect(transactionConsult.statusCode).toEqual(200);
    expect(transactionConsult.body.result).toBeTruthy();
    const somaValoresPayables = result.transactions
      .reduce((total, transaction) => total + parseFloat(String(transaction.transactionTest.valuePayables)), 0)
      .toFixed(2);

    expect(transactionConsult.body.result.available).toEqual(parseFloat(somaValoresPayables));
  });

  it('List transaction', async () => {
    // falta coisa
    const result = await createTransactionMoreTime();
    if (!result || !result.user || !result.user.token) {
      return null;
    }
    const transactionList = await request(app)
      .get('/transaction/list')
      .set('Authorization', `Bearer ${result.user.token}`)
      .send({});
    expect(transactionList.statusCode).toEqual(200);
    expect(transactionList.body.result).toBeTruthy();

    result.transactions.forEach((transactionTest) => {
      const isTransactionInList = transactionList.body.result.some((transacao: any) => {
        return (
          transacao.value === transactionTest.transactionTest.value &&
          transacao.description === transactionTest.transactionTest.description &&
          transacao.method === transactionTest.transactionTest.method &&
          transacao.cardNumber === transactionTest.transactionTest.cardNumber &&
          transacao.cardholderName === transactionTest.transactionTest.cardholderName &&
          transacao.cardExpirationDate === transactionTest.transactionTest.cardExpirationDate
        );
      });
      expect(isTransactionInList).toBeTruthy();
    });
  });

  it('Export transaction', async () => {
    const result = await createTransaction();
    if (!result) {
      return null;
    }

    const executeExportMock = ExportTransactionService.prototype.execute as jest.Mock;
    executeExportMock.mockResolvedValue('keyaleatória');
    AWS.restore();

    const executeImportMock = ImportFileService.prototype.execute as jest.Mock;
    executeImportMock.mockResolvedValue('http://url-aleatoria.com');
    AWS.restore();

    const transactionExport = await request(app)
      .post('/transaction/export')
      .set('Authorization', `Bearer ${result.user.token}`)
      .send({ name: result.transactionTest.name });

    expect(transactionExport.statusCode).toEqual(200);
    expect(transactionExport.body.result).toBeTruthy();
    expect(transactionExport.body.result.name).toEqual(result.transactionTest.name);
    expect(transactionExport.body.result.value).toEqual(result.transactionTest.value);
    expect(transactionExport.body.result.description).toEqual(result.transactionTest.description);
    expect(transactionExport.body.result.method).toEqual(result.transactionTest.method);
    expect(transactionExport.body.result.cardholderName).toEqual(result.transactionTest.cardholderName);
    expect(transactionExport.body.result.cardExpirationDate).toEqual(result.transactionTest.cardExpirationDate);
    expect(transactionExport.body.result.key).toEqual('keyaleatória');
    expect(transactionExport.body.result.publicUrl).toEqual('http://url-aleatoria.com');
  });
});
