import nodemailer from 'nodemailer';

// Создаем транспорт для отправки email
const createTransporter = () => {
  console.log('=== Creating Email Transporter ===');
  
  // Используем сервис Gmail напрямую
const transportConfig = {
  host: process.env.SMTP_HOST,                // smtp.yandex.ru
  port: Number(process.env.SMTP_PORT),        // 465
  secure: process.env.SMTP_SECURE === "true", // true
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  debug: true,
  logger: true,
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
};


  console.log('Transport configuration:', {
    ...transportConfig,
    auth: {
      user: transportConfig.auth.user,
      pass: '[HIDDEN]'
    }
  });

  const transporter = nodemailer.createTransport(transportConfig);

  return transporter;
};

const emailService = {
  /**
   * Отправка email о успешной регистрации
   * @param {string} to - Email получателя
   * @param {object} userData - Данные пользователя
   * @returns {Promise<void>}
   */
  sendRegistrationConfirmation: async (to, userData) => {
    try {
      console.log('Attempting to send registration confirmation email to:', to);
      
      // Создаем новый транспорт для каждой отправки
      const transporter = createTransporter();
      
      // Проверяем соединение перед отправкой
      try {
        console.log('Verifying SMTP connection...');
        const verifyResult = await transporter.verify();
        console.log('SMTP connection verified successfully:', verifyResult);
        
        // Проверяем настройки
        console.log('Current email configuration:', {
          service: 'gmail',
          user: process.env.SMTP_USER,
          hasPassword: !!process.env.SMTP_PASSWORD,
        });
      } catch (verifyError) {
        console.error('SMTP connection verification failed:', {
          name: verifyError.name,
          message: verifyError.message,
          code: verifyError.code,
          command: verifyError.command,
          response: verifyError.response,
        });
        throw verifyError;
      }

      const mailOptions = {
        from: process.env.SMTP_FROM,
        to,
        subject: '❄️ Успешная регистрация',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(180deg, #e6f2ff, #ffffff); border-radius: 12px; overflow: hidden; box-shadow: 0 6px 16px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(135deg, #005f99, #66ccff); padding: 24px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">❄ Добро пожаловать! ❄</h1>
          </div>
          <div style="padding: 24px; color: #00334d;">
            <h2 style="margin-top: 0; font-size: 22px;">Здравствуйте, ${userData.firstName}!</h2>
            <p style="font-size: 16px; line-height: 1.6;">
              Поздравляем! Вы успешно зарегистрировались на нашем сайте.
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
                 <li>Выбранные предметы: ${userData.subjects.map(subject => {
                   const names = {
                     math: 'Математика',
                     biology: 'Биология',
                     physics: 'Физика',
                     chemistry: 'Химия'
                   };
                   return names[subject];
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
            © ${new Date().getFullYear()} Наш сайт • Все права защищены
          </div>
        </div>
        `,
      };
      

      await transporter.sendMail(mailOptions);
      console.log('Registration confirmation email sent successfully');
    } catch (error) {
      console.error('Error sending registration confirmation email:', error);
      throw error;
    }
  },
};

export default emailService;
