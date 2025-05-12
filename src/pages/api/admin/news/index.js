import { verify } from 'jsonwebtoken';
import cookie from 'cookie';
import { newsService } from '../../../../lib/firebaseService';

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
      // Создание новой новости
      try {
        const newNews = await newsService.createNews(req.body);
        return res.status(201).json(newNews);
      } catch (error) {
        console.error('Ошибка при создании новости:', error);
        return res.status(500).json({ message: 'Ошибка сервера при создании новости' });
      }

    default:
      return res.status(405).json({ message: 'Метод не разрешен' });
  }
} 