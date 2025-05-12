import { verify } from 'jsonwebtoken';
import cookie from 'cookie';
import { contentService } from '../../../../lib/firebaseService';

// Секретный ключ (должен совпадать с ключом в API аутентификации)
const JWT_SECRET = 'your-secret-key';

// Карта ID контента
const contentIds = [
  'contacts',
  'history',
  'documents',
  'subjects',
  'regions'
];

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
  
  if (!contentIds.includes(id)) {
    return res.status(404).json({ message: `Контент с ID ${id} не найден` });
  }

  switch (req.method) {
    case 'GET':
      // Получение данных контента
      try {
        const data = await contentService.getContent(id);
        return res.status(200).json(data);
      } catch (error) {
        console.error(`Ошибка при получении данных ${id}:`, error);
        
        // Если контент не найден, возвращаем пустой объект (для новых коллекций)
        if (error.message && error.message.includes('не найден')) {
          return res.status(200).json({});
        }
        
        return res.status(500).json({ message: error.message || 'Ошибка сервера при получении данных' });
      }

    case 'PUT':
      // Обновление данных контента
      try {
        const newData = req.body;
        
        // Проверяем валидность данных
        if (typeof newData !== 'object') {
          return res.status(400).json({ message: 'Неверный формат данных' });
        }
        
        const updatedData = await contentService.updateContent(id, newData);
        
        return res.status(200).json({ 
          success: true,
          message: 'Данные успешно обновлены',
          data: updatedData
        });
      } catch (error) {
        console.error(`Ошибка при обновлении данных ${id}:`, error);
        return res.status(500).json({ message: error.message || 'Ошибка сервера при обновлении данных' });
      }

    default:
      return res.status(405).json({ message: 'Метод не разрешен' });
  }
} 