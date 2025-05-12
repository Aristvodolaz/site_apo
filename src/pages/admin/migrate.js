import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/admin/AdminLayout';
import { migrateAllData } from '../../scripts/migrateToFirebase';

// Импортируем все данные
import { contactsData } from '../../data/contactsData';
import { historyData } from '../../data/historyData';
import { documentsData } from '../../data/documentsData';
import { subjectsData } from '../../data/subjectsData';
import { regionsData } from '../../data/regionsData';
import { newsData } from '../../data/newsData';

export default function MigratePage() {
  const router = useRouter();
  const [migrating, setMigrating] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [logs, setLogs] = useState([]);

  // Обработчик миграции данных
  const handleMigrate = async () => {
    if (migrating) return;
    
    setMigrating(true);
    setStatus('Начинаем миграцию данных...');
    setError('');
    setLogs([]);
    
    try {
      // Выполняем миграцию
      await migrateAllData();
      setStatus('Миграция успешно завершена!');
    } catch (err) {
      console.error('Ошибка при миграции данных:', err);
      setError(err.message || 'Произошла ошибка при миграции данных');
    } finally {
      setMigrating(false);
    }
  };

  return (
    <AdminLayout>
      <Head>
        <title>Миграция данных | Админ-панель</title>
      </Head>
      
      <div className="mb-4">
        <h1>Миграция данных в Firebase</h1>
        <p className="text-muted">
          Эта страница позволяет перенести все данные из файлов в базу данных Firebase Firestore.
        </p>
      </div>
      
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Инструкция</h5>
          <p>
            Перед началом миграции убедитесь, что:
          </p>
          <ol>
            <li>Firebase правильно настроен в файле .env.local</li>
            <li>У вас есть права на запись в Firestore</li>
            <li>Вы сделали резервную копию данных (если они уже есть в Firebase)</li>
          </ol>
          
          <div className="alert alert-warning">
            <strong>Внимание!</strong> Миграция может перезаписать существующие данные в Firestore. 
            Рекомендуется выполнять миграцию только один раз.
          </div>
          
          <button 
            className="btn btn-primary"
            onClick={handleMigrate}
            disabled={migrating}
          >
            {migrating ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Выполняется миграция...
              </>
            ) : 'Начать миграцию'}
          </button>
        </div>
      </div>
      
      {status && (
        <div className="alert alert-info mb-4">
          {status}
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger mb-4">
          {error}
        </div>
      )}
      
      <div className="d-flex gap-2">
        <button
          className="btn btn-outline-secondary"
          onClick={() => router.push('/admin/dashboard')}
          disabled={migrating}
        >
          Вернуться на главную
        </button>
      </div>
    </AdminLayout>
  );
} 