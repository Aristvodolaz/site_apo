import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminLayout from '../../../../components/admin/AdminLayout';
import SimplifiedJsonEditor from '../../../../components/admin/SimplifiedJsonEditor';

// Карта маршрутов для предпросмотра страниц
const routeMap = {
  contacts: '/contacts',
  history: '/about/history',
  documents: '/documents',
  subjects: '/subjects/math', // Показываем пример математики
  regions: ''
};

// Карта заголовков страниц
const titleMap = {
  contacts: 'Контакты',
  history: 'История олимпиады',
  documents: 'Документы',
  subjects: 'Предметы',
  regions: 'Регионы'
};

// Карта имен файлов данных
const fileMap = {
  contacts: 'contactsData.js',
  history: 'historyData.js',
  documents: 'documentsData.js',
  subjects: 'subjectsData.js',
  regions: 'regionsData.js'
};

export default function EditContent() {
  const router = useRouter();
  const { id } = router.query;
  
  const [content, setContent] = useState(null);
  const [jsonData, setJsonData] = useState('{}');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Загружаем данные страницы
  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    
    fetch(`/api/admin/content/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Ошибка загрузки данных');
        }
        return response.json();
      })
      .then(data => {
        setContent({
          id,
          title: titleMap[id] || id,
          route: routeMap[id] || '',
          file: fileMap[id] || ''
        });
        setJsonData(JSON.stringify(data, null, 2));
      })
      .catch(err => {
        console.error('Ошибка загрузки данных:', err);
        setError('Ошибка загрузки данных контента: ' + err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // Обработчик изменения JSON
  const handleJsonChange = (newJson) => {
    setJsonData(newJson);
  };

  // Обработчик сохранения данных
  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccessMessage('');
    
    try {
      // Проверяем валидность JSON
      const parsedData = JSON.parse(jsonData);
      
      // Отправляем данные на сервер
      const response = await fetch(`/api/admin/content/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(parsedData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при сохранении данных');
      }

      const result = await response.json();
      setSuccessMessage(result.message || 'Данные успешно сохранены');
    } catch (err) {
      console.error('Ошибка сохранения:', err);
      setError(err.message || 'Ошибка при сохранении данных');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Head>
        <title>
          {content ? `Редактирование: ${content.title}` : 'Редактирование контента'} | Админ-панель
        </title>
      </Head>

      <div className="mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h1>Редактирование контента</h1>
          {content && <h5 className="text-muted">{content.title}</h5>}
        </div>
        
        {content && content.route && (
          <a 
            href={content.route} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-outline-secondary"
          >
            Просмотр страницы
          </a>
        )}
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}

      {content && (
        <div className="card mb-4">
          <div className="card-header">
            <div className="d-flex justify-content-between align-items-center">
              <span>Файл данных: <code>{content.file}</code></span>
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Сохранение...
                  </>
                ) : 'Сохранить изменения'}
              </button>
            </div>
          </div>
          <div className="card-body">
            <div className="alert alert-info mb-3">
              <strong>Внимание!</strong> Редактирование данных требует знания формата JSON. 
              Неправильное форматирование может привести к ошибкам отображения страницы.
            </div>
            
            <div style={{ height: '500px' }}>
              <SimplifiedJsonEditor 
                value={jsonData} 
                onChange={handleJsonChange} 
              />
            </div>
          </div>
        </div>
      )}

      <div className="d-flex gap-2 mb-5">
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Сохранение...
            </>
          ) : 'Сохранить изменения'}
        </button>
        
        <button
          className="btn btn-outline-secondary"
          onClick={() => router.push('/admin/content')}
          disabled={saving}
        >
          Отмена
        </button>
      </div>
    </AdminLayout>
  );
} 