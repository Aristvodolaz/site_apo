import { verify } from 'jsonwebtoken';
import cookie from 'cookie';
import fs from 'fs';
import path from 'path';

// Секретный ключ (должен совпадать с ключом в API аутентификации)
const JWT_SECRET = 'your-secret-key';

// Карта файлов данных
const contentFiles = {
  contacts: {
    path: path.join(process.cwd(), 'src/data/contactsData.js'),
    exportName: 'contactsData'
  },
  history: {
    path: path.join(process.cwd(), 'src/data/historyData.js'),
    exportName: 'historyData'
  },
  documents: {
    path: path.join(process.cwd(), 'src/data/documentsData.js'),
    exportName: 'documentsData'
  },
  subjects: {
    path: path.join(process.cwd(), 'src/data/subjectsData.js'),
    exportName: 'subjectsData'
  },
  regions: {
    path: path.join(process.cwd(), 'src/data/regionsData.js'),
    exportName: 'regionsData'
  }
};

// Функция для чтения данных из файла
const readContentData = (contentId) => {
  const fileInfo = contentFiles[contentId];
  
  if (!fileInfo) {
    throw new Error(`Контент с ID ${contentId} не найден`);
  }
  
  const fileContent = fs.readFileSync(fileInfo.path, 'utf8');
  const match = fileContent.match(new RegExp(`export const ${fileInfo.exportName} = (.*?);(?:\\s|$)`, 's'));
  
  if (match && match[1]) {
    try {
      // Преобразуем строку в объект JavaScript
      return eval(`(${match[1]})`);
    } catch (error) {
      console.error(`Ошибка при парсинге данных ${contentId}:`, error);
      throw new Error(`Ошибка формата данных в файле ${fileInfo.path}`);
    }
  }
  
  throw new Error(`Не удалось извлечь данные из файла ${fileInfo.path}`);
};

// Функция для записи данных в файл
const writeContentData = (contentId, data) => {
  const fileInfo = contentFiles[contentId];
  
  if (!fileInfo) {
    throw new Error(`Контент с ID ${contentId} не найден`);
  }
  
  const content = `export const ${fileInfo.exportName} = ${JSON.stringify(data, null, 2)};\n`;
  fs.writeFileSync(fileInfo.path, content, 'utf8');
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
  
  if (!contentFiles[id]) {
    return res.status(404).json({ message: `Контент с ID ${id} не найден` });
  }

  switch (req.method) {
    case 'GET':
      // Получение данных контента
      try {
        const data = readContentData(id);
        return res.status(200).json(data);
      } catch (error) {
        console.error(`Ошибка при получении данных ${id}:`, error);
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
        
        writeContentData(id, newData);
        
        return res.status(200).json({ 
          success: true,
          message: 'Данные успешно обновлены'
        });
      } catch (error) {
        console.error(`Ошибка при обновлении данных ${id}:`, error);
        return res.status(500).json({ message: error.message || 'Ошибка сервера при обновлении данных' });
      }

    default:
      return res.status(405).json({ message: 'Метод не разрешен' });
  }
} 