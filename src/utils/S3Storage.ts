/* eslint-disable import/no-extraneous-dependencies */
import aws, { S3 } from 'aws-sdk';
import fs from 'fs';
import mimeTypes from 'mime-types'; // Install using npm install mime-types
import path from 'path';

import multerConfig from '../configs/multer';

class S3Storage {
  private client: S3;

  constructor() {
    this.client = new aws.S3({
      region: 'ca-central-1',
    });
  }

  async saveFile(filename: string): Promise<void> {
    const originalPath = path.resolve(multerConfig.directory, filename);

    const contentType = mimeTypes.lookup(originalPath);

    if (!contentType) {
      throw new Error('File not found: ' + filename);
    }

    const fileContent = await fs.promises.readFile(originalPath);

    this.client
      .putObject({
        Bucket: 'novament1-nfs',
        Key: filename,
        ACL: 'public-read',
        Body: fileContent,
        ContentType: contentType,
      })
      .promise();

    await fs.promises.unlink(originalPath);
  }
}

export default S3Storage;

// /* eslint-disable import/no-extraneous-dependencies */
// import aws, { S3 } from 'aws-sdk';
// import fs from 'fs';
// import mime from 'mime';
// import path from 'path';

// import multerConfig from '../configs/multer';

// class S3Storage {
//   private client: S3;

//   constructor() {
//     this.client = new aws.S3({
//       region: 'ca-central-1',
//     });
//   }

//   async saveFile(filename: string): Promise<void> {
//     const originalPath = path.resolve(multerConfig.directory, filename);
//     const contentType = mime.getType(originalPath);

//     if (!contentType) {
//       throw new Error('File not found: ' + filename);
//     }

//     const fileContent = await fs.promises.readFile(originalPath);

//     this.client
//       .putObject({
//         Bucket: 'novament1-nfs',
//         Key: filename,
//         ACL: 'public-read',
//         Body: fileContent,
//         ContentType: contentType, // Corrected property name
//       })
//       .promise();

//     await fs.promises.unlink(originalPath);
//   }
// }

// export default S3Storage;
