import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import AdminProtected from '../../components/AdminProtected';

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    // Получаем логи из localStorage
    const storedLogs = localStorage.getItem('admin_logs');
    if (storedLogs) {
      const parsedLogs = JSON.parse(storedLogs).reverse(); // Сразу переворачиваем, чтобы новые были сверху
      setLogs(parsedLogs);
      setFilteredLogs(parsedLogs);
    }
  }, []);

  // Фильтрация логов при изменении поискового запроса
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredLogs(logs);
    } else {
      const filtered = logs.filter(log => 
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLogs(filtered);
    }
    setCurrentPage(1); // Сбрасываем на первую страницу при поиске
  }, [searchTerm, logs]);

  // Обработка изменения поискового запроса
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Получение текущей страницы логов
  const getCurrentPageItems = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredLogs.slice(indexOfFirstItem, indexOfLastItem);
  };

  // Изменение страницы
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Изменение количества элементов на странице
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Сбрасываем на первую страницу
  };

  // Расчет индекса записи для отображения нумерации
  const getItemIndex = (index) => {
    return (currentPage - 1) * itemsPerPage + index + 1;
  };

  // Получение общего количества страниц
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

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
    if (filteredLogs.length === 0) return '0-0 из 0';
    
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, filteredLogs.length);
    
    return `${start}-${end} из ${filteredLogs.length}`;
  };

  return (
    <AdminProtected>
      <Layout title="Админ панель | Логи">
        <div className="container py-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h3 mb-0">Логи системы</h1>
            <button 
              className="btn btn-danger btn-sm"
              onClick={() => {
                localStorage.removeItem('admin_logs');
                setLogs([]);
                setFilteredLogs([]);
              }}
            >
              <i className="bi bi-trash me-2"></i>
              Очистить логи
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
                  placeholder="Поиск по действию или пользователю..."
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
              По запросу <strong>"{searchTerm}"</strong> найдено: {filteredLogs.length}
            </div>
          )}

          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th style={{ width: '5%' }}>#</th>
                      <th style={{ width: '15%' }}>Время</th>
                      <th style={{ width: '35%' }}>Действие</th>
                      <th style={{ width: '20%' }}>Пользователь</th>
                      <th style={{ width: '10%' }}>Статус</th>
                      <th style={{ width: '15%' }}>IP адрес</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.length > 0 ? (
                      getCurrentPageItems().map((log, index) => (
                        <tr key={index}>
                          <td>{getItemIndex(index)}</td>
                          <td style={{ whiteSpace: 'nowrap' }}>{new Date(log.timestamp).toLocaleString()}</td>
                          <td>{log.action}</td>
                          <td>{log.user}</td>
                          <td>
                            <span className={`badge bg-${log.status === 'success' ? 'success' : 'danger'}`}>
                              {log.status === 'success' ? 'Успешно' : 'Ошибка'}
                            </span>
                          </td>
                          <td>{log.ip}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-4 text-muted">
                          {searchTerm ? 'Логи не найдены по заданному запросу' : 'Логи отсутствуют'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Пагинация */}
          {filteredLogs.length > 0 && (
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
      </Layout>
    </AdminProtected>
  );
} 