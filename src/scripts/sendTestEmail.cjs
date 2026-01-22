// Скрипт для ТЕСТОВОЙ рассылки email на один адрес
// Использует данные из Firebase для формирования письма
// Запуск: node src/scripts/sendTestEmail.cjs

require('dotenv').config();

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, limit, query } = require('firebase/firestore');
const nodemailer = require('nodemailer');

// Firebase конфигурация
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

// ТЕСТОВЫЙ EMAIL - на этот адрес будет отправлено письмо
const TEST_EMAIL = 'kap.moral@mail.ru';

// Функция для создания красивого HTML письма
function createEmailTemplate(userData) {
  return `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Арктическая олимпиада - Напоминание</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f0f4f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);">
    
    <!-- Заголовок с градиентом -->
    <div style="background: linear-gradient(135deg, #0066cc 0%, #00a3ff 100%); padding: 40px 30px; text-align: center;">
      <div style="font-size: 48px; margin-bottom: 10px;">❄️</div>
      <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        Арктическая олимпиада «Полярный круг»
      </h1>
      <p style="margin: 10px 0 0; color: rgba(255, 255, 255, 0.95); font-size: 16px;">
        Важное напоминание для участника
      </p>
    </div>

    <!-- Основной контент -->
    <div style="padding: 40px 30px;">
      
      <!-- Приветствие -->
      <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 24px; font-weight: 600;">
        Здравствуйте, ${userData.firstName}!
      </h2>
      
      <p style="margin: 0 0 24px; color: #4a5568; font-size: 16px; line-height: 1.6;">
        Мы рады приветствовать вас в числе участников Арктической олимпиады «Полярный круг» 2026! 
        Хотим напомнить вам важную информацию о вашей регистрации.
      </p>

      <!-- Блок с номером участника -->
      <div style="background: linear-gradient(135deg, #e6f3ff 0%, #f0f7ff 100%); border-left: 4px solid #0066cc; border-radius: 12px; padding: 24px; margin: 30px 0;">
        <div style="display: flex; align-items: center; margin-bottom: 16px;">
          <div style="font-size: 32px; margin-right: 12px;">🎫</div>
          <div>
            <p style="margin: 0; color: #666; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">
              Ваш номер регистрации
            </p>
            <p style="margin: 4px 0 0; color: #0066cc; font-size: 28px; font-weight: 700; letter-spacing: 1px;">
              ${userData.participantId}
            </p>
          </div>
        </div>
        <p style="margin: 0; padding: 12px; background: white; border-radius: 8px; color: #4a5568; font-size: 14px; line-height: 1.5;">
          <strong style="color: #1a1a1a;">⚠️ Важно:</strong> Сохраните этот номер! 
          Он потребуется для участия в олимпиаде, получения результатов и обращения в службу поддержки.
        </p>
      </div>

      <!-- Разделитель -->
      <div style="height: 1px; background: linear-gradient(90deg, transparent, #e2e8f0, transparent); margin: 30px 0;"></div>

      <!-- Информация о Telegram боте -->
      <div style="background: #f7fafc; border-radius: 12px; padding: 24px; margin: 30px 0;">
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="font-size: 56px; margin-bottom: 12px;">🤖</div>
          <h3 style="margin: 0 0 8px; color: #1a1a1a; font-size: 20px; font-weight: 600;">
            Наш Telegram бот
          </h3>
          <p style="margin: 0; color: #666; font-size: 14px;">
            Удобный способ проверить свой номер и получить информацию
          </p>
        </div>

        <div style="background: white; border: 2px solid #e2e8f0; border-radius: 10px; padding: 20px; text-align: center;">
          <p style="margin: 0 0 16px; color: #4a5568; font-size: 15px;">
            Перейдите в наш официальный Telegram бот:
          </p>
          <a href="https://t.me/ArctolympBot" 
             style="display: inline-block; background: linear-gradient(135deg, #0088cc 0%, #00aaff 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(0, 136, 204, 0.3); transition: transform 0.2s;">
            <span style="margin-right: 8px;">📱</span>
            @ArctolympBot
          </a>
          <p style="margin: 16px 0 0; color: #718096; font-size: 13px; line-height: 1.5;">
            В боте вы сможете:
          </p>
          <ul style="margin: 12px 0 0; padding: 0; list-style: none; text-align: left; color: #4a5568; font-size: 14px;">
            <li style="padding: 6px 0; padding-left: 24px; position: relative;">
              <span style="position: absolute; left: 0;">✓</span>
              Проверить свой номер регистрации
            </li>
            <li style="padding: 6px 0; padding-left: 24px; position: relative;">
              <span style="position: absolute; left: 0;">✓</span>
              Получить актуальную информацию об олимпиаде
            </li>
            <li style="padding: 6px 0; padding-left: 24px; position: relative;">
              <span style="position: absolute; left: 0;">✓</span>
              Задать вопросы организаторам
            </li>
          </ul>
        </div>
      </div>

      <!-- Дополнительная информация -->
      <div style="background: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 16px; margin: 24px 0;">
        <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
          <strong style="display: block; margin-bottom: 8px; font-size: 15px;">💡 Полезный совет:</strong>
          Добавьте наш Telegram бот в избранное, чтобы всегда иметь быстрый доступ к своему номеру участника и актуальной информации об олимпиаде.
        </p>
      </div>

      <!-- Заключение -->
      <p style="margin: 30px 0 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
        Желаем вам успехов на олимпиаде! Мы верим в ваши способности и ждем ваших выдающихся результатов! 🌟
      </p>

      <p style="margin: 20px 0 0; color: #718096; font-size: 14px;">
        С уважением,<br>
        <strong style="color: #4a5568;">Команда Арктической олимпиады «Полярный круг»</strong>
      </p>
    </div>

    <!-- Подвал -->
    <div style="background: #f7fafc; padding: 24px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
      <p style="margin: 0 0 8px; color: #718096; font-size: 13px;">
        © ${new Date().getFullYear()} Арктическая олимпиада «Полярный круг»
      </p>
      <p style="margin: 0; color: #a0aec0; font-size: 12px;">
        Это автоматическое письмо. Пожалуйста, не отвечайте на него.
      </p>
      <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
        <p style="margin: 0; color: #a0aec0; font-size: 11px;">
          Если у вас есть вопросы, свяжитесь с нами через Telegram бот или напишите на официальный email
        </p>
      </div>
    </div>

  </div>
</body>
</html>
  `;
}

