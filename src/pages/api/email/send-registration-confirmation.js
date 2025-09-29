import emailService from '../../../lib/emailService';

export default async function handler(req, res) {
  console.log('=== Email API Handler Started ===');
  
  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Проверяем наличие всех переменных окружения в начале
  const envStatus = {
    SMTP_USER: 'kap.moral22@gmail.com' || '[NOT SET]',
    SMTP_PASSWORD: 'zitx tdff uids bdne' ? '[SET]' : '[NOT SET]',
    SMTP_FROM: 'kap.moral22@gmail.com' || '[NOT SET]',
    SMTP_HOST: 'smtp.gmail.com' || '[NOT SET]',
    SMTP_PORT: '587' || '[NOT SET]',
    SMTP_SECURE: 'false' || '[NOT SET]',
  };

  console.log('Environment variables status:', envStatus);

  try {
    const { email, userData } = req.body;

    console.log('Received request to send confirmation email:', {
      email,
      userData: { ...userData, email: '***' } // Скрываем email в логах
    });

    if (!email || !userData) {
      console.error('Missing required fields:', { email: !!email, userData: !!userData });
      return res.status(400).json({
        success: false,
        message: 'Email and user data are required',
      });
    }

    // Проверяем наличие всех необходимых переменных окружения
    const requiredEnvVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASSWORD', 'SMTP_FROM'];
    const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingEnvVars.length > 0) {
      console.error('Missing required environment variables:', missingEnvVars);
      return res.status(500).json({
        success: false,
        message: 'Email service is not properly configured',
      });
    }

    await emailService.sendRegistrationConfirmation(email, userData);

    return res.status(200).json({
      success: true,
      message: 'Registration confirmation email sent successfully',
    });
  } catch (error) {
    console.error('Error in send-registration-confirmation:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send registration confirmation email',
    });
  }
}
