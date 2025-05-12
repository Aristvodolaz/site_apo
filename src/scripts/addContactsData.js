// Скрипт для добавления контактных данных в Firestore
// Запуск: node src/scripts/addContactsData.js

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

// Данные контактов
const contactsData = {
  mainOrganizer: {
    name: "Арктический образовательный центр",
    address: "г. Мурманск, ул. Полярная, д. 10",
    phone: "+7 (123) 456-78-90",
    email: "info@arctic-olymp.ru",
    website: "https://arctic-olymp.ru"
  },
  partners: [
    {
      name: "Северный арктический федеральный университет",
      description: "Ведущий вуз региона по подготовке специалистов для работы в арктических условиях",
      website: "https://narfu.ru",
      email: "university@narfu.ru"
    },
    {
      name: "Мурманский арктический государственный университет",
      description: "Образовательный и научный центр Мурманской области",
      website: "https://masu.edu.ru",
      email: "info@masu.edu.ru"
    }
  ],
  olympiadContacts: {
    email: "info@arctic-olymp.ru",
    registrationHelp: "+7 (123) 456-78-90",
    telegram: "@arctic_olympiad",
    vk: "vk.com/arctic_olympiad"
  },
  subjectCoordinators: [
    {
      subject: "Математика",
      name: "Иванов Иван Иванович",
      email: "math@arctic-olymp.ru"
    },
    {
      subject: "Физика",
      name: "Петров Петр Петрович",
      email: "physics@arctic-olymp.ru"
    },
    {
      subject: "Информатика",
      name: "Сидорова Анна Николаевна",
      email: "informatics@arctic-olymp.ru"
    },
    {
      subject: "Химия",
      name: "Кузнецов Алексей Дмитриевич",
      email: "chemistry@arctic-olymp.ru"
    }
  ]
};

// Добавление данных в Firestore
async function addContactsData() {
  try {
    await setDoc(doc(db, 'content', 'contacts'), contactsData);
    console.log('Контактные данные успешно добавлены в Firestore');
    process.exit(0);
  } catch (error) {
    console.error('Ошибка при добавлении данных:', error);
    process.exit(1);
  }
}

// Запуск функции
addContactsData(); 