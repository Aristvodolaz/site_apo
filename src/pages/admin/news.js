import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, getDocs, doc, deleteDoc, addDoc, updateDoc, orderBy, Timestamp } from 'firebase/firestore';
import Layout from '../../components/Layout';
import AdminProtected from '../../components/AdminProtected';
import Link from 'next/link';
import RichTextEditor from '../../components/RichTextEditor';
import 'react-quill/dist/quill.snow.css';

// Глобальная переменная для Bootstrap
let bootstrap;

export default function NewsManagement() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNews, setEditingNews] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    isPublished: true,
    isImportant: false
  });

  // Инициализация Bootstrap
  useEffect(() => {
    // Импортируем Bootstrap только на клиенте
    if (typeof window !== 'undefined') {
      import('bootstrap/dist/js/bootstrap.bundle.min.js').then(module => {
        bootstrap = module.default;
      });
    }
  }, []);

  // Загрузка новостей
  const loadNews = async () => {
    try {
      setLoading(true);
      const newsRef = collection(db, 'news');
      const q = query(newsRef, orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const newsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        // Преобразуем Timestamp в строку даты
        const date = data.date instanceof Timestamp 
          ? data.date.toDate().toISOString().split('T')[0]
          : String(data.date || new Date().toISOString().split('T')[0]);
          
        return {
          id: doc.id,
          title: String(data.title || ''),
          content: String(data.content || ''),
          date,
          isPublished: Boolean(data.isPublished),
          isImportant: Boolean(data.isImportant),
          createdAt: data.createdAt || null,
          updatedAt: data.updatedAt || null
        };
      });
      
      setNews(newsData);
    } catch (error) {
      console.error('Ошибка загрузки новостей:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  // Обработчики формы
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditorChange = (content) => {
    setFormData(prev => ({
      ...prev,
      content: content || ''
    }));
  };

  // Создание/редактирование новости
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Проверяем и форматируем данные перед сохранением
      const newsData = {
        title: String(formData.title || '').trim(),
        content: String(formData.content || ''),
        date: formData.date || new Date().toISOString().split('T')[0],
        isPublished: Boolean(formData.isPublished),
        isImportant: Boolean(formData.isImportant),
        updatedAt: new Date().toISOString()
      };

      if (!newsData.title) {
        throw new Error('Заголовок новости не может быть пустым');
      }

      if (editingNews) {
        // Обновление существующей новости
        const newsRef = doc(db, 'news', editingNews.id);
        await updateDoc(newsRef, newsData);
        console.log('Новость обновлена:', newsData);
      } else {
        // Создание новой новости
        newsData.createdAt = new Date().toISOString();
        const docRef = await addDoc(collection(db, 'news'), newsData);
        console.log('Новость создана:', docRef.id);
      }
      
      // Очищаем форму и обновляем список
      setFormData({
        title: '',
        content: '',
        date: new Date().toISOString().split('T')[0],
        isPublished: true,
        isImportant: false
      });
      setEditingNews(null);
      
      // Закрываем модальное окно
      if (bootstrap) {
        const modal = document.getElementById('newsModal');
        const bootstrapModal = bootstrap.Modal.getInstance(modal);
        if (bootstrapModal) {
          bootstrapModal.hide();
        }
      }

      // Обновляем список новостей
      await loadNews();
      
    } catch (error) {
      console.error('Ошибка сохранения новости:', error);
      alert('Произошла ошибка при сохранении новости: ' + error.message);
    }
  };

  // Удаление новости
  const handleDelete = async (newsId) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту новость?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'news', newsId));
      await loadNews();
    } catch (error) {
      console.error('Ошибка удаления новости:', error);
      alert('Произошла ошибка при удалении новости: ' + error.message);
    }
  };

  // Открытие формы редактирования
  const handleEdit = (newsItem) => {
    if (!newsItem) return;

    setEditingNews(newsItem);
    setFormData({
      title: String(newsItem.title || ''),
      content: String(newsItem.content || ''),
      date: newsItem.date || new Date().toISOString().split('T')[0],
      isPublished: Boolean(newsItem.isPublished),
      isImportant: Boolean(newsItem.isImportant)
    });
    
    if (bootstrap) {
      const modal = document.getElementById('newsModal');
      const bootstrapModal = new bootstrap.Modal(modal);
      bootstrapModal.show();
    }
  };

  // Открытие формы создания
  const handleCreate = () => {
    setEditingNews(null);
    setFormData({
      title: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
      isPublished: true,
      isImportant: false
    });
    
    if (bootstrap) {
      const modal = document.getElementById('newsModal');
      const bootstrapModal = new bootstrap.Modal(modal);
      bootstrapModal.show();
    }
  };

  return (
    <AdminProtected>
      <Layout title="Управление новостями">
        <div className="container-fluid px-4 px-lg-5 py-5">
          <div className="container-xxl">
            {/* Хлебные крошки */}
            <nav aria-label="breadcrumb" className="mb-4 ps-2">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link href="/admin" className="text-decoration-none">
                    <i className="bi bi-house-door me-1"></i>
                    Админ-панель
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Новости
                </li>
              </ol>
            </nav>

            {/* Основной контент */}
            <div className="card shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h1 className="h3 mb-0">Управление новостями</h1>
                  <button
                    className="btn btn-primary"
                    onClick={handleCreate}
                  >
                    <i className="bi bi-plus-lg me-2"></i>
                    Создать новость
                  </button>
                </div>

                {/* Таблица новостей */}
                <div className="table-responsive">
                  <table className="table table-striped table-hover align-middle">
                    <thead>
                      <tr>
                        <th style={{ width: '40%' }}>Заголовок</th>
                        <th style={{ width: '15%' }}>Дата</th>
                        <th style={{ width: '15%' }}>Статус</th>
                        <th style={{ width: '15%' }}>Важность</th>
                        <th style={{ width: '15%' }}>Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="5" className="text-center py-4">
                            <div className="spinner-border text-primary" role="status">
                              <span className="visually-hidden">Загрузка...</span>
                            </div>
                          </td>
                        </tr>
                      ) : news.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center py-4">
                            Новости не найдены
                          </td>
                        </tr>
                      ) : (
                        news.map((item) => (
                          <tr key={item.id}>
                            <td>{item.title}</td>
                            <td>{new Date(item.date).toLocaleDateString('ru-RU')}</td>
                            <td>
                              <span className={`badge bg-${item.isPublished ? 'success' : 'secondary'}`}>
                                {item.isPublished ? 'Опубликовано' : 'Черновик'}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${item.isImportant ? 'bg-warning' : 'bg-light text-dark'}`}>
                                {item.isImportant ? 'Важное' : 'Обычное'}
                              </span>
                            </td>
                            <td>
                              <div className="btn-group btn-group-sm">
                                <button
                                  className="btn btn-outline-primary"
                                  onClick={() => handleEdit(item)}
                                  title="Редактировать"
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                  className="btn btn-outline-danger"
                                  onClick={() => handleDelete(item.id)}
                                  title="Удалить"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Модальное окно создания/редактирования */}
        <div
          className="modal fade"
          id="newsModal"
          tabIndex="-1"
          aria-labelledby="newsModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header py-3 px-4">
                <h5 className="modal-title" id="newsModalLabel">
                  {editingNews ? 'Редактирование новости' : 'Создание новости'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label">Заголовок</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Дата публикации</label>
                    <input
                      type="date"
                      className="form-control"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Содержание</label>
                    <RichTextEditor
                      value={formData.content}
                      onChange={handleEditorChange}
                    />
                  </div>
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        name="isPublished"
                        checked={formData.isPublished}
                        onChange={handleInputChange}
                        id="isPublished"
                      />
                      <label className="form-check-label" htmlFor="isPublished">
                        Опубликовать
                      </label>
                    </div>
                    <div className="form-check mt-2">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        name="isImportant"
                        checked={formData.isImportant}
                        onChange={handleInputChange}
                        id="isImportant"
                      />
                      <label className="form-check-label" htmlFor="isImportant">
                        <i className="bi bi-exclamation-triangle-fill text-warning me-2"></i>
                        Пометить как важную новость
                      </label>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    {editingNews ? 'Сохранить' : 'Создать'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Layout>
    </AdminProtected>
  );
} 