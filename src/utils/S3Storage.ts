/* eslint-disable import/no-extraneous-dependencies */
import aws, { S3 } from 'aws-sdk';
import fs from 'fs';
import mimeTypes from 'mime-types'; // Install using npm install mime-types
import path from 'path';

import multerConfig from '../configs/multer';

class S3Storage {
  private client: S3;

  constructor() {
    const region = process.env.REGION;
    if (!region) {
      throw new Error('REGION environment variable is not defined.');
    }

    this.client = new aws.S3({
      region,
    });
  }

  async saveFile(filename: string, key: string): Promise<void> {
    const BUCKET = process.env.BUCKET;
    if (!BUCKET) {
      throw new Error('BUCKET environment variable is not defined.');
    }

    const originalPath = path.resolve(multerConfig.directory, filename);

    const contentType = mimeTypes.lookup(originalPath);
    if (!contentType) {
      throw new Error('File not found: ' + filename);
    }

    const fileContent = await fs.promises.readFile(originalPath);

    try {
      await this.client
        .putObject({
          Bucket: BUCKET,
          Key: key,
          ACL: 'public-read',
          Body: fileContent,
          ContentType: contentType,
        })
        .promise();

      await fs.promises.unlink(originalPath);
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw error;
    }
  }
}

export default S3Storage;
