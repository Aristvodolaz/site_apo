import { sign } from 'jsonwebtoken';
import cookie from 'cookie';

// Захардкоженные учетные данные (должны совпадать с данными в pages/admin/login.js)
const ADMIN_CREDENTIALS = {
  login: 'admin',
  password: 'arctic2025olympiad'
};

// Секретный ключ (должен совпадать с ключом в validate.js)
const JWT_SECRET = 'your-secret-key';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Метод не разрешен' });
  }

  const { login, password } = req.body;

  // Проверяем учетные данные
  if (login === ADMIN_CREDENTIALS.login && password === ADMIN_CREDENTIALS.password) {
    // Создаем JWT-токен
    const token = sign(
      {
        username: login,
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

    // Возвращаем успешный ответ
    return res.status(200).json({ success: true });
  } else {
    // Возвращаем ошибку при неверных учетных данных
    return res.status(401).json({ success: false, message: 'Неверный логин или пароль' });
  }
} 