import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminLayout from '../../../../components/admin/AdminLayout';
import RichTextEditor from '../../../../components/RichTextEditor';

export default function EditNews() {
  const router = useRouter();
  const { id } = router.query;
  
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    summary: '',
    content: '',
    link: '',
    imageUrl: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Загружаем данные новости при загрузке страницы
  useEffect(() => {
    if (!id) return;

    const fetchNews = async () => {
      try {
        const response = await fetch(`/api/admin/news/${id}`);
        if (!response.ok) {
          throw new Error('Не удалось загрузить новость');
        }
        const data = await response.json();
        setFormData({
          title: data.title || '',
          date: data.date || '',
          summary: data.summary || '',
          content: data.content || '',
          link: data.link || '',
          imageUrl: data.imageUrl || ''
        });
      } catch (err) {
        console.error('Ошибка при загрузке новости:', err);
        setError('Новость не найдена или произошла ошибка');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (content) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    setError('');

    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadData,
      });

      if (!response.ok) {
        throw new Error('Ошибка загрузки изображения');
      }

      const data = await response.json();
      setFormData(prev => ({ ...prev, imageUrl: data.url }));
    } catch (err) {
      console.error('Ошибка при загрузке изображения:', err);
      setError('Не удалось загрузить изображение');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/news/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Ошибка при обновлении новости');
      }
      
      alert('Новость успешно обновлена!');
      router.push('/admin/news');
    } catch (err) {
      console.error('Ошибка при обновлении новости:', err);
      setError('Произошла ошибка при обновлении новости');
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
        <title>Редактирование новости | Админ-панель</title>
      </Head>

      <div className="mb-4">
        <h1>Редактирование новости</h1>
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
          <label className="form-label">Обложка новости (главное фото)</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploadingImage}
          />
          {uploadingImage && <div className="form-text">Загрузка изображения...</div>}
          {formData.imageUrl && (
            <div className="mt-2">
              <img src={formData.imageUrl} alt="Обложка" style={{ maxHeight: '200px', borderRadius: '8px' }} />
            </div>
          )}
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
          <label className="form-label">Содержание</label>
          <RichTextEditor
            value={formData.content}
            onChange={handleContentChange}
          />
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
            disabled={submitting || uploadingImage}
          >
            {submitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Сохранение...
              </>
            ) : 'Сохранить изменения'}
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
