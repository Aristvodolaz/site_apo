import cookie from 'cookie';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Метод не разрешен' });
  }

  // Очищаем куки с токеном аутентификации
  res.setHeader(
    'Set-Cookie',
    cookie.serialize('auth', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      expires: new Date(0), // Устанавливаем дату истечения в прошлом для удаления куки
      sameSite: 'strict',
      path: '/'
    })
  );

  // Возвращаем успешный ответ
  res.status(200).json({ success: true });
} 