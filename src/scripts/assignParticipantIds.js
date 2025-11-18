// Скрипт для назначения participantId пользователям и отправки email
// Этот скрипт находит пользователей по email, генерирует для них ID участника и отправляет письма

// Подгружаем переменные окружения
require('dotenv').config();

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, query, where, getDocs, doc, updateDoc } = require('firebase/firestore');
const nodemailer = require('nodemailer');

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

// Список email пользователей, которым нужно назначить participantId
const emailsToUpdate = [
  'venetskatrin@mail.ru',
  'kirillaxenov21@gmail.com',
];

// Функция для генерации следующего доступного ID участника
async function generateNextParticipantId() {
  try {
    const currentYear = new Date().getFullYear();
    const yearPrefix = `APO-${currentYear}-`;
    
    // Получаем все регистрации текущего года
    const registrationsRef = collection(db, 'registrations');
    const q = query(
      registrationsRef,
      where('participantId', '>=', yearPrefix),
      where('participantId', '<', `APO-${currentYear + 1}-`)
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      // Если нет регистраций в этом году, начинаем с 00001
      return `${yearPrefix}00001`;
    }
    
    // Получаем все существующие номера и находим максимальный
    let maxNumber = 0;
    snapshot.docs.forEach(doc => {
      const id = doc.data().participantId;
      if (id && id.startsWith(yearPrefix)) {
        const number = parseInt(id.split('-')[2]);
        if (number > maxNumber) {
          maxNumber = number;
        }
      }
    });
    
    // Генерируем следующий номер
    const nextNumber = (maxNumber + 1).toString().padStart(5, '0');
    return `${yearPrefix}${nextNumber}`;
  } catch (error) {
    console.error('Error generating next participant ID:', error);
    throw error;
  }
}

