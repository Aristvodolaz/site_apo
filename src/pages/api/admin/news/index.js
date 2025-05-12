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

  switch (req.method) {
    case 'GET':
      // Получение списка новостей
      try {
        const news = readNewsData();
        return res.status(200).json(news);
      } catch (error) {
        console.error('Ошибка при получении новостей:', error);
        return res.status(500).json({ message: 'Ошибка сервера при получении новостей' });
      }

    case 'POST':
      // Создание новой новости
      try {
        const news = readNewsData();
        const newNews = {
          ...req.body,
          id: news.length > 0 ? Math.max(...news.map(item => item.id)) + 1 : 1
        };
        
        news.push(newNews);
        writeNewsData(news);
        
        return res.status(201).json(newNews);
      } catch (error) {
        console.error('Ошибка при создании новости:', error);
        return res.status(500).json({ message: 'Ошибка сервера при создании новости' });
      }

    default:
      return res.status(405).json({ message: 'Метод не разрешен' });
  }
} 