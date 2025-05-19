import { db } from './firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';

/**
 * Сервис для работы с новостями
 */
export const newsService = {
  // Получение всех новостей
  getAllNews: async () => {
    try {
      const newsRef = collection(db, 'news');
      const q = query(newsRef, orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Ошибка при получении новостей:', error);
      throw error;
    }
  },

  // Получение одной новости по ID
  getNewsById: async (id) => {
    try {
      const docRef = doc(db, 'news', id);
      const snapshot = await getDoc(docRef);
      
      if (snapshot.exists()) {
        return {
          id: snapshot.id,
          ...snapshot.data()
        };
      }
      
      throw new Error('Новость не найдена');
    } catch (error) {
      console.error(`Ошибка при получении новости ${id}:`, error);
      throw error;
    }
  },

  // Создание новости
  createNews: async (newsData) => {
    try {
      // Добавляем timestamp для created_at и updated_at
      const data = {
        ...newsData,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      };
      
      const newsRef = collection(db, 'news');
      const docRef = await addDoc(newsRef, data);
      
      return {
        id: docRef.id,
        ...data
      };
    } catch (error) {
      console.error('Ошибка при создании новости:', error);
      throw error;
    }
  },

  // Обновление новости
  updateNews: async (id, newsData) => {
    try {
      // Добавляем timestamp для updated_at
      const data = {
        ...newsData,
        updated_at: serverTimestamp()
      };
      
      const docRef = doc(db, 'news', id);
      await setDoc(docRef, data, { merge: true });
      
      return {
        id,
        ...data
      };
    } catch (error) {
      console.error(`Ошибка при обновлении новости ${id}:`, error);
      throw error;
    }
  },

  // Удаление новости
  deleteNews: async (id) => {
    try {
      const docRef = doc(db, 'news', id);
      await deleteDoc(docRef);
      
      return { id };
    } catch (error) {
      console.error(`Ошибка при удалении новости ${id}:`, error);
      throw error;
    }
  }
};

/**
 * Сервис для работы с контентом страниц
 */
export const contentService = {
  // Получение контента страницы
  getContent: async (contentId) => {
    try {
      const docRef = doc(db, 'content', contentId);
      const snapshot = await getDoc(docRef);
      
      if (snapshot.exists()) {
        return snapshot.data();
      }
      
      throw new Error(`Контент ${contentId} не найден`);
    } catch (error) {
      console.error(`Ошибка при получении контента ${contentId}:`, error);
      throw error;
    }
  },

  // Обновление контента страницы
  updateContent: async (contentId, data) => {
    try {
      const docRef = doc(db, 'content', contentId);
      
      // Добавляем timestamp для updated_at
      const contentData = {
        ...data,
        updated_at: serverTimestamp()
      };
      
      await setDoc(docRef, contentData, { merge: true });
      
      return contentData;
    } catch (error) {
      console.error(`Ошибка при обновлении контента ${contentId}:`, error);
      throw error;
    }
  }
};

/**
 * Функция для миграции данных из файлов в Firestore
 */
export const migrateDataToFirestore = async (data) => {
  try {
    // Для каждого типа данных в объекте data
    for (const [key, value] of Object.entries(data)) {
      const collectionRef = collection(db, key);
      
      if (Array.isArray(value)) {
        // Если это массив, создаем документ для каждого элемента
        console.log(`Миграция ${value.length} элементов в коллекцию ${key}`);
        
        for (const item of value) {
          await addDoc(collectionRef, {
            ...item,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp()
          });
        }
      } else {
        // Если это объект, создаем один документ с этим именем
        console.log(`Миграция объекта в документ ${key}`);
        
        await setDoc(doc(db, 'content', key), {
          ...value,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp()
        });
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Ошибка при миграции данных:', error);
    throw error;
  }
};

/**
 * Сервис для работы с дипломами
 */
export const diplomasService = {
  // Получение всех дипломов
  getAllDiplomas: async () => {
    try {
      const diplomasRef = collection(db, 'diplomas');
      const q = query(diplomasRef, orderBy('fio', 'asc'));
      const snapshot = await getDocs(q);
      
      console.log('Diplomas data loaded:', snapshot.docs.length, 'records');
      
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log('Sample diploma data:', data.length > 0 ? data[0] : 'No data');
      
      return data;
    } catch (error) {
      console.error('Ошибка при получении дипломов:', error);
      throw error;
    }
  },

  // Поиск дипломов по ФИО или номеру
  searchDiplomas: async (searchTerm) => {
    try {
      const diplomasRef = collection(db, 'diplomas');
      const snapshot = await getDocs(diplomasRef);
      
      const term = searchTerm.toLowerCase().trim();
      
      // Фильтрация на клиентской стороне, так как Firestore не поддерживает
      // полнотекстовый поиск без дополнительных индексов
      return snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(diploma => 
          diploma.fio.toLowerCase().includes(term) || 
          (diploma.number && diploma.number.toLowerCase().includes(term))
        );
    } catch (error) {
      console.error('Ошибка при поиске дипломов:', error);
      throw error;
    }
  },
  
  // Поиск дипломов по предмету
  getDiplomasBySubject: async (subject) => {
    try {
      if (!subject || subject === 'all') {
        return diplomasService.getAllDiplomas();
      }
      
      const diplomasRef = collection(db, 'diplomas');
      const snapshot = await getDocs(diplomasRef);
      
      // Фильтрация на клиентской стороне
      return snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(diploma => 
          diploma.subject && 
          diploma.subject.toLowerCase() === subject.toLowerCase()
        );
    } catch (error) {
      console.error('Ошибка при получении дипломов по предмету:', error);
      throw error;
    }
  },

  // Добавление нового диплома
  addDiploma: async (diplomaData) => {
    try {
      const data = {
        ...diplomaData,
        created_at: serverTimestamp()
      };
      
      const diplomasRef = collection(db, 'diplomas');
      const docRef = await addDoc(diplomasRef, data);
      
      return {
        id: docRef.id,
        ...data
      };
    } catch (error) {
      console.error('Ошибка при добавлении диплома:', error);
      throw error;
    }
  },

  // Обновление диплома
  updateDiploma: async (id, diplomaData) => {
    try {
      // Добавляем timestamp для updated_at
      const data = {
        ...diplomaData,
        updated_at: serverTimestamp()
      };
      
      const docRef = doc(db, 'diplomas', id);
      await setDoc(docRef, data, { merge: true });
      
      return {
        id,
        ...data
      };
    } catch (error) {
      console.error(`Ошибка при обновлении диплома ${id}:`, error);
      throw error;
    }
  },
  
  // Удаление диплома
  deleteDiploma: async (id) => {
    try {
      const docRef = doc(db, 'diplomas', id);
      await deleteDoc(docRef);
      
      return { id, success: true };
    } catch (error) {
      console.error(`Ошибка при удалении диплома ${id}:`, error);
      throw error;
    }
  },

  // Массовое добавление дипломов
  addBulkDiplomas: async (diplomasArray) => {
    try {
      const diplomasRef = collection(db, 'diplomas');
      const results = [];
      
      for (const diplomaData of diplomasArray) {
        const data = {
          ...diplomaData,
          created_at: serverTimestamp()
        };
        
        const docRef = await addDoc(diplomasRef, data);
        results.push({
          id: docRef.id,
          ...data
        });
      }
      
      return results;
    } catch (error) {
      console.error('Ошибка при массовом добавлении дипломов:', error);
      throw error;
    }
  },

  // Проверка подключения к Firebase
  checkFirebaseConnection: async () => {
    try {
      if (!db) {
        return { 
          success: false, 
          message: 'Firebase не инициализирован' 
        };
      }
      
      // Простой запрос для проверки соединения
      const diplomasRef = collection(db, 'diplomas');
      const snapshot = await getDocs(diplomasRef);
      
      return { 
        success: true, 
        message: `Соединение успешно. Найдено ${snapshot.docs.length} записей.` 
      };
    } catch (error) {
      console.error('Ошибка при проверке соединения:', error);
      return { 
        success: false, 
        message: `Ошибка соединения: ${error.message}` 
      };
    }
  }
}; 