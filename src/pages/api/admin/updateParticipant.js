import { db } from '../../../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { verify } from 'jsonwebtoken';
import cookie from 'cookie';

const JWT_SECRET = 'your-secret-key';

// Проверка аутентификации
const isAuthenticated = (req) => {
  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    if (!cookies.auth) return false;
    
    const token = verify(cookies.auth, JWT_SECRET);
    return token.admin === true;
  } catch {
    return false;
  }
};

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Метод не разрешен' });
  }

  // Проверяем аутентификацию
  if (!isAuthenticated(req)) {
    return res.status(401).json({ message: 'Не авторизован' });
  }

  try {
    const { id, ...updateData } = req.body;

    // Проверяем наличие id
    if (!id) {
      return res.status(400).json({ message: 'ID участника не указан' });
    }

    // Удаляем поле createdAt из обновляемых данных, если оно есть
    delete updateData.createdAt;

    // Обновляем данные участника
    const participantRef = doc(db, 'registrations', id);
    await updateDoc(participantRef, updateData);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Ошибка при обновлении данных:', error);
    res.status(500).json({ message: 'Ошибка при обновлении данных участника' });
  }
} 