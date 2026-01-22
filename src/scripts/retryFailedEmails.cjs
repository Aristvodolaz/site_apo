// Скрипт для повторной отправки писем, которые не были доставлены
// Используется после массовой рассылки для отправки писем, которые получили ошибку "Too many messages"
// Запуск: node src/scripts/retryFailedEmails.cjs

require('dotenv').config();

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where } = require('firebase/firestore');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

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

// Увеличенная задержка между отправками (мс) - чтобы не превысить лимиты SMTP
const DELAY_BETWEEN_EMAILS = 5000; // 5 секунд - больше, чем в основной рассылке

// Функция для создания красивого HTML письма (та же, что в sendMassEmail.cjs)
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

// Функция для задержки
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Функция для запроса подтверждения от пользователя
function askForConfirmation(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'да');
    });
  });
}

// Функция для отправки одного email
async function sendSingleEmail(transporter, userData) {
  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: userData.email,
    subject: '❄️ Напоминание о вашей регистрации - Арктическая олимпиада',
    html: createEmailTemplate(userData),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, email: userData.email, messageId: info.messageId };
  } catch (error) {
    return { success: false, email: userData.email, error: error.message };
  }
}

// Главная функция
async function main() {
  console.log('\n' + '='.repeat(70));
  console.log('🔄 ПОВТОРНАЯ ОТПРАВКА НЕДОСТАВЛЕННЫХ ПИСЕМ');
  console.log('='.repeat(70) + '\n');

  try {
    // Проверяем переменные окружения
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      throw new Error('❌ ОШИБКА: Не заданы SMTP_USER или SMTP_PASSWORD в .env файле');
    }

    // Получаем стартовый индекс из аргументов командной строки
    // Использование: node retryFailedEmails.cjs 500
    const startIndex = process.argv[2] ? parseInt(process.argv[2], 10) : 0;
    
    if (isNaN(startIndex) || startIndex < 0) {
      console.error('❌ ОШИБКА: Неверный стартовый индекс. Используйте число >= 0');
      console.log('Пример: node retryFailedEmails.cjs 500');
      process.exit(1);
    }

    console.log('✓ SMTP настройки найдены');
    console.log(`✓ Отправитель: ${process.env.SMTP_FROM || process.env.SMTP_USER}`);
    console.log(`✓ Задержка между письмами: ${DELAY_BETWEEN_EMAILS / 1000} секунд`);
    if (startIndex > 0) {
      console.log(`✓ Стартовый индекс: ${startIndex} (рассылка начнется с ${startIndex + 1}-й записи)\n`);
    } else {
      console.log(`✓ Стартовый индекс: 0 (рассылка начнется с начала)\n`);
    }

    // Получаем всех участников из Firebase
    console.log('🔍 Загрузка списка участников из Firebase...');
    const registrationsRef = collection(db, 'registrations');
    const snapshot = await getDocs(registrationsRef);

    if (snapshot.empty) {
      console.error('❌ ОШИБКА: В коллекции registrations нет записей!');
      process.exit(1);
    }

    // Фильтруем участников с email и participantId
    const allParticipants = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.email && data.participantId) {
        allParticipants.push({
          id: doc.id,
          email: data.email.toLowerCase().trim(),
          firstName: data.firstName || 'Участник',
          lastName: data.lastName || '',
          participantId: data.participantId
        });
      }
    });

    console.log(`📊 Всего участников в базе: ${allParticipants.length}`);
    
    // Проверяем, что стартовый индекс не превышает количество участников
    if (startIndex >= allParticipants.length) {
      console.error(`\n❌ ОШИБКА: Стартовый индекс ${startIndex} превышает количество участников (${allParticipants.length})`);
      process.exit(1);
    }

    // Берем только участников начиная с указанного индекса
    const participantsToSend = allParticipants.slice(startIndex);
    
    console.log(`📊 Участников к отправке: ${participantsToSend.length} (начиная с ${startIndex + 1}-й записи)\n`);

    // Создаем транспорт
    console.log('🔄 Настройка SMTP соединения...');
    const transportConfig = {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    };

    const transporter = nodemailer.createTransport(transportConfig);

    // Проверяем соединение
    try {
      await transporter.verify();
      console.log('✅ SMTP соединение успешно установлено!\n');
    } catch (error) {
      console.error('❌ Ошибка подключения к SMTP серверу:', error.message);
      throw error;
    }

    // Показываем информацию о повторной отправке
    console.log('📋 ИНФОРМАЦИЯ:');
    console.log('   Этот скрипт отправит письма ВСЕМ участникам из базы данных.');
    console.log('   Если письмо уже было отправлено ранее, получатель получит дубликат.');
    console.log('   Используется увеличенная задержка между отправками для избежания лимитов.\n');

    // Показываем первые 5 получателей
    console.log('📋 ПЕРВЫЕ ПОЛУЧАТЕЛИ:');
    participantsToSend.slice(0, 5).forEach((p, index) => {
      const actualIndex = startIndex + index + 1;
      console.log(`   ${actualIndex}. ${p.firstName} ${p.lastName} - ${p.email} (${p.participantId})`);
    });
    if (participantsToSend.length > 5) {
      console.log(`   ... и еще ${participantsToSend.length - 5} участников`);
    }

    // Запрашиваем подтверждение
    console.log('\n' + '='.repeat(70));
    console.log(`⚠️  ВНИМАНИЕ! Вы собираетесь отправить письма на ${participantsToSend.length} адресов`);
    if (startIndex > 0) {
      console.log(`   (начиная с ${startIndex + 1}-й записи из ${allParticipants.length})`);
    }
    console.log('='.repeat(70));
    
    const confirmed = await askForConfirmation('\n❓ Продолжить? (yes/no): ');
    
    if (!confirmed) {
      console.log('\n❌ Рассылка отменена пользователем.\n');
      process.exit(0);
    }

    // Начинаем рассылку
    console.log('\n📤 НАЧАЛО ПОВТОРНОЙ РАССЫЛКИ...\n');
    console.log(`⏱️  Примерное время выполнения: ~${Math.ceil((participantsToSend.length * DELAY_BETWEEN_EMAILS) / 1000 / 60)} минут\n`);
    
    const results = {
      success: [],
      failed: []
    };

    const startTime = Date.now();

    for (let i = 0; i < participantsToSend.length; i++) {
      const participant = participantsToSend[i];
      const actualIndex = startIndex + i + 1; // Реальный номер в базе (начиная с 1)
      const progress = ((i + 1) / participantsToSend.length * 100).toFixed(1);
      
      console.log(`[${actualIndex}/${allParticipants.length}] (${progress}%) Отправка: ${participant.email}...`);
      
      const result = await sendSingleEmail(transporter, participant);
      
      if (result.success) {
        console.log(`   ✅ Отправлено успешно`);
        results.success.push({
          email: participant.email,
          name: `${participant.firstName} ${participant.lastName}`,
          participantId: participant.participantId
        });
      } else {
        console.log(`   ❌ Ошибка: ${result.error}`);
        results.failed.push({
          email: participant.email,
          error: result.error
        });
      }

      // Задержка перед следующей отправкой (кроме последней)
      if (i < participantsToSend.length - 1) {
        await delay(DELAY_BETWEEN_EMAILS);
      }
    }

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000 / 60).toFixed(2);

    // Итоговый отчет
    console.log('\n' + '='.repeat(70));
    console.log('📊 ИТОГОВЫЙ ОТЧЕТ');
    console.log('='.repeat(70));
    console.log(`\n✅ Успешно отправлено: ${results.success.length} писем`);
    console.log(`❌ Ошибки отправки: ${results.failed.length} писем`);
    console.log(`⏱️  Время выполнения: ${duration} минут\n`);

    if (results.success.length > 0) {
      console.log('✅ УСПЕШНО ОТПРАВЛЕНО (первые 10):');
      results.success.slice(0, 10).forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.email} - ${item.name} (${item.participantId})`);
      });
      if (results.success.length > 10) {
        console.log(`   ... и еще ${results.success.length - 10} писем`);
      }
    }

    if (results.failed.length > 0) {
      console.log('\n❌ ОШИБКИ (первые 10):');
      results.failed.slice(0, 10).forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.email}: ${item.error}`);
      });
      if (results.failed.length > 10) {
        console.log(`   ... и еще ${results.failed.length - 10} ошибок`);
      }
    }

    // Сохраняем отчет в файл
    const reportPath = path.join(__dirname, '..', '..', 'retry-email-report.json');
    const report = {
      timestamp: new Date().toISOString(),
      startIndex: startIndex,
      totalInDatabase: allParticipants.length,
      totalSent: participantsToSend.length,
      success: results.success.length,
      failed: results.failed.length,
      duration: `${duration} минут`,
      successList: results.success,
      failedList: results.failed
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
    console.log(`\n📄 Детальный отчет сохранен в: ${reportPath}`);

    console.log('\n' + '='.repeat(70));
    console.log('✅ ПОВТОРНАЯ РАССЫЛКА ЗАВЕРШЕНА');
    console.log('='.repeat(70) + '\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ === КРИТИЧЕСКАЯ ОШИБКА ===\n');
    console.error(error);
    process.exit(1);
  }
}

// Запускаем скрипт
main();
