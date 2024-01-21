/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-extraneous-dependencies */

import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import ExcelJS from 'exceljs';
import { Response } from 'express';

import { BadRequestError } from '../../helpers/api-erros';
import { TransactionRepository } from '../../repositories/transaction.repository';
import { AwsCredentialsSchema } from '../../schemas/awsCredential';

dotenv.config();
export class ExportTransactionService {
  private transactionRepository: TransactionRepository;

  constructor() {
    this.transactionRepository = new TransactionRepository();
  }

  async execute(res: Response) {
    try {
      const transactions = await this.transactionRepository.getAllTransactions();
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Transações');

      // Define the worksheet columns
      worksheet.columns = [
        { header: 'value', key: 'value', width: 10 },
        { header: 'description', key: 'description', width: 30 },
        { header: 'method', key: 'method', width: 30 },
        { header: 'cardNumber', key: 'cardNumber', width: 50 },
        { header: 'cardholderName', key: 'cardholderName', width: 10 },
        { header: 'cardExpirationDate', key: 'cardExpirationDate', width: 30 },
        { header: 'cardVerificationCode', key: 'cardVerificationCode', width: 30 },
        { header: 'payables', key: 'payables', width: 50 },
        { header: 'valuePayables', key: 'valuePayables', width: 10 },
        { header: 'paymentDate', key: 'paymentDate', width: 30 },
      ];

      // Populate the worksheet with transaction data
      transactions.forEach((transaction) => {
        worksheet.addRow({
          value: transaction.value,
          description: transaction.description,
          method: transaction.method,
          cardNumber: transaction.cardNumber,
          cardholderName: transaction.cardholderName,
          cardExpirationDate: transaction.cardExpirationDate,
          cardVerificationCode: transaction.cardVerificationCode,
          payables: transaction.payables,
          valuePayables: transaction.valuePayables,
          paymentDate: transaction.paymentDate,
        });
      });

      // Configure the response type and send the Excel file as a response
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=transacoes.xlsx');

      // Generate the Excel file and send it as a response
      const excelBuffer = await workbook.xlsx.writeBuffer();

      // Configure AWS credentials (make sure to set them correctly in your .env file)
      const awsCredentialsResult = AwsCredentialsSchema.safeParse(process.env);

      if (awsCredentialsResult.success) {
        const { ACCESSKEYID, SECRETACCESSKEY, REGION } = awsCredentialsResult.data;

        AWS.config.update({
          accessKeyId: ACCESSKEYID,
          secretAccessKey: SECRETACCESSKEY,
          region: REGION,
        });
      } else {
        throw new BadRequestError(awsCredentialsResult.error.errors.join('; '));
      }
      const s3 = new AWS.S3();

      const s3Params = {
        Bucket: 'novament1-nfs',
        Key: 'transacoes.xlsx',
        ACL: 'public-read',
        Body: excelBuffer,
      };
      s3.upload(s3Params, (err: any, data: any) => {
        if (err) {
          console.error('Error uploading to S3:', err);
        } else {
          return data;
        }
      });
    } catch (error) {
      // Handle other errors and respond with an error message
      console.error('Erro ao exportar arquivo para o S3:', error);
    }
  }
}
