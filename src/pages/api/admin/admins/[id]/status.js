import { verify } from 'jsonwebtoken';
import cookie from 'cookie';
import adminService from '../../../../../lib/adminService';

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

// Получение информации о текущем пользователе
const getCurrentUser = (req) => {
  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    if (!cookies.auth) return null;
    
    const token = verify(cookies.auth, JWT_SECRET);
    return {
      id: token.userId,
      username: token.username,
      role: token.role
    };
  } catch {
    return null;
  }
};

export default async function handler(req, res) {
  // Проверяем аутентификацию
  if (!isAuthenticated(req)) {
    return res.status(401).json({ message: 'Требуется аутентификация' });
  }

  // Получаем ID администратора из параметров запроса
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ message: 'Необходимо указать ID администратора' });
  }

  // Обработка PATCH запроса - изменение статуса администратора
  if (req.method === 'PATCH') {
    // Проверяем права доступа (только суперадмин может менять статус администраторов)
    if (!isSuperAdmin(req)) {
      return res.status(403).json({ message: 'Недостаточно прав для выполнения операции' });
    }
    
    try {
      const { active } = req.body;
      
      if (active === undefined) {
        return res.status(400).json({ 
          success: false, 
          message: 'Необходимо указать статус активности' 
        });
      }
      
      // Проверяем, существует ли администратор
      const admin = await adminService.getAdminById(id);
      
      if (!admin) {
        return res.status(404).json({ 
          success: false, 
          message: 'Администратор не найден' 
        });
      }
      
      // Получаем текущего пользователя
      const currentUser = getCurrentUser(req);
      
      // Не даем блокировать самого себя
      if (currentUser && currentUser.id === id) {
        return res.status(403).json({ 
          success: false, 
          message: 'Невозможно изменить статус своей учетной записи' 
        });
      }
      
      // Не даем блокировать суперадминистратора
      if (admin.role === 'superadmin') {
        return res.status(403).json({ 
          success: false, 
          message: 'Невозможно изменить статус суперадминистратора' 
        });
      }
      
      // Изменяем статус администратора
      const updatedAdmin = await adminService.changeStatus(id, active);
      
      return res.status(200).json({ 
        success: true, 
        admin: updatedAdmin
      });
    } catch (error) {
      console.error(`Ошибка при изменении статуса администратора ${id}:`, error);
      return res.status(500).json({ 
        success: false, 
        message: 'Произошла ошибка при изменении статуса администратора' 
      });
    }
  }
  
  // Возвращаем ошибку для других методов
  return res.status(405).json({ message: 'Метод не разрешен' });
} 