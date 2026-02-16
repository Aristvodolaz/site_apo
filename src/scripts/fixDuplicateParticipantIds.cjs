/**
 * Скрипт для исправления дублирующихся participantId в базе данных
 * 
 * Запуск: node src/scripts/fixDuplicateParticipantIds.cjs
 */

const { initializeApp } = require('firebase/app');
const { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  updateDoc,
  setDoc,
  query,
  orderBy
} = require('firebase/firestore');
require('dotenv').config();

// Firebase конфигурация из переменных окружения
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fixDuplicateIds() {
  try {
    console.log('🔍 Начинаю поиск и исправление дублирующихся ID...\n');
    
    // Получаем все регистрации
    const registrationsRef = collection(db, 'registrations');
    const q = query(registrationsRef, orderBy('createdAt', 'asc'));
    const snapshot = await getDocs(q);
    
    console.log(`📊 Всего найдено регистраций: ${snapshot.docs.length}\n`);
    
    // Группируем участников по participantId
    const participantIdMap = new Map();
    const documentsWithoutId = [];
    
    snapshot.docs.forEach(docSnapshot => {
      const data = docSnapshot.data();
      const participantId = data.participantId;
      
      if (!participantId || participantId === '—') {
        documentsWithoutId.push({
          docId: docSnapshot.id,
          data: data
        });
      } else {
        if (!participantIdMap.has(participantId)) {
          participantIdMap.set(participantId, []);
        }
        participantIdMap.get(participantId).push({
          docId: docSnapshot.id,
          data: data,
          createdAt: data.createdAt
        });
      }
    });
    
    // Находим дубликаты
    const duplicates = [];
    participantIdMap.forEach((docs, participantId) => {
      if (docs.length > 1) {
        duplicates.push({ participantId, docs });
      }
    });
    
    console.log(`⚠️  Найдено дублирующихся ID: ${duplicates.length}`);
    console.log(`⚠️  Документов без ID: ${documentsWithoutId.length}\n`);
    
    if (duplicates.length === 0 && documentsWithoutId.length === 0) {
      console.log('✅ Дубликаты не найдены! База данных в порядке.');
      return;
    }
    
    // Определяем следующий доступный номер
    const currentYear = new Date().getFullYear();
    let maxNumber = 0;
    
    participantIdMap.forEach((docs, participantId) => {
      if (participantId.startsWith(`APO-${currentYear}-`)) {
        const number = parseInt(participantId.split('-')[2]);
        if (number > maxNumber) {
          maxNumber = number;
        }
      }
    });
    
    let nextNumber = maxNumber + 1;
    console.log(`📝 Следующий доступный номер: ${nextNumber}\n`);
    
    let updatedCount = 0;
    
    // Исправляем дубликаты (оставляем первый, остальные переназначаем)
    for (const { participantId, docs } of duplicates) {
      console.log(`\n🔧 Исправление дубликатов для ID: ${participantId}`);
      console.log(`   Всего документов с этим ID: ${docs.length}`);
      
      // Сортируем по дате создания (первый остаётся, остальные переназначаем)
      docs.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateA - dateB;
      });
      
      // Первый документ оставляем как есть
      console.log(`   ✓ Оставляем первый документ (ID: ${docs[0].docId})`);
      
      // Остальным присваиваем новые ID
      for (let i = 1; i < docs.length; i++) {
        const newParticipantId = `APO-${currentYear}-${nextNumber.toString().padStart(5, '0')}`;
        const docRef = doc(db, 'registrations', docs[i].docId);
        
        await updateDoc(docRef, {
          participantId: newParticipantId
        });
        
        console.log(`   ✓ Обновлён документ ${docs[i].docId}: ${participantId} → ${newParticipantId}`);
        nextNumber++;
        updatedCount++;
      }
    }
    
    // Присваиваем ID документам без ID
    if (documentsWithoutId.length > 0) {
      console.log(`\n🔧 Присваивание ID документам без participantId...`);
      
      for (const { docId, data } of documentsWithoutId) {
        const newParticipantId = `APO-${currentYear}-${nextNumber.toString().padStart(5, '0')}`;
        const docRef = doc(db, 'registrations', docId);
        
        await updateDoc(docRef, {
          participantId: newParticipantId
        });
        
        console.log(`   ✓ Присвоен ID документу ${docId}: ${newParticipantId}`);
        nextNumber++;
        updatedCount++;
      }
    }
    
    console.log(`\n✅ Исправление завершено!`);
    console.log(`📊 Обновлено документов: ${updatedCount}`);
    console.log(`📝 Следующий свободный номер: ${nextNumber}`);
    
    // Создаём счётчик для будущих регистраций
    const counterDocRef = doc(db, 'counters', `participantId_${currentYear}`);
    try {
      await updateDoc(counterDocRef, {
        currentNumber: nextNumber - 1,
        year: currentYear,
        updatedAt: new Date()
      });
    } catch (error) {
      if (error.code === 'not-found') {
        // Если документ не существует, создаём его
        await setDoc(counterDocRef, {
          currentNumber: nextNumber - 1,
          year: currentYear,
          updatedAt: new Date()
        });
      } else {
        throw error;
      }
    }
    
    console.log(`✅ Счётчик обновлён: ${nextNumber - 1}`);
    
  } catch (error) {
    console.error('❌ Ошибка при исправлении ID:', error);
    throw error;
  }
}

// Запуск скрипта
fixDuplicateIds()
  .then(() => {
    console.log('\n🎉 Скрипт успешно завершён!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Ошибка выполнения скрипта:', error);
    process.exit(1);
  });
