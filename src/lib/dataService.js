import { db } from './firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';

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