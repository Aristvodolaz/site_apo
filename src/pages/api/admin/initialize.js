import adminService from '../../../lib/adminService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Метод не разрешен' });
  }

  try {
    // Инициализируем дефолтного администратора
    const initialized = await adminService.initializeDefaultAdmin();
    
    return res.status(200).json({ 
      success: true,
      initialized
    });
  } catch (error) {
    console.error('Ошибка при инициализации администратора:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Произошла ошибка при инициализации'
    });
  }
} 