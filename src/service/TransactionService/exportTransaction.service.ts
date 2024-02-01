import dotenv from 'dotenv';
import ExcelJS from 'exceljs';
import { TransactionRepository } from '../../repositories/transaction.repository';
import S3Storage from '../../utils/S3Storage';

dotenv.config();
export class ExportTransactionService {
  private transactionRepository: TransactionRepository;

  constructor() {
    this.transactionRepository = new TransactionRepository();
  }

  async execute(userId: number, name: string) {
    const transactionsExists = await this.transactionRepository.findTransiction(userId, name);
    if (transactionsExists) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Transações');

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

      worksheet.addRow({
        value: transactionsExists.value,
        description: transactionsExists.description,
        method: transactionsExists.method,
        cardNumber: transactionsExists.cardNumber,
        cardholderName: transactionsExists.cardholderName,
        cardExpirationDate: transactionsExists.cardExpirationDate,
        cardVerificationCode: transactionsExists.cardVerificationCode,
        payables: transactionsExists.payables,
        valuePayables: transactionsExists.valuePayables,
        paymentDate: transactionsExists.paymentDate,
      });

      const excelBuffer = Buffer.from(await workbook.xlsx.writeBuffer());
      try {
        const s3Storage = new S3Storage();
        const key = `avatars/user/${transactionsExists.userId}/${name}.xlsx`;
        await s3Storage.saveFileBuffer(excelBuffer, key);

        return key;
      } catch (error) {
        console.error('Erro ao exportar arquivo para o S3:', error);
      }
    }
  }
}
