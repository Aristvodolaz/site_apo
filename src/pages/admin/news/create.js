import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/admin/AdminLayout';

export default function CreateNews() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    summary: '',
    content: '',
    link: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // В реальном приложении здесь будет запрос к API для сохранения новости
      console.log('Отправка данных:', formData);
      
      // Имитация задержки запроса
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Успешное создание
      alert('Новость успешно создана!');
      router.push('/admin/news');
    } catch (err) {
      console.error('Ошибка при создании новости:', err);
      setError('Произошла ошибка при создании новости');
    } finally {
      setSubmitting(false);
    }
  };

  // Генерируем URL-slug из заголовка
  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-zа-яё0-9\s]/gi, '')
      .replace(/\s+/g, '-');
    
    setFormData(prev => ({ 
      ...prev, 
      link: `/news/${slug}` 
    }));
  };

  return (
    <AdminLayout>
      <Head>
        <title>Создание новости | Админ-панель</title>
      </Head>

      <div className="mb-4">
        <h1>Создание новости</h1>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Заголовок</label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="date" className="form-label">Дата публикации</label>
          <input
            type="date"
            className="form-control"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="summary" className="form-label">Краткое описание</label>
          <textarea
            className="form-control"
            id="summary"
            name="summary"
            rows="2"
            value={formData.summary}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="content" className="form-label">Содержание</label>
          <textarea
            className="form-control"
            id="content"
            name="content"
            rows="10"
            value={formData.content}
            onChange={handleChange}
            required
          />
          <div className="form-text">
            Поддерживается HTML-разметка для форматирования текста.
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="link" className="form-label">URL новости</label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              id="link"
              name="link"
              value={formData.link}
              onChange={handleChange}
              required
            />
            <button 
              type="button" 
              className="btn btn-outline-secondary"
              onClick={generateSlug}
            >
              Сгенерировать из заголовка
            </button>
          </div>
          <div className="form-text">
            Должен начинаться с "/news/" и содержать только латинские буквы, цифры и дефисы.
          </div>
        </div>

        <div className="d-flex gap-2">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Сохранение...
              </>
            ) : 'Создать новость'}
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => router.push('/admin/news')}
            disabled={submitting}
          >
            Отмена
          </button>
        </div>
      </form>
    </AdminLayout>
  );
} 