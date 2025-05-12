// Скрипт для добавления документов в Firestore
// Запуск: node src/scripts/addDocumentsData.js

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
require('dotenv').config();

// Конфигурация Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Тестовые данные документов
const documentsData = [
  {
    id: "doc1",
    title: "Порядок проведения олимпиад школьников",
    description: "Официальный документ Министерства науки и высшего образования Российской Федерации, регламентирующий проведение олимпиад школьников.",
    category: "official",
    url: "https://olymp.hse.ru/mirror/pubs/share/757723981.pdf"
  },
  {
    id: "doc2",
    title: "Положение о проведении Арктической олимпиады",
    description: "Основной документ, определяющий цели, задачи, порядок организации и проведения Арктической олимпиады «Полярный круг».",
    category: "main",
    url: "/documents/polozhenie_arctic_olympiad_2025.pdf"
  },
  {
    id: "doc3",
    title: "Регламент проведения по химии",
    description: "Подробный регламент проведения отборочного и заключительного этапов по профилю \"Химия\".",
    category: "subjects",
    url: "/documents/chemistry_reglament_2025.pdf"
  },
  {
    id: "doc4",
    title: "Информация для участников",
    description: "Дополнительная информация для участников олимпиады.",
    category: "additional",
    url: "/documents/info_for_participants.pdf"
  },
  // Дополнительные документы категории "subjects"
  {
    id: "doc5",
    title: "Регламент проведения по физике",
    description: "Подробный регламент проведения отборочного и заключительного этапов по профилю \"Физика\".",
    category: "subjects",
    url: "/documents/physics_reglament_2025.pdf"
  },
  {
    id: "doc6",
    title: "Регламент проведения по математике",
    description: "Подробный регламент проведения отборочного и заключительного этапов по профилю \"Математика\".",
    category: "subjects",
    url: "/documents/math_reglament_2025.pdf"
  },
  {
    id: "doc7",
    title: "Регламент проведения по информатике",
    description: "Подробный регламент проведения отборочного и заключительного этапов по профилю \"Информатика\".",
    category: "subjects",
    url: "/documents/informatics_reglament_2025.pdf"
  }
];

// Функция для добавления документов в Firestore
async function addDocumentsData() {
  try {
    console.log('Начинаем добавление документов в Firestore...');
    
    for (const document of documentsData) {
      const docRef = doc(db, 'documents', document.id);
      
      await setDoc(docRef, {
        title: document.title,
        description: document.description,
        category: document.category,
        url: document.url,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      console.log(`Добавлен документ: ${document.title}`);
    }
    
    console.log('Все документы успешно добавлены в Firestore!');
    process.exit(0);
  } catch (error) {
    console.error('Ошибка при добавлении документов в Firestore:', error);
    process.exit(1);
  }
}

// Запускаем функцию добавления документов
addDocumentsData(); 