// Функция для отправки email
async function sendRegistrationEmail(to, userData) {
  // Создаем транспорт для отправки email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000
  });

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to,
    subject: '❄️ Ваш номер участника - Арктическая олимпиада 2025',
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(180deg, #e6f2ff, #ffffff); border-radius: 12px; overflow: hidden; box-shadow: 0 6px 16px rgba(0,0,0,0.1);">
      <div style="background: linear-gradient(135deg, #005f99, #66ccff); padding: 24px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 28px;">❄ Добро пожаловать! ❄</h1>
      </div>
      <div style="padding: 24px; color: #00334d;">
        <h2 style="margin-top: 0; font-size: 22px;">Здравствуйте, ${userData.firstName}!</h2>
        <p style="font-size: 16px; line-height: 1.6;">
          Поздравляем! Вы успешно зарегистрировались на Арктическую олимпиаду 2025.
        </p>
        <div style="background: #f0f9ff; border-left: 4px solid #66ccff; padding: 16px; margin: 20px 0; border-radius: 8px;">
          <p style="margin: 0 0 8px;"><strong>Ваши данные:</strong></p>
           <ul style="margin: 0; padding-left: 20px; font-size: 15px;">
             <li style="margin-bottom: 12px;">
               <strong style="display: block; font-size: 18px; color: #1976f6; margin-bottom: 4px;">
                 Ваш номер участника: ${userData.participantId}
               </strong>
               <span style="font-size: 13px; color: #666;">
                 Пожалуйста, сохраните этот номер. Он потребуется для идентификации на олимпиаде.
               </span>
             </li>
             <li>Имя: ${userData.firstName} ${userData.middleName} ${userData.lastName}</li>
             <li>Email: ${userData.email}</li>
             <li>Школа: ${userData.school}</li>
             <li>Класс: ${userData.grade}</li>
             <li>Выбранные предметы: ${(userData.subjects || []).map(subject => {
               const names = {
                 math: 'Математика',
                 biology: 'Биология',
                 physics: 'Физика',
                 chemistry: 'Химия'
               };
               return names[subject] || subject;
             }).join(', ')}</li>
           </ul>
           <div style="margin-top: 20px; padding: 12px; background: #f8f9fa; border-radius: 8px; font-size: 14px; color: #666;">
             <p style="margin: 0;">
               <strong>Важно:</strong> Сохраните ваш номер участника (${userData.participantId}). 
               Он будет необходим для:
             </p>
             <ul style="margin: 8px 0 0 0; padding-left: 20px;">
               <li>Идентификации на олимпиаде</li>
               <li>Получения результатов</li>
               <li>Обращения в службу поддержки</li>
             </ul>
           </div>
        </div>
        <p style="font-size: 16px; line-height: 1.6;">
          Спасибо, что выбрали нас! Пусть этот путь будет чистым и светлым, как арктический лёд. ❄️
        </p>
      </div>
      <div style="background: #e6f7ff; text-align: center; padding: 16px; font-size: 14px; color: #006080;">
        © ${new Date().getFullYear()} Арктическая олимпиада • Все права защищены
      </div>
    </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

// Основная функция
async function assignParticipantIds() {
  console.log('=== Начало работы скрипта ===');
  console.log(`Обработка ${emailsToUpdate.length} пользователей...\n`);

  // Проверяем наличие переменных окружения
  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.error('❌ ОШИБКА: Не заданы переменные окружения SMTP_USER и SMTP_PASSWORD');
    console.error('Создайте файл .env в корне проекта со следующими переменными:');
    console.error('SMTP_USER=your-email@gmail.com');
    console.error('SMTP_PASSWORD=your-app-password');
    console.error('SMTP_FROM=your-email@gmail.com');
    process.exit(1);
  }

  const results = {
    success: [],
    failed: []
  };

  for (const email of emailsToUpdate) {
    try {
      console.log(`\n--- Обработка: ${email} ---`);
      
      // Ищем пользователя в коллекции registrations
      const registrationsRef = collection(db, 'registrations');
      const q = query(registrationsRef, where('email', '==', email.toLowerCase()));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.error(`❌ Пользователь с email ${email} не найден в базе`);
        results.failed.push({ email, reason: 'Не найден в базе' });
        continue;
      }

      if (snapshot.docs.length > 1) {
        console.warn(`⚠️ Найдено несколько записей для ${email}. Обрабатываем первую.`);
      }

      const userDoc = snapshot.docs[0];
      const userData = userDoc.data();
      const userId = userDoc.id;

      // Проверяем, есть ли уже participantId
      if (userData.participantId) {
        console.log(`ℹ️ У пользователя уже есть participantId: ${userData.participantId}`);
        console.log('Отправляем email с существующим ID...');
        
        // Отправляем email с существующим ID
        await sendRegistrationEmail(email, {
          participantId: userData.participantId,
          firstName: userData.firstName,
          middleName: userData.middleName,
          lastName: userData.lastName,
          email: userData.email,
          school: userData.school,
          grade: userData.grade,
          subjects: userData.subjects || []
        });

        console.log(`✅ Email отправлен для ${email} (существующий ID: ${userData.participantId})`);
        results.success.push({ email, participantId: userData.participantId, action: 'Отправлен email с существующим ID' });
        continue;
      }

      // Генерируем новый participantId
      const participantId = await generateNextParticipantId();
      console.log(`✨ Сгенерирован новый participantId: ${participantId}`);

      // Обновляем запись в Firebase
      const userDocRef = doc(db, 'registrations', userId);
      await updateDoc(userDocRef, {
        participantId: participantId,
        updatedAt: new Date().toISOString()
      });
      console.log(`💾 Запись обновлена в Firebase`);

      // Отправляем email
      await sendRegistrationEmail(email, {
        participantId: participantId,
        firstName: userData.firstName,
        middleName: userData.middleName,
        lastName: userData.lastName,
        email: userData.email,
        school: userData.school,
        grade: userData.grade,
        subjects: userData.subjects || []
      });

      console.log(`📧 Email отправлен на ${email}`);
      console.log(`✅ Успешно обработан: ${userData.firstName} ${userData.lastName} - ${participantId}`);
      
      results.success.push({ 
        email, 
        participantId, 
        name: `${userData.firstName} ${userData.lastName}`,
        action: 'Создан новый ID и отправлен email'
      });

    } catch (error) {
      console.error(`❌ Ошибка при обработке ${email}:`, error.message);
      results.failed.push({ email, reason: error.message });
    }
  }

  // Итоговый отчет
  console.log('\n\n=== ИТОГОВЫЙ ОТЧЕТ ===');
  console.log(`\n✅ Успешно обработано: ${results.success.length}`);
  if (results.success.length > 0) {
    results.success.forEach(item => {
      console.log(`  - ${item.email}: ${item.participantId} (${item.action})`);
    });
  }

  console.log(`\n❌ Ошибки: ${results.failed.length}`);
  if (results.failed.length > 0) {
    results.failed.forEach(item => {
      console.log(`  - ${item.email}: ${item.reason}`);
    });
  }

  console.log('\n=== Скрипт завершен ===');
}

// Запускаем скрипт
assignParticipantIds()
  .then(() => {
    console.log('\nГотово! Можно закрыть.');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Критическая ошибка:', error);
    process.exit(1);
  });
