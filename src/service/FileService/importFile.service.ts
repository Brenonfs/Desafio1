// Importando o esquema Zod

import AWS from 'aws-sdk';
import dotenv from 'dotenv';

import { ApiError, BadRequestError, NotFoundError } from '../../helpers/api-erros';
import { AwsCredentialsSchema } from '../../schemas/awsCredential';
dotenv.config();

export class ImportFileService {
  async execute(key: string) {
    // Validando as credenciais AWS do ambiente usando o esquema Zod
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

    const sourceBucket = 'novament1-nfs';
    const sourceKey = key;

    const s3 = new AWS.S3();

    try {
      // Tenta obter a URL assinada para o objeto no S3
      const getObjectParams = {
        Bucket: sourceBucket,
        Key: sourceKey,
      };

      const objectUrl = await s3.getSignedUrlPromise('getObject', getObjectParams);

      return objectUrl;
    } catch (error) {
      console.error('Erro ao obter arquivo do S3:', (error as Error).message || error);

      if ((error as { code?: string }).code === 'NoSuchKey') {
        throw new NotFoundError('A chave especificada não existe no bucket S3.');
      } else {
        // Trata outros casos específicos de erro, se necessário
        throw new ApiError('Erro genérico ao obter arquivo do S3.', 500);
      }
    }
  }
}
