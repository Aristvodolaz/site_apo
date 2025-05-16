import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminsPage() {
  const [admins, setAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    name: '',
    role: 'admin'
  });
  const [formVisible, setFormVisible] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const router = useRouter();

  // Загрузка списка администраторов
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/admins');
      
      if (!response.ok) {
        throw new Error('Ошибка при загрузке администраторов');
      }
      
      const data = await response.json();
      setAdmins(data.admins || []);
      setFilteredAdmins(data.admins || []);
    } catch (error) {
      console.error('Ошибка при загрузке администраторов:', error);
      setError('Не удалось загрузить список администраторов. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Фильтрация администраторов при изменении поискового запроса
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredAdmins(admins);
    } else {
      const filtered = admins.filter(admin => 
        admin.login.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAdmins(filtered);
    }
    setCurrentPage(1); // Сбрасываем на первую страницу при поиске
  }, [searchTerm, admins]);

  // Обработка изменения поискового запроса
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Получение текущей страницы администраторов
  const getCurrentPageItems = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredAdmins.slice(indexOfFirstItem, indexOfLastItem);
  };

  // Изменение страницы
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Изменение количества элементов на странице
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Сбрасываем на первую страницу
  };

  // Обработка отправки формы добавления администратора
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormLoading(true);
    
    try {
      const response = await fetch('/api/admin/admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Ошибка при создании администратора');
      }
      
      // Очищаем форму и обновляем список
      setFormData({
        login: '',
        password: '',
        name: '',
        role: 'admin'
      });
      setFormVisible(false);
      fetchAdmins();
    } catch (error) {
      console.error('Ошибка при создании администратора:', error);
      setFormError(error.message || 'Не удалось создать администратора. Пожалуйста, попробуйте позже.');
    } finally {
      setFormLoading(false);
    }
  };

  // Обработка изменения полей формы
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Обработка изменения статуса администратора
  const handleStatusChange = async (id, active) => {
    try {
      const response = await fetch(`/api/admin/admins/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ active: !active })
      });
      
      if (!response.ok) {
        throw new Error('Ошибка при изменении статуса');
      }
      
      // Обновляем список после изменения
      fetchAdmins();
    } catch (error) {
      console.error('Ошибка при изменении статуса:', error);
      setError('Не удалось изменить статус администратора. Пожалуйста, попробуйте позже.');
    }
  };

  // Обработка удаления администратора
  const handleDelete = async (id) => {
    if (!confirm('Вы уверены, что хотите удалить этого администратора?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/admins/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Ошибка при удалении администратора');
      }
      
      // Обновляем список после удаления
      fetchAdmins();
    } catch (error) {
      console.error('Ошибка при удалении администратора:', error);
      setError('Не удалось удалить администратора. Пожалуйста, попробуйте позже.');
    }
  };

  // Расчет индекса записи для отображения нумерации
  const getItemIndex = (index) => {
    return (currentPage - 1) * itemsPerPage + index + 1;
  };

  // Получение общего количества страниц
  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);

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
    if (filteredAdmins.length === 0) return '0-0 из 0';
    
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, filteredAdmins.length);
    
    return `${start}-${end} из ${filteredAdmins.length}`;
  };

  return (
    <AdminLayout>
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h3">Управление администраторами</h1>
          <button
            className="btn btn-primary"
            onClick={() => setFormVisible(!formVisible)}
          >
            {formVisible ? (
              <>
                <i className="bi bi-x-lg me-2"></i>
                Отменить
              </>
            ) : (
              <>
                <i className="bi bi-plus-lg me-2"></i>
                Добавить администратора
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        )}

        {formVisible && (
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-light">
              <h5 className="card-title mb-0">Добавление нового администратора</h5>
            </div>
            <div className="card-body">
              {formError && (
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="login" className="form-label">Логин</label>
                    <input
                      type="text"
                      className="form-control"
                      id="login"
                      name="login"
                      value={formData.login}
                      onChange={handleChange}
                      required
                      disabled={formLoading}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="password" className="form-label">Пароль</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={formLoading}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="name" className="form-label">Имя</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={formLoading}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="role" className="form-label">Роль</label>
                    <select
                      className="form-select"
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      disabled={formLoading}
                    >
                      <option value="admin">Администратор</option>
                      <option value="editor">Редактор</option>
                      <option value="superadmin">Суперадминистратор</option>
                    </select>
                  </div>
                  <div className="col-12 mt-3">
                    <div className="d-flex justify-content-end">
                      <button
                        type="button"
                        className="btn btn-outline-secondary me-2"
                        onClick={() => setFormVisible(false)}
                        disabled={formLoading}
                      >
                        Отмена
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={formLoading}
                      >
                        {formLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Создание...
                          </>
                        ) : (
                          'Создать администратора'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

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
                placeholder="Поиск по логину или имени..."
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
            По запросу <strong>"{searchTerm}"</strong> найдено: {filteredAdmins.length}
          </div>
        )}

        <div className="card shadow-sm">
          <div className="card-body">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Загрузка...</span>
                </div>
                <p className="mt-3 text-muted">Загрузка списка администраторов...</p>
              </div>
            ) : filteredAdmins.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-people fs-1 text-muted"></i>
                <p className="mt-3">{searchTerm ? 'Администраторы не найдены по заданному запросу' : 'Нет зарегистрированных администраторов'}</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th scope="col" style={{ width: '5%' }}>#</th>
                      <th scope="col" style={{ width: '15%' }}>Логин</th>
                      <th scope="col" style={{ width: '20%' }}>Имя</th>
                      <th scope="col" style={{ width: '15%' }}>Роль</th>
                      <th scope="col" style={{ width: '20%' }}>Последний вход</th>
                      <th scope="col" style={{ width: '10%' }}>Статус</th>
                      <th scope="col" style={{ width: '15%' }}>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getCurrentPageItems().map((admin, index) => (
                      <tr key={admin.id}>
                        <td>{getItemIndex(index)}</td>
                        <td>{admin.login}</td>
                        <td>{admin.name}</td>
                        <td>
                          {admin.role === 'superadmin' && <span className="badge bg-danger">Суперадмин</span>}
                          {admin.role === 'admin' && <span className="badge bg-primary">Администратор</span>}
                          {admin.role === 'editor' && <span className="badge bg-info">Редактор</span>}
                        </td>
                        <td>{admin.lastLogin ? new Date(admin.lastLogin).toLocaleString() : 'Никогда'}</td>
                        <td>
                          <span className={`badge ${admin.active !== false ? 'bg-success' : 'bg-secondary'}`}>
                            {admin.active !== false ? 'Активен' : 'Заблокирован'}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex">
                            <button
                              className={`btn btn-sm ${admin.active !== false ? 'btn-outline-warning' : 'btn-outline-success'} me-2`}
                              onClick={() => handleStatusChange(admin.id, admin.active !== false)}
                              title={admin.active !== false ? 'Заблокировать' : 'Активировать'}
                            >
                              <i className={`bi ${admin.active !== false ? 'bi-pause-fill' : 'bi-play-fill'}`}></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(admin.id)}
                              title="Удалить"
                              disabled={admin.role === 'superadmin'}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Пагинация */}
            {!loading && filteredAdmins.length > 0 && (
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
    </AdminLayout>
  );
} 