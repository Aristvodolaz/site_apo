import { verify } from 'jsonwebtoken';
import cookie from 'cookie';

const JWT_SECRET = 'your-secret-key'; // Должно совпадать с ключом в login.js

export default function handler(req, res) {
  try {
    // Получаем куки из запроса
    const cookies = cookie.parse(req.headers.cookie || '');
    
    // Проверяем наличие токена аутентификации
    if (!cookies.auth) {
      return res.status(401).json({ authenticated: false });
    }
    
    // Проверяем валидность токена
    const token = verify(cookies.auth, JWT_SECRET);
    
    // Проверяем, является ли пользователь администратором
    if (!token.admin) {
      return res.status(403).json({ authenticated: false });
    }
    
    // Возвращаем успешный ответ с информацией о пользователе
    return res.status(200).json({
      authenticated: true,
      user: {
        username: token.username
      }
    });
  } catch (error) {
    // В случае ошибки проверки токена
    return res.status(401).json({ authenticated: false });
  }
} 