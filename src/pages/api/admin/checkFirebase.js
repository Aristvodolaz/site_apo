import { db } from '../../../lib/firebase';
import { getDocs, collection, limit } from 'firebase/firestore';
import { verify } from 'jsonwebtoken';
import cookie from 'cookie';

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

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Метод не разрешен' });
  }

  try {
    // Проверяем настройку Firebase
    const isConfigured = await checkFirebaseConfig();
    
    return res.status(200).json({
      configured: isConfigured
    });
  } catch (error) {
    console.error('Ошибка при проверке Firebase:', error);
    return res.status(200).json({
      configured: false,
      error: error.message
    });
  }
}

// Функция для проверки настройки Firebase
async function checkFirebaseConfig() {
  try {
    // Проверяем, что Firebase настроен правильно
    const apiKey = process.env.FIREBASE_API_KEY || (typeof window !== 'undefined' ? window.FIREBASE_API_KEY : null);
    
    if (!apiKey || apiKey.includes('ЗАМЕНИТЕ')) {
      return false;
    }
    
    // Пробуем выполнить запрос к Firestore
    const querySnapshot = await getDocs(collection(db, 'news'), limit(1));
    
    // Если запрос выполнился без ошибок, считаем, что Firebase настроен
    return true;
  } catch (error) {
    console.error('Ошибка проверки Firebase:', error);
    return false;
  }
} 