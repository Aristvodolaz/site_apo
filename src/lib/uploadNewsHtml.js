import { s3Client, PutObjectCommand } from './s3';

/** Загружает HTML новости в S3; возвращает публичный URL. */
export async function uploadNewsHtmlToS3(newsId, html) {
  const bucket = process.env.S3_BUCKET || 'apo123';
  const key = `news-content/${newsId}.html`;
  let publicBaseUrl = process.env.S3_PUBLIC_BASE_URL || 'https://storage.yandexcloud.net/apo123';
  if (publicBaseUrl.endsWith('/')) {
    publicBaseUrl = publicBaseUrl.slice(0, -1);
  }

  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: Buffer.from(html, 'utf8'),
      ContentType: 'text/html; charset=utf-8',
      ACL: 'public-read',
    })
  );

  return `${publicBaseUrl}/${key}`;
}
