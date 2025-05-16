import { sign } from 'jsonwebtoken';
import cookie from 'cookie';
import adminService from '../../../lib/adminService';

// Секретный ключ (должен совпадать с ключом в validate.js)
const JWT_SECRET = 'your-secret-key';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Метод не разрешен' });
  }

  try {
    const { login, password } = req.body;

    // Проверяем учетные данные через adminService
    const adminData = await adminService.verifyCredentials(login, password);

    if (adminData) {
      // Создаем JWT-токен с данными администратора
      const token = sign(
        {
          username: adminData.login,
          name: adminData.name,
          role: adminData.role,
          admin: true,
          userId: adminData.id
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

      // Возвращаем успешный ответ с минимальными данными пользователя
      return res.status(200).json({ 
        success: true,
        user: {
          login: adminData.login,
          name: adminData.name,
          role: adminData.role
        }
      });
    } else {
      // Возвращаем ошибку при неверных учетных данных
      return res.status(401).json({ success: false, message: 'Неверный логин или пароль' });
    }
  } catch (error) {
    console.error('Ошибка при входе:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Произошла ошибка при обработке запроса' 
    });
  }
} 