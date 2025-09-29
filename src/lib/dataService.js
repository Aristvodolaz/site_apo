import { db } from './firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc,
  query,
  orderBy,
  where,
  serverTimestamp
} from 'firebase/firestore';

// Функция для генерации следующего доступного ID участника
export const generateNextParticipantId = async () => {
  try {
    const currentYear = new Date().getFullYear();
    const yearPrefix = `APO-${currentYear}-`;
    
    // Получаем все регистрации текущего года
    const registrationsRef = collection(db, 'registrations');
    const q = query(
      registrationsRef,
      where('participantId', '>=', yearPrefix),
      where('participantId', '<', `APO-${currentYear + 1}-`),
      orderBy('participantId', 'desc')
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      // Если нет регистраций в этом году, начинаем с 00001
      return `${yearPrefix}00001`;
    }
    
    // Получаем последний использованный номер
    const lastId = snapshot.docs[0].data().participantId;
    const lastNumber = parseInt(lastId.split('-')[2]);
    
    // Генерируем следующий номер
    const nextNumber = (lastNumber + 1).toString().padStart(5, '0');
    return `${yearPrefix}${nextNumber}`;
  } catch (error) {
    console.error('Error generating next participant ID:', error);
    throw error;
  }
};

// Функция для получения данных из коллекции
export const getCollectionData = async (collectionName) => {
  try {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Error fetching ${collectionName}:`, error);
    return [];
  }
};

// Функция для получения отсортированных новостей
export const getNews = async () => {
  try {
    if (!db) {
      console.error('Firebase не инициализирован');
      return [];
    }

    const newsRef = collection(db, 'news');
    const q = query(newsRef, orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
};

// Функция для получения одного документа
export const getDocument = async (collectionName, docId) => {
  try {
    if (!db) {
      console.error('Firebase не инициализирован');
      return null;
    }

    const docRef = doc(db, collectionName, docId);
    const snapshot = await getDoc(docRef);
    
    if (snapshot.exists()) {
      return {
        id: snapshot.id,
        ...snapshot.data()
      };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching document ${docId} from ${collectionName}:`, error);
    return null;
  }
};

// Функция для обновления документа
export const updateDocument = async (collectionName, docId, data) => {
  try {
    if (!db) {
      throw new Error('Firebase не инициализирован');
    }

    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, {
      ...data,
      updated_at: serverTimestamp()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error(`Error updating document ${docId} in ${collectionName}:`, error);
    throw error;
  }
};

// Функция для создания документа с указанным ID
export const createDocumentWithId = async (collectionName, docId, data) => {
  try {
    if (!db) {
      throw new Error('Firebase не инициализирован');
    }

    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, {
      ...data,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error(`Error creating document ${docId} in ${collectionName}:`, error);
    throw error;
  }
};