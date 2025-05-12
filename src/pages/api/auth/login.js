import { sign } from 'jsonwebtoken';
import cookie from 'cookie';

// Защищенные учетные данные (в реальном проекте должны храниться в базе данных)
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'arctic2025olympiad'; // В реальном проекте используйте хешированные пароли
const JWT_SECRET = 'your-secret-key'; // Используйте случайный сложный ключ, хранимый в .env

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Метод не разрешен' });
  }

  const { username, password } = req.body;

  // Проверка учетных данных
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    // Создаем JWT токен
    const token = sign(
      { 
        username,
        admin: true 
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Устанавливаем куки с токеном
    res.setHeader('Set-Cookie', cookie.serialize('auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 8 * 60 * 60, // 8 часов
      sameSite: 'strict',
      path: '/'
    }));

    // Отправляем успешный ответ
    res.status(200).json({ success: true });
  } else {
    // Отправляем ошибку при неверных учетных данных
    res.status(401).json({ message: 'Неверное имя пользователя или пароль' });
  }
} 