// Функция для отправки тестового email
async function sendTestEmail(userData) {
  console.log('\n📧 === ПОДГОТОВКА К ОТПРАВКЕ ТЕСТОВОГО EMAIL ===\n');
  
  // Проверяем наличие необходимых переменных окружения
  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    throw new Error('❌ ОШИБКА: Не заданы SMTP_USER или SMTP_PASSWORD в .env файле');
  }

  console.log('✓ SMTP настройки найдены');
  console.log(`✓ Отправитель: ${process.env.SMTP_FROM || process.env.SMTP_USER}`);
  console.log(`✓ Получатель (ТЕСТ): ${TEST_EMAIL}`);
  console.log(`✓ Имя участника: ${userData.firstName}`);
  console.log(`✓ Номер участника: ${userData.participantId}\n`);

  // Создаем транспорт
  const transportConfig = {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    debug: false,
    logger: false,
  };

  const transporter = nodemailer.createTransport(transportConfig);

  // Проверяем соединение
  try {
    console.log('🔄 Проверка SMTP соединения...');
    await transporter.verify();
    console.log('✅ SMTP соединение успешно установлено!\n');
  } catch (error) {
    console.error('❌ Ошибка подключения к SMTP серверу:', error.message);
    throw error;
  }

  // Формируем письмо
  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: TEST_EMAIL,
    subject: '❄️ Напоминание о вашей регистрации - Арктическая олимпиада',
    html: createEmailTemplate(userData),
  };

  // Отправляем
  try {
    console.log('📤 Отправка тестового письма...');
    const info = await transporter.sendMail(mailOptions);
    console.log('\n✅ === ТЕСТОВОЕ ПИСЬМО УСПЕШНО ОТПРАВЛЕНО! ===\n');
    console.log(`📬 Message ID: ${info.messageId}`);
    console.log(`📧 Отправлено на: ${TEST_EMAIL}`);
    console.log(`👤 Данные участника: ${userData.firstName} (${userData.participantId})`);
    console.log('\n💡 Проверьте почту ' + TEST_EMAIL + ' для просмотра письма\n');
    return info;
  } catch (error) {
    console.error('\n❌ === ОШИБКА ПРИ ОТПРАВКЕ ПИСЬМА ===\n');
    console.error('Детали ошибки:', error.message);
    throw error;
  }
}

// Главная функция
async function main() {
  console.log('\n' + '='.repeat(60));
  console.log('🧪 ТЕСТОВАЯ РАССЫЛКА EMAIL');
  console.log('='.repeat(60) + '\n');
  
  try {
    // Получаем первую запись из Firebase для теста
    console.log('🔍 Получение тестовых данных из Firebase...');
    const registrationsRef = collection(db, 'registrations');
    const q = query(registrationsRef, limit(1));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.error('❌ ОШИБКА: В коллекции registrations нет записей!');
      console.log('\n💡 Совет: Убедитесь, что в Firebase есть зарегистрированные участники\n');
      process.exit(1);
    }

    const firstDoc = snapshot.docs[0];
    const userData = firstDoc.data();
    
    console.log('✅ Данные участника получены из Firebase:');
    console.log(`   - Имя: ${userData.firstName} ${userData.lastName}`);
    console.log(`   - Email (оригинальный): ${userData.email}`);
    console.log(`   - Номер участника: ${userData.participantId || 'НЕ НАЗНАЧЕН'}`);
    
    if (!userData.participantId) {
      console.warn('\n⚠️  ВНИМАНИЕ: У этого участника нет participantId!');
      console.log('   Для теста будет использован примерный номер: APO-2026-00001\n');
      userData.participantId = 'APO-2026-00001';
    }

    // Отправляем тестовое письмо
    await sendTestEmail(userData);

    console.log('\n' + '='.repeat(60));
    console.log('✅ ТЕСТ ЗАВЕРШЕН УСПЕШНО');
    console.log('='.repeat(60));
    console.log('\n📋 ЧТО ДАЛЬШЕ:');
    console.log('   1. Проверьте письмо на ' + TEST_EMAIL);
    console.log('   2. Убедитесь, что оформление выглядит правильно');
    console.log('   3. Проверьте ссылку на Telegram бот');
    console.log('   4. Если все хорошо - запустите массовую рассылку:');
    console.log('      npm run send-mass-email\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ === КРИТИЧЕСКАЯ ОШИБКА ===\n');
    console.error(error);
    console.log('\n💡 Проверьте:');
    console.log('   1. Настройки SMTP в .env файле');
    console.log('   2. Подключение к Firebase');
    console.log('   3. Наличие записей в коллекции registrations\n');
    process.exit(1);
  }
}

// Запускаем скрипт
main();
