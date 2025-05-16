import { rtdb } from './firebase';
import { 
  ref, 
  get, 
  set, 
  push, 
  remove, 
  update, 
  query, 
  orderByChild, 
  equalTo, 
  child 
} from 'firebase/database';
import { createHash } from 'crypto';

/**
 * Хеширование пароля для безопасного хранения
 * @param {string} password - Пароль для хеширования
 * @returns {string} - Хешированный пароль
 */
const hashPassword = (password) => {
  return createHash('sha256').update(password).digest('hex');
};

/**
 * Сервис для работы с администраторами системы
 */
const adminService = {
  /**
   * Проверка учетных данных администратора
   * @param {string} login - Логин пользователя
   * @param {string} password - Пароль пользователя
   * @returns {Promise<object|null>} - Объект с данными администратора или null
   */
  verifyCredentials: async (login, password) => {
    try {
      // Хешируем пароль для сравнения
      const hashedPassword = hashPassword(password);
      
      // Ищем администратора по логину
      const adminRef = query(
        ref(rtdb, 'admins'), 
        orderByChild('login'), 
        equalTo(login)
      );
      
      const snapshot = await get(adminRef);
      
      if (!snapshot.exists()) {
        return null;
      }
      
      // Перебираем результаты (должен быть только один)
      let adminData = null;
      let adminId = null;
      
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        if (data.password === hashedPassword && data.active !== false) {
          adminData = data;
          adminId = childSnapshot.key;
        }
      });
      
      if (adminData) {
        // Обновляем информацию о последнем входе
        const updates = {};
        updates[`admins/${adminId}/lastLogin`] = new Date().toISOString();
        await update(ref(rtdb), updates);
        
        // Возвращаем данные администратора без пароля
        const { password, ...adminInfo } = adminData;
        return { id: adminId, ...adminInfo };
      }
      
      return null;
    } catch (error) {
      console.error('Ошибка при проверке учетных данных:', error);
      throw error;
    }
  },
  
  /**
   * Получение всех администраторов
   * @returns {Promise<Array>} - Массив объектов с данными администраторов
   */
  getAllAdmins: async () => {
    try {
      const adminsRef = ref(rtdb, 'admins');
      const snapshot = await get(adminsRef);
      
      if (!snapshot.exists()) {
        return [];
      }
      
      const admins = [];
      snapshot.forEach((childSnapshot) => {
        const adminId = childSnapshot.key;
        const adminData = childSnapshot.val();
        
        // Исключаем пароль из данных
        const { password, ...adminInfo } = adminData;
        
        admins.push({
          id: adminId,
          ...adminInfo
        });
      });
      
      return admins;
    } catch (error) {
      console.error('Ошибка при получении администраторов:', error);
      throw error;
    }
  },
  
  /**
   * Получение администратора по ID
   * @param {string} id - ID администратора
   * @returns {Promise<object|null>} - Объект с данными администратора или null
   */
  getAdminById: async (id) => {
    try {
      const adminRef = ref(rtdb, `admins/${id}`);
      const snapshot = await get(adminRef);
      
      if (!snapshot.exists()) {
        return null;
      }
      
      const adminData = snapshot.val();
      
      // Исключаем пароль из данных
      const { password, ...adminInfo } = adminData;
      
      return {
        id,
        ...adminInfo
      };
    } catch (error) {
      console.error(`Ошибка при получении администратора ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Создание нового администратора
   * @param {object} adminData - Данные администратора
   * @returns {Promise<object>} - Объект с данными созданного администратора
   */
  createAdmin: async (adminData) => {
    try {
      // Хешируем пароль перед сохранением
      const password = adminData.password;
      const hashedPassword = hashPassword(password);
      
      // Подготавливаем данные администратора
      const newAdmin = {
        ...adminData,
        password: hashedPassword,
        active: true,
        created: new Date().toISOString(),
        updated: new Date().toISOString()
      };
      
      // Проверяем, существует ли уже админ с таким логином
      const existingAdminRef = query(
        ref(rtdb, 'admins'), 
        orderByChild('login'), 
        equalTo(adminData.login)
      );
      
      const snapshot = await get(existingAdminRef);
      
      if (snapshot.exists()) {
        throw new Error('Администратор с таким логином уже существует');
      }
      
      // Создаем нового администратора
      const adminRef = ref(rtdb, 'admins');
      const newAdminRef = push(adminRef);
      await set(newAdminRef, newAdmin);
      
      // Возвращаем данные без пароля
      const { password: _, ...adminInfo } = newAdmin;
      
      return {
        id: newAdminRef.key,
        ...adminInfo
      };
    } catch (error) {
      console.error('Ошибка при создании администратора:', error);
      throw error;
    }
  },
  
  /**
   * Обновление данных администратора
   * @param {string} id - ID администратора
   * @param {object} adminData - Новые данные администратора
   * @returns {Promise<object>} - Объект с обновленными данными администратора
   */
  updateAdmin: async (id, adminData) => {
    try {
      // Получаем текущие данные администратора
      const adminRef = ref(rtdb, `admins/${id}`);
      const snapshot = await get(adminRef);
      
      if (!snapshot.exists()) {
        throw new Error('Администратор не найден');
      }
      
      const currentData = snapshot.val();
      
      // Подготавливаем данные для обновления
      const updatedData = {
        ...adminData,
        updated: new Date().toISOString()
      };
      
      // Если пароль изменяется, хешируем его
      if (adminData.password && adminData.password !== currentData.password) {
        updatedData.password = hashPassword(adminData.password);
      }
      
      // Обновляем данные администратора
      await update(adminRef, updatedData);
      
      // Возвращаем обновленные данные без пароля
      const { password, ...adminInfo } = { ...currentData, ...updatedData };
      
      return {
        id,
        ...adminInfo
      };
    } catch (error) {
      console.error(`Ошибка при обновлении администратора ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Удаление администратора
   * @param {string} id - ID администратора
   * @returns {Promise<boolean>} - Успешно ли выполнено удаление
   */
  deleteAdmin: async (id) => {
    try {
      const adminRef = ref(rtdb, `admins/${id}`);
      await remove(adminRef);
      return true;
    } catch (error) {
      console.error(`Ошибка при удалении администратора ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Изменение статуса администратора (активен/заблокирован)
   * @param {string} id - ID администратора
   * @param {boolean} active - Новый статус
   * @returns {Promise<object>} - Объект с обновленными данными администратора
   */
  changeStatus: async (id, active) => {
    try {
      const adminRef = ref(rtdb, `admins/${id}`);
      const updates = {
        active,
        updated: new Date().toISOString()
      };
      
      await update(adminRef, updates);
      
      // Получаем обновленные данные
      const snapshot = await get(adminRef);
      const adminData = snapshot.val();
      
      // Возвращаем данные без пароля
      const { password, ...adminInfo } = adminData;
      
      return {
        id,
        ...adminInfo
      };
    } catch (error) {
      console.error(`Ошибка при изменении статуса администратора ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Инициализация базы данных с дефолтным администратором
   * @returns {Promise<boolean>} - Успешно ли выполнена инициализация
   */
  initializeDefaultAdmin: async () => {
    try {
      const adminsRef = ref(rtdb, 'admins');
      const snapshot = await get(adminsRef);
      
      // Если нет администраторов, создаем дефолтного
      if (!snapshot.exists()) {
        const defaultAdmin = {
          login: 'admin',
          password: hashPassword('arctic2025olympiad'),
          name: 'Администратор',
          role: 'superadmin',
          active: true,
          created: new Date().toISOString(),
          updated: new Date().toISOString()
        };
        
        const newAdminRef = push(adminsRef);
        await set(newAdminRef, defaultAdmin);
        
        console.log('Создан дефолтный администратор');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Ошибка при инициализации базы данных:', error);
      throw error;
    }
  }
};

export default adminService; 