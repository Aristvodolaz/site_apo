import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.S3_REGION || 'ru-central1',
  endpoint: process.env.S3_ENDPOINT || 'https://storage.yandexcloud.net',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
});

export { s3Client, PutObjectCommand };
