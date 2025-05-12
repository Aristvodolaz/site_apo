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

  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ message: 'ID новости не указан' });
  }

  switch (req.method) {
    case 'GET':
      // Получение одной новости
      try {
        const news = await newsService.getNewsById(id);
        return res.status(200).json(news);
      } catch (error) {
        console.error(`Ошибка при получении новости ${id}:`, error);
        return res.status(error.message === 'Новость не найдена' ? 404 : 500)
          .json({ message: error.message || 'Ошибка сервера при получении новости' });
      }

    case 'PUT':
      // Обновление новости
      try {
        const updatedNews = await newsService.updateNews(id, req.body);
        return res.status(200).json(updatedNews);
      } catch (error) {
        console.error(`Ошибка при обновлении новости ${id}:`, error);
        return res.status(500).json({ message: error.message || 'Ошибка сервера при обновлении новости' });
      }

    case 'DELETE':
      // Удаление новости
      try {
        await newsService.deleteNews(id);
        return res.status(200).json({ message: 'Новость успешно удалена' });
      } catch (error) {
        console.error(`Ошибка при удалении новости ${id}:`, error);
        return res.status(500).json({ message: error.message || 'Ошибка сервера при удалении новости' });
      }

    default:
      return res.status(405).json({ message: 'Метод не разрешен' });
  }
} 