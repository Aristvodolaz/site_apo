import { verify } from 'jsonwebtoken';
import cookie from 'cookie';
import adminService from '../../../../lib/adminService';

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

// Проверка прав суперадминистратора
const isSuperAdmin = (req) => {
  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    if (!cookies.auth) return false;
    
    const token = verify(cookies.auth, JWT_SECRET);
    return token.admin === true && token.role === 'superadmin';
  } catch {
    return false;
  }
};

export default async function handler(req, res) {
  // Проверяем аутентификацию
  if (!isAuthenticated(req)) {
    return res.status(401).json({ message: 'Требуется аутентификация' });
  }

  // Обработка GET запроса - получение списка администраторов
  if (req.method === 'GET') {
    try {
      const admins = await adminService.getAllAdmins();
      return res.status(200).json({ success: true, admins });
    } catch (error) {
      console.error('Ошибка при получении администраторов:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Произошла ошибка при получении списка администраторов' 
      });
    }
  }
  
  // Обработка POST запроса - создание нового администратора
  if (req.method === 'POST') {
    // Проверяем права доступа (только суперадмин может создавать администраторов)
    if (!isSuperAdmin(req)) {
      return res.status(403).json({ message: 'Недостаточно прав для выполнения операции' });
    }
    
    try {
      const { login, password, name, role } = req.body;
      
      // Проверяем обязательные поля
      if (!login || !password || !name) {
        return res.status(400).json({ 
          success: false, 
          message: 'Необходимо указать логин, пароль и имя' 
        });
      }
      
      // Создаем нового администратора
      const admin = await adminService.createAdmin({
        login,
        password,
        name,
        role: role || 'admin'
      });
      
      return res.status(201).json({ 
        success: true, 
        admin 
      });
    } catch (error) {
      console.error('Ошибка при создании администратора:', error);
      return res.status(500).json({ 
        success: false, 
        message: error.message || 'Произошла ошибка при создании администратора' 
      });
    }
  }
  
  // Возвращаем ошибку для других методов
  return res.status(405).json({ message: 'Метод не разрешен' });
} 