import AWS from 'aws-sdk';
import dotenv from 'dotenv';

import { ApiError, BadRequestError, NotFoundError } from '../../helpers/api-erros';
dotenv.config();

export class ImportFileService {
  async execute(key: string) {
    // Obtém as credenciais AWS do ambiente
    const accessKeyId = process.env.ACCESSKEYID;
    const secretAccessKey = process.env.SECRETACCESSKEY;
    const region = process.env.REGION;

    // Verifica se as credenciais AWS estão presentes
    if (!accessKeyId || !secretAccessKey || !region) {
      throw new BadRequestError(
        'Credenciais AWS ausentes. Certifique-se de que ACCESSKEYID, SECRETACCESSKEY e REGION estão configurados.',
      );
    }

    // Configura as credenciais AWS
    AWS.config.update({
      accessKeyId,
      secretAccessKey,
      region,
    });

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
