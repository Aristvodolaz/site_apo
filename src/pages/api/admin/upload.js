import { IncomingForm } from 'formidable';
import fs from 'fs';
import { s3Client, PutObjectCommand } from '../../../lib/s3';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const form = new IncomingForm({
    keepExtensions: true,
    maxFileSize: parseInt(process.env.UPLOAD_MAX_FILE_SIZE_MB || '10') * 1024 * 1024,
  });

  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form:', err);
        res.status(500).json({ message: 'Error uploading file' });
        return resolve();
      }

      const file = files.file;
      if (!file) {
        res.status(400).json({ message: 'No file uploaded' });
        return resolve();
      }

      const fileObj = Array.isArray(file) ? file[0] : file;
      
      const allowedMimeTypes = (process.env.UPLOAD_ALLOWED_MIME || 'image/jpeg,image/png,image/webp,image/gif').split(',');
      if (!allowedMimeTypes.includes(fileObj.mimetype)) {
        res.status(400).json({ message: 'Invalid file type' });
        return resolve();
      }

      try {
        const fileContent = fs.readFileSync(fileObj.filepath);
        const fileExtension = path.extname(fileObj.originalFilename);
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}${fileExtension}`;
        const s3Key = `uploads/${fileName}`;

        const uploadParams = {
          Bucket: process.env.S3_BUCKET || 'apo123',
          Key: s3Key,
          Body: fileContent,
          ContentType: fileObj.mimetype,
          ACL: 'public-read',
        };

        await s3Client.send(new PutObjectCommand(uploadParams));

        // Используем публичный URL без добавления имени бакета, если оно уже есть в URL
        let publicBaseUrl = process.env.S3_PUBLIC_BASE_URL || 'https://storage.yandexcloud.net/apo123';
        // Убираем слеш в конце, если он есть
        if (publicBaseUrl.endsWith('/')) {
          publicBaseUrl = publicBaseUrl.slice(0, -1);
        }
        
        const fileUrl = `${publicBaseUrl}/${s3Key}`;

        res.status(200).json({ url: fileUrl });
      } catch (uploadError) {
        console.error('Error uploading to S3:', uploadError);
        res.status(500).json({ message: 'Error uploading to S3' });
      } finally {
        if (fs.existsSync(fileObj.filepath)) {
          fs.unlinkSync(fileObj.filepath);
        }
        resolve();
      }
    });
  });
}
