import { z } from 'zod';

export const AwsCredentialsSchema = z.object({
  ACCESSKEYID: z.string(),
  SECRETACCESSKEY: z.string(),
  REGION: z.string(),
});

// accessKeyId: z.string(),
//   secretAccessKey: z.string(),
//   region: z.string(),
