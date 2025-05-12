import { verify } from 'jsonwebtoken';
import cookie from 'cookie';
import fs from 'fs';
import path from 'path';

// Секретный ключ (должен совпадать с ключом в API аутентификации)
const JWT_SECRET = 'your-secret-key';

// Путь к файлу с данными новостей
const NEWS_DATA_PATH = path.join(process.cwd(), 'src/data/newsData.js');

// Функция для чтения данных новостей
const readNewsData = () => {
  const fileContent = fs.readFileSync(NEWS_DATA_PATH, 'utf8');
  // Извлекаем массив данных из экспорта
  const match = fileContent.match(/export const newsData = (\[[\s\S]*\]);/);
  if (match && match[1]) {
    try {
      // Преобразуем строку в объект JavaScript
      return eval(match[1]);
    } catch (error) {
      console.error('Ошибка при парсинге данных новостей:', error);
      return [];
    }
  }
  return [];
};

// Функция для записи данных новостей
const writeNewsData = (data) => {
  const content = `export const newsData = ${JSON.stringify(data, null, 2)};\n`;
  fs.writeFileSync(NEWS_DATA_PATH, content, 'utf8');
};

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

export default function handler(req, res) {
  // Проверяем аутентификацию
  if (!isAuthenticated(req)) {
    return res.status(401).json({ message: 'Неавторизованный доступ' });
  }

  const { id } = req.query;
  const newsId = parseInt(id, 10);

  if (isNaN(newsId)) {
    return res.status(400).json({ message: 'Некорректный ID новости' });
  }

  // Получаем данные новостей
  const news = readNewsData();
  const newsIndex = news.findIndex(item => item.id === newsId);

  if (newsIndex === -1) {
    return res.status(404).json({ message: 'Новость не найдена' });
  }

  switch (req.method) {
    case 'GET':
      // Получение одной новости
      return res.status(200).json(news[newsIndex]);

    case 'PUT':
      // Обновление новости
      try {
        const updatedNews = {
          ...news[newsIndex],
          ...req.body,
          id: newsId // Сохраняем исходный ID
        };
        
        news[newsIndex] = updatedNews;
        writeNewsData(news);
        
        return res.status(200).json(updatedNews);
      } catch (error) {
        console.error('Ошибка при обновлении новости:', error);
        return res.status(500).json({ message: 'Ошибка сервера при обновлении новости' });
      }

    case 'DELETE':
      // Удаление новости
      try {
        const filteredNews = news.filter(item => item.id !== newsId);
        writeNewsData(filteredNews);
        
        return res.status(200).json({ message: 'Новость успешно удалена' });
      } catch (error) {
        console.error('Ошибка при удалении новости:', error);
        return res.status(500).json({ message: 'Ошибка сервера при удалении новости' });
      }

    default:
      return res.status(405).json({ message: 'Метод не разрешен' });
  }
} 