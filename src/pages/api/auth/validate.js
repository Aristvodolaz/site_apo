import { verify } from 'jsonwebtoken';
import cookie from 'cookie';
import adminService from '../../../lib/adminService';

const JWT_SECRET = 'your-secret-key'; // Должно совпадать с ключом в login.js

export default async function handler(req, res) {
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

    // Проверим дополнительно, существует ли до сих пор этот пользователь и активен ли он
    if (token.userId) {
      try {
        const adminData = await adminService.getAdminById(token.userId);
        if (!adminData || adminData.active === false) {
          return res.status(401).json({ authenticated: false });
        }
      } catch (error) {
        console.error('Ошибка при проверке админа в базе данных:', error);
        // Не прерываем выполнение, продолжаем с проверкой по токену
      }
    }
    
    // Возвращаем успешный ответ с информацией о пользователе
    return res.status(200).json({
      authenticated: true,
      user: {
        username: token.username,
        name: token.name,
        role: token.role,
        userId: token.userId
      }
    });
  } catch (error) {
    // В случае ошибки проверки токена
    console.error('Ошибка при проверке аутентификации:', error);
    return res.status(401).json({ authenticated: false });
  }
} 