import { verify } from 'jsonwebtoken';
import cookie from 'cookie';
import { uploadNewsHtmlToS3 } from '../../../lib/uploadNewsHtml';

const JWT_SECRET = 'your-secret-key';

const isAuthenticated = (req) => {
  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    if (!cookies.auth) return false;
    const token = verify(cookies.auth, JWT_SECRET);
    return token.admin === true;
  } catch {
    return false;
  }
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '15mb',
    },
  },
};

export default async function handler(req, res) {
  if (!isAuthenticated(req)) {
    return res.status(401).json({ message: 'Неавторизованный доступ' });
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Метод не разрешён' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const html = body?.html != null ? String(body.html) : '';
    const newsId = body?.newsId != null ? String(body.newsId) : '';
    if (!newsId.trim()) {
      return res.status(400).json({ message: 'Не указан newsId' });
    }

    const url = await uploadNewsHtmlToS3(newsId, html);
    return res.status(200).json({ url });
  } catch (error) {
    console.error('news-html-upload:', error);
    return res.status(500).json({ message: 'Ошибка загрузки HTML в хранилище' });
  }
}
