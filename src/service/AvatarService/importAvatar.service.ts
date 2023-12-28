import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import { Response } from 'express';

dotenv.config();

export class ImportAvatarService {
  async execute(res: Response) {
    try {
      const accessKeyId = process.env.ACCESSKEYID;
      const secretAccessKey = process.env.SECRETACCESSKEY;
      const region = process.env.REGION;

      AWS.config.update({
        accessKeyId,
        secretAccessKey,
        region,
      });

      const sourceBucket = 'novament1-nfs';
      const sourceKey = 'fon.png';

      const s3 = new AWS.S3();

      const getObjectParams = {
        Bucket: sourceBucket,
        Key: sourceKey,
      };

      const objectUrl = await s3.getSignedUrlPromise('getObject', getObjectParams);

      return objectUrl;
    } catch (error) {
      console.error('Erro ao obter arquivo do S3:', error);
      res.status(500).send('Ocorreu um erro ao obter o arquivo do S3.');
    }
  }
}
