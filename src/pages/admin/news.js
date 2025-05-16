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
  const [filteredNews, setFilteredNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNews, setEditingNews] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    isPublished: true,
    isImportant: false
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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
      setFilteredNews(newsData);
    } catch (error) {
      console.error('Ошибка загрузки новостей:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  // Фильтрация новостей при изменении поискового запроса
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredNews(news);
    } else {
      const filtered = news.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredNews(filtered);
    }
    setCurrentPage(1); // Сбрасываем на первую страницу при поиске
  }, [searchTerm, news]);

  // Обработка изменения поискового запроса
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Получение текущей страницы новостей
  const getCurrentPageItems = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredNews.slice(indexOfFirstItem, indexOfLastItem);
  };

  // Изменение страницы
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Изменение количества элементов на странице
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Сбрасываем на первую страницу
  };

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

  // Расчет индекса записи для отображения нумерации
  const getItemIndex = (index) => {
    return (currentPage - 1) * itemsPerPage + index + 1;
  };

  // Получение общего количества страниц
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);

  // Генерация массива страниц для пагинации
  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    const pages = [];
    
    if (totalPages <= maxPagesToShow) {
      // Если страниц меньше или равно maxPagesToShow, показываем все
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Сложная логика для больших списков страниц
      let startPage = Math.max(currentPage - Math.floor(maxPagesToShow / 2), 1);
      let endPage = startPage + maxPagesToShow - 1;
      
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(endPage - maxPagesToShow + 1, 1);
      }
      
      // Добавляем первую страницу и многоточие
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('...');
        }
      }
      
      // Добавляем основные страницы
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Добавляем многоточие и последнюю страницу
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // Вычисление диапазона отображаемых элементов
  const getDisplayRange = () => {
    if (filteredNews.length === 0) return '0-0 из 0';
    
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, filteredNews.length);
    
    return `${start}-${end} из ${filteredNews.length}`;
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

                {/* Поиск и фильтры */}
                <div className="row mb-4">
                  <div className="col-md-6">
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="bi bi-search text-muted"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Поиск по названию..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                      {searchTerm && (
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => setSearchTerm('')}
                          title="Очистить"
                        >
                          <i className="bi bi-x-lg"></i>
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="col-md-3 ms-auto">
                    <div className="d-flex align-items-center justify-content-end">
                      <label htmlFor="itemsPerPage" className="form-label mb-0 me-2">
                        Показывать по:
                      </label>
                      <select
                        id="itemsPerPage"
                        className="form-select form-select-sm"
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                        style={{ width: 'auto' }}
                      >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                      </select>
                    </div>
                  </div>
                </div>

                {searchTerm && (
                  <div className="alert alert-info mb-4">
                    <i className="bi bi-info-circle me-2"></i>
                    По запросу <strong>"{searchTerm}"</strong> найдено: {filteredNews.length}
                  </div>
                )}

                {/* Таблица новостей */}
                <div className="table-responsive">
                  <table className="table table-striped table-hover align-middle">
                    <thead>
                      <tr>
                        <th style={{ width: '5%' }}>#</th>
                        <th style={{ width: '35%' }}>Заголовок</th>
                        <th style={{ width: '15%' }}>Дата</th>
                        <th style={{ width: '15%' }}>Статус</th>
                        <th style={{ width: '15%' }}>Важность</th>
                        <th style={{ width: '15%' }}>Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="6" className="text-center py-4">
                            <div className="spinner-border text-primary" role="status">
                              <span className="visually-hidden">Загрузка...</span>
                            </div>
                          </td>
                        </tr>
                      ) : filteredNews.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center py-4">
                            {searchTerm ? 'Новости не найдены по заданному запросу' : 'Новости не найдены'}
                          </td>
                        </tr>
                      ) : (
                        getCurrentPageItems().map((item, index) => (
                          <tr key={item.id}>
                            <td>{getItemIndex(index)}</td>
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
                
                {/* Пагинация */}
                {!loading && filteredNews.length > 0 && (
                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <div>
                      <small className="text-muted">
                        Показано: {getDisplayRange()}
                      </small>
                    </div>
                    <nav aria-label="Навигация по страницам">
                      <ul className="pagination pagination-sm mb-0">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            <i className="bi bi-chevron-left"></i>
                          </button>
                        </li>
                        
                        {getPageNumbers().map((page, index) => (
                          page === '...' ? (
                            <li key={`ellipsis-${index}`} className="page-item disabled">
                              <span className="page-link">...</span>
                            </li>
                          ) : (
                            <li 
                              key={page} 
                              className={`page-item ${currentPage === page ? 'active' : ''}`}
                            >
                              <button
                                className="page-link"
                                onClick={() => paginate(page)}
                              >
                                {page}
                              </button>
                            </li>
                          )
                        ))}
                        
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          >
                            <i className="bi bi-chevron-right"></i>
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}
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