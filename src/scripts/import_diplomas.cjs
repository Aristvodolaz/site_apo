const XLSX = require('xlsx');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } = require('firebase/firestore');

// Firebase конфигурация (из src/lib/firebase.js)
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

const filePath = 'C:\\Users\\G15\\Desktop\\Книга1.xlsx';

async function importDiplomas() {
  console.log('=== Начало импорта дипломов ===');
  
  try {
    // 1. Читаем Excel
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const excelData = XLSX.utils.sheet_to_json(worksheet);

    console.log(`Загружено ${excelData.length} строк из Excel.`);

    // 2. Очищаем текущую коллекцию diplomas (опционально, но обычно при импорте из файла хотят заменить данные)
    // Если пользователь хочет ДОБАВИТЬ, закомментируйте этот блок
    const diplomasRef = collection(db, 'diplomas');
    const snapshot = await getDocs(diplomasRef);
    
    if (!snapshot.empty) {
      console.log(`Удаление ${snapshot.docs.length} существующих записей...`);
      const deletePromises = snapshot.docs.map(document => deleteDoc(doc(db, 'diplomas', document.id)));
      await Promise.all(deletePromises);
      console.log('Старые данные удалены.');
    }

    // 3. Загружаем новые данные
    console.log('Загрузка новых данных...');
    let count = 0;
    for (const row of excelData) {
      // Извлекаем класс из шифра (например, 2026-МАТ-04-001 -> 04)
      const number = row['Шифр'] || '';
      const segments = number.split('-');
      const gradeFromCipher = segments.length >= 3 ? parseInt(segments[2]).toString() : '';

      // Преобразуем названия полей
      const diplomaData = {
        fio: row['ФИО'] || '',
        number: number,
        status: row['Степень'] || '',
        subject: (row['Предмет'] || '').toLowerCase(),
        grade: row['Класс'] || gradeFromCipher || 'Другие',
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      };

      await addDoc(diplomasRef, diplomaData);
      count++;
      if (count % 50 === 0) console.log(`Загружено ${count} из ${excelData.length}...`);
    }

    console.log(`\n✅ Успешно импортировано ${count} дипломов.`);
    console.log('=== Импорт завершен ===');

  } catch (error) {
    console.error('❌ Ошибка при импорте:', error);
  }
}

importDiplomas().then(() => process.exit(0));
