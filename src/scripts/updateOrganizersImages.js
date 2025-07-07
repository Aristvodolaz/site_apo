// Скрипт для обновления изображений организаторов на placeholder
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

// Конфигурация Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDGUHtsKlZv1-FMdHSJyHcjWBaUyAjIUHs",
  authDomain: "hse-service.firebaseapp.com",
  databaseURL: "https://hse-service-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "hse-service",
  storageBucket: "hse-service.firebasestorage.app",
  messagingSenderId: "538884805084",
  appId: "1:538884805084:web:8c02a41a0b543994dc3f19",
  measurementId: "G-8HLWX6QBE4"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function updateOrganizersImages() {
  try {
    console.log('🚀 Обновляем изображения организаторов на placeholder...');
    
    // Обновляем изображения на placeholder
    const organizersIds = ['1', '2', '3', '4', '5', '6'];
    
    for (const id of organizersIds) {
      const docRef = doc(db, 'organizers', id);
      
      await updateDoc(docRef, {
        image: '/images/organizers/placeholder.svg',
        updated_at: new Date()
      });
      
      console.log(`✅ Обновлено изображение для организации ID: ${id}`);
    }
    
    console.log('🎉 Все изображения обновлены на placeholder!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Ошибка при обновлении изображений:', error);
    process.exit(1);
  }
}

// Запускаем обновление
updateOrganizersImages(); 