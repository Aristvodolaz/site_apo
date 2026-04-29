import { verify } from 'jsonwebtoken';
import cookie from 'cookie';
import { doc, collection, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { newsService } from '../../../../lib/firebaseService';
import { uploadNewsHtmlToS3 } from '../../../../lib/uploadNewsHtml';
import { getUtf8ByteLength, MAX_INLINE_NEWS_CONTENT_BYTES } from '../../../../lib/newsContentConstants';

// Секретный ключ (должен совпадать с ключом в API аутентификации)
const JWT_SECRET = 'your-secret-key';

// Проверка аутентификации
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
  // Проверяем аутентификацию
  if (!isAuthenticated(req)) {
    return res.status(401).json({ message: 'Неавторизованный доступ' });
  }

  switch (req.method) {
    case 'GET':
      // Получение списка новостей
      try {
        const news = await newsService.getAllNews();
        return res.status(200).json(news);
      } catch (error) {
        console.error('Ошибка при получении новостей:', error);
        return res.status(500).json({ message: 'Ошибка сервера при получении новостей' });
      }

    case 'POST':
      // Создание новой новости (большой HTML уходит в S3 — лимит поля Firestore ~1 MiB)
      try {
        if (!db) {
          return res.status(500).json({ message: 'Firebase не настроен' });
        }

        const newsRef = doc(collection(db, 'news'));
        const newsId = newsRef.id;
        let payload = { ...req.body };
        const rawContent = payload.content != null ? String(payload.content) : '';

        if (getUtf8ByteLength(rawContent) > MAX_INLINE_NEWS_CONTENT_BYTES) {
          const url = await uploadNewsHtmlToS3(newsId, rawContent);
          payload.content = '';
          payload.contentUrl = url;
        }

        await setDoc(newsRef, {
          ...payload,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        });

        return res.status(201).json({ id: newsId, ...payload });
      } catch (error) {
        console.error('Ошибка при создании новости:', error);
        return res.status(500).json({ message: 'Ошибка сервера при создании новости' });
      }

    default:
      return res.status(405).json({ message: 'Метод не разрешен' });
  }
} 