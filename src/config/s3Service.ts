import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import { Agent } from 'https';
import { NodeHttpHandler } from '@smithy/node-http-handler';

dotenv.config();

const httpHandler = new NodeHttpHandler({
  httpsAgent: new Agent({ keepAlive: false }),
});

const s3ClientConfig: S3ClientConfig = {
  region: process.env.AWS_DEFAULT_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  requestHandler: httpHandler,
};

export const s3Client = new S3Client(s3ClientConfig);
