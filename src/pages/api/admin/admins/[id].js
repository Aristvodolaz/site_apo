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

  // Получаем ID администратора из параметров запроса
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ message: 'Необходимо указать ID администратора' });
  }

  // Обработка GET запроса - получение информации об администраторе
  if (req.method === 'GET') {
    try {
      const admin = await adminService.getAdminById(id);
      
      if (!admin) {
        return res.status(404).json({ 
          success: false, 
          message: 'Администратор не найден' 
        });
      }
      
      return res.status(200).json({ 
        success: true, 
        admin 
      });
    } catch (error) {
      console.error(`Ошибка при получении администратора ${id}:`, error);
      return res.status(500).json({ 
        success: false, 
        message: 'Произошла ошибка при получении информации об администраторе' 
      });
    }
  }
  
  // Обработка PUT запроса - обновление информации об администраторе
  if (req.method === 'PUT' || req.method === 'PATCH') {
    // Проверяем права доступа (только суперадмин может изменять администраторов)
    if (!isSuperAdmin(req)) {
      return res.status(403).json({ message: 'Недостаточно прав для выполнения операции' });
    }
    
    try {
      const { login, password, name, role } = req.body;
      
      // Обновляем информацию об администраторе
      const admin = await adminService.updateAdmin(id, {
        ...(login && { login }),
        ...(password && { password }),
        ...(name && { name }),
        ...(role && { role })
      });
      
      return res.status(200).json({ 
        success: true, 
        admin 
      });
    } catch (error) {
      console.error(`Ошибка при обновлении администратора ${id}:`, error);
      return res.status(500).json({ 
        success: false, 
        message: error.message || 'Произошла ошибка при обновлении администратора' 
      });
    }
  }
  
  // Обработка DELETE запроса - удаление администратора
  if (req.method === 'DELETE') {
    // Проверяем права доступа (только суперадмин может удалять администраторов)
    if (!isSuperAdmin(req)) {
      return res.status(403).json({ message: 'Недостаточно прав для выполнения операции' });
    }
    
    try {
      // Проверяем, существует ли администратор
      const admin = await adminService.getAdminById(id);
      
      if (!admin) {
        return res.status(404).json({ 
          success: false, 
          message: 'Администратор не найден' 
        });
      }
      
      // Не даем удалить суперадминистратора
      if (admin.role === 'superadmin') {
        return res.status(403).json({ 
          success: false, 
          message: 'Невозможно удалить суперадминистратора' 
        });
      }
      
      // Удаляем администратора
      await adminService.deleteAdmin(id);
      
      return res.status(200).json({ 
        success: true, 
        message: 'Администратор успешно удален' 
      });
    } catch (error) {
      console.error(`Ошибка при удалении администратора ${id}:`, error);
      return res.status(500).json({ 
        success: false, 
        message: 'Произошла ошибка при удалении администратора' 
      });
    }
  }
  
  // Возвращаем ошибку для других методов
  return res.status(405).json({ message: 'Метод не разрешен' });
} 