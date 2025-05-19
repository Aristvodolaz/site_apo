import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import AdminProtected from '../../components/AdminProtected';
import { diplomasService } from '../../lib/firebaseService';
import Head from 'next/head';
import * as XLSX from 'xlsx';

// Константы
const SUBJECTS = {
  математика: 'Математика',
  физика: 'Физика',
  химия: 'Химия',
  биология: 'Биология'
};

const STATUS_STYLES = {
  'Победитель': {
    bg: 'bg-success',
    icon: 'trophy-fill'
  },
  'Призер 2 степени': {
    bg: 'bg-primary',
    icon: 'award-fill'
  },
  'Призер 3 степени': {
    bg: 'bg-info',
    icon: 'award'
  }
};

const GRADES = [5, 6, 7, 8, 9, 10, 11];

// Вспомогательная функция для работы с модальными окнами
const modalHelper = {
  show: (modalId) => {
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        const modalElement = document.getElementById(modalId);
        if (modalElement) {
          try {
            // Проверяем доступность bootstrap
            if (window.bootstrap && window.bootstrap.Modal) {
              const modal = new window.bootstrap.Modal(modalElement);
              modal.show();
            } else {
              console.warn('Bootstrap не загружен, пытаемся загрузить его динамически');
              // Пытаемся загрузить Bootstrap динамически
              import('bootstrap/dist/js/bootstrap.bundle.min.js')
                .then(() => {
                  console.log('Bootstrap загружен динамически, открываем модальное окно');
                  if (window.bootstrap && window.bootstrap.Modal) {
                    const modal = new window.bootstrap.Modal(modalElement);
                    modal.show();
                  } else {
                    console.error('Bootstrap загружен, но Modal не доступен');
                  }
                })
                .catch(err => console.error('Не удалось загрузить Bootstrap:', err));
            }
          } catch (err) {
            console.error(`Ошибка при открытии модального окна ${modalId}:`, err);
          }
        } else {
          console.error(`Модальное окно ${modalId} не найдено`);
        }
      }
    }, 100); // Увеличиваем задержку для уверенности, что DOM готов
  },
  
  hide: (modalId) => {
    if (typeof window !== 'undefined') {
      const modalElement = document.getElementById(modalId);
      if (modalElement) {
        try {
          // Проверяем доступность bootstrap
          if (window.bootstrap && window.bootstrap.Modal) {
            const modal = window.bootstrap.Modal.getInstance(modalElement);
            if (modal) {
              modal.hide();
            } else {
              // Если экземпляр не найден, попробуем создать новый и закрыть его
              const newModal = new window.bootstrap.Modal(modalElement);
              newModal.hide();
            }
          } else {
            console.warn(`Не удалось закрыть модальное окно ${modalId}: Bootstrap недоступен`);
            // Скрываем модальное окно вручную
            modalElement.style.display = 'none';
            modalElement.classList.remove('show');
            document.body.classList.remove('modal-open');
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
              backdrop.parentNode.removeChild(backdrop);
            }
          }
        } catch (err) {
          console.error(`Ошибка при закрытии модального окна ${modalId}:`, err);
          // В случае ошибки, попробуем скрыть модальное окно вручную
          modalElement.style.display = 'none';
          modalElement.classList.remove('show');
          document.body.classList.remove('modal-open');
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) {
            backdrop.parentNode.removeChild(backdrop);
          }
        }
      }
    }
  }
};

const DiplomasAdmin = () => {
  // Состояние
  const [diplomas, setDiplomas] = useState([]);
  const [filteredDiplomas, setFilteredDiplomas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Пагинация
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Фильтры
  const [filters, setFilters] = useState({
    search: '',
    grade: '',
    status: '',
    subject: ''
  });
  
  // Форма для добавления диплома
  const [newDiploma, setNewDiploma] = useState({
    fio: '',
    number: '',
    status: 'Победитель',
    grade: '7',
    subject: 'математика'
  });
  
  // Данные для редактирования
  const [editingDiploma, setEditingDiploma] = useState(null);
  
  // Проверяем, что Bootstrap доступен
  useEffect(() => {
    const loadBootstrap = async () => {
      if (typeof window !== 'undefined') {
        try {
          // Проверяем доступность Bootstrap
          if (!window.bootstrap) {
            console.log('Bootstrap not loaded, loading it now');
            
            // Импортируем Bootstrap
            await import('bootstrap/dist/js/bootstrap.bundle.min.js');
            
            // После импорта проверяем, что bootstrap действительно доступен глобально
            if (!window.bootstrap) {
              console.warn('Bootstrap imported but not available globally. Attempting to fix...');
              
              // Если bootstrap не доступен глобально после импорта
              // Используем полифилл или временное решение
              const bootstrapScript = document.createElement('script');
              bootstrapScript.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js';
              bootstrapScript.integrity = 'sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4';
              bootstrapScript.crossOrigin = 'anonymous';
              
              // Загружаем bootstrap из CDN как запасной вариант
              document.head.appendChild(bootstrapScript);
              
              console.log('Added Bootstrap from CDN as fallback');
            } else {
              console.log('Bootstrap loaded and available globally');
            }
          } else {
            console.log('Bootstrap already available globally');
          }
        } catch (err) {
          console.error('Error loading Bootstrap:', err);
        }
      }
    };
    
    loadBootstrap();
  }, []);
  
  // Загрузка дипломов
  useEffect(() => {
    async function fetchDiplomas() {
      try {
        setLoading(true);
        setError(null);
        
        const data = await diplomasService.getAllDiplomas();
        setDiplomas(data);
        setFilteredDiplomas(data);
      } catch (err) {
        console.error("Ошибка при загрузке дипломов:", err);
        setError("Не удалось загрузить данные дипломов. Пожалуйста, попробуйте позже.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchDiplomas();
  }, []);
  
  // Обработка фильтров
  useEffect(() => {
    filterDiplomas();
  }, [filters, diplomas]);
  
  const filterDiplomas = () => {
    let results = [...diplomas];
    
    // Поиск по ФИО или номеру
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      results = results.filter(diploma => 
        diploma.fio?.toLowerCase().includes(searchLower) || 
        diploma.number?.toLowerCase().includes(searchLower)
      );
    }
    
    // Фильтр по классу
    if (filters.grade) {
      results = results.filter(diploma => diploma.grade === filters.grade);
    }
    
    // Фильтр по статусу
    if (filters.status) {
      results = results.filter(diploma => diploma.status === filters.status);
    }
    
    // Фильтр по предмету
    if (filters.subject) {
      results = results.filter(diploma => diploma.subject === filters.subject);
    }
    
    setFilteredDiplomas(results);
    setCurrentPage(1); // Сбрасываем на первую страницу при фильтрации
  };

  // Обработка изменения фильтров
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Сброс всех фильтров
  const resetFilters = () => {
    setFilters({
      search: '',
      grade: '',
      status: '',
      subject: ''
    });
  };

  // Пагинация
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDiplomas.slice(indexOfFirstItem, indexOfLastItem);
  
  // Переход по страницам
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  // Изменение количества элементов на странице
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };
  
  // Получение номеров страниц
  const getPageNumbers = () => {
    const pageNumbers = [];
    const totalPages = Math.ceil(filteredDiplomas.length / itemsPerPage);
    
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pageNumbers.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pageNumbers;
  };
  
  // Обработка изменения формы
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDiploma(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Обработка редактирования поля диплома
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingDiploma(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Экспорт в Excel
  const exportToExcel = () => {
    // Создаем данные для Excel
    const data = filteredDiplomas.map(diploma => ({
      'ФИО': diploma.fio,
      'Номер диплома': diploma.number,
      'Класс': diploma.grade,
      'Статус': diploma.status,
      'Предмет': SUBJECTS[diploma.subject] || diploma.subject,
      'Создан': diploma.created_at ? new Date(diploma.created_at.seconds * 1000).toLocaleString() : 'Н/Д'
    }));
    
    // Создаем рабочую книгу
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Дипломы');
    
    // Устанавливаем ширину столбцов
    const maxWidth = data.reduce((width, row) => {
      return Math.max(width, row['ФИО'].length);
    }, 10);
    
    worksheet['!cols'] = [
      { wch: maxWidth }, // ФИО
      { wch: 15 }, // Номер
      { wch: 8 }, // Класс
      { wch: 15 }, // Статус
      { wch: 10 }, // Предмет
      { wch: 20 } // Создан
    ];
    
    // Генерируем имя файла с текущей датой
    const date = new Date();
    const fileName = `diplomas_export_${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}.xlsx`;
    
    // Скачиваем файл
    XLSX.writeFile(workbook, fileName);
  };
  
  // Обработка добавления диплома
  const handleAddDiploma = async (e) => {
    e.preventDefault();
    
    if (!newDiploma.fio || !newDiploma.number) {
      setError("Пожалуйста, заполните все обязательные поля.");
      return;
    }
    
    try {
      setLoading(true);
      
      // Добавление диплома в Firebase
      const addedDiploma = await diplomasService.addDiploma(newDiploma);
      
      // Обновление состояния
      setDiplomas(prev => [...prev, addedDiploma]);
      setFilteredDiplomas(prev => {
        // Проверяем, соответствует ли новый диплом текущим фильтрам
        const matches = matchesFilters(addedDiploma, filters);
        return matches ? [...prev, addedDiploma] : prev;
      });
      
      // Сброс формы
      setNewDiploma({
        fio: '',
        number: '',
        status: 'Победитель',
        grade: '7',
        subject: 'математика'
      });
      
      // Закрываем модальное окно
      modalHelper.hide('addDiplomaModal');
      
      // Сброс ошибки
      setError(null);
    } catch (err) {
      console.error("Ошибка при добавлении диплома:", err);
      setError("Не удалось добавить диплом. Пожалуйста, попробуйте еще раз.");
    } finally {
      setLoading(false);
    }
  };
  
  // Проверка соответствия диплома фильтрам
  const matchesFilters = (diploma, filters) => {
    // Поиск по ФИО или номеру
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!diploma.fio?.toLowerCase().includes(searchLower) && 
          !diploma.number?.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
    
    // Фильтр по классу
    if (filters.grade && diploma.grade !== filters.grade) {
      return false;
    }
    
    // Фильтр по статусу
    if (filters.status && diploma.status !== filters.status) {
      return false;
    }
    
    // Фильтр по предмету
    if (filters.subject && diploma.subject !== filters.subject) {
      return false;
    }
    
    return true;
  };
  
  // Загрузка массива дипломов
  const handleBulkUpload = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Здесь можно добавить интерфейс для загрузки файла
      // Например, через input type="file" и FileReader API
      
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.xlsx,.xls,.csv';
      
      fileInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
          try {
            const reader = new FileReader();
            reader.onload = async (event) => {
              const data = new Uint8Array(event.target.result);
              const workbook = XLSX.read(data, { type: 'array' });
              
              // Получаем первый лист
              const worksheet = workbook.Sheets[workbook.SheetNames[0]];
              const jsonData = XLSX.utils.sheet_to_json(worksheet);
              
              if (jsonData.length === 0) {
                setError("Файл не содержит данных.");
                return;
              }
              
              // Преобразуем данные в формат, подходящий для Firebase
              const diplomasData = jsonData.map(row => ({
                fio: row['ФИО'] || '',
                number: row['Номер'] || row['Номер диплома'] || '',
                grade: row['Класс']?.toString() || '7',
                status: row['Статус'] || 'Победитель',
                subject: row['Предмет']?.toLowerCase() || 'математика'
              }));
              
              // Добавляем дипломы в Firebase
              const results = await diplomasService.addBulkDiplomas(diplomasData);
              
              // Обновляем состояние
              setDiplomas(prev => [...prev, ...results]);
              setFilteredDiplomas(prev => {
                const newDiplomas = results.filter(diploma => matchesFilters(diploma, filters));
                return [...prev, ...newDiplomas];
              });
              
              alert(`Успешно добавлено ${results.length} дипломов.`);
            };
            reader.readAsArrayBuffer(file);
          } catch (err) {
            console.error("Ошибка при обработке файла:", err);
            setError("Не удалось обработать файл. Проверьте формат и структуру данных.");
          }
        }
      };
      
      fileInput.click();
    } catch (err) {
      console.error("Ошибка при массовой загрузке:", err);
      setError("Произошла ошибка при массовой загрузке дипломов.");
    } finally {
      setLoading(false);
    }
  };
  
  // Открытие модального окна для редактирования
  const handleEdit = (diploma) => {
    setEditingDiploma({...diploma});
    
    // Открываем модальное окно
    modalHelper.show('editDiplomaModal');
  };
  
  // Обновление диплома
  const handleUpdateDiploma = async (e) => {
    e.preventDefault();
    
    if (!editingDiploma.fio || !editingDiploma.number) {
      setError("Пожалуйста, заполните все обязательные поля.");
      return;
    }
    
    try {
      setLoading(true);
      
      // Обновление диплома в Firebase
      await diplomasService.updateDiploma(editingDiploma.id, editingDiploma);
      
      // Обновление состояния
      setDiplomas(prev => 
        prev.map(diploma => 
          diploma.id === editingDiploma.id ? editingDiploma : diploma
        )
      );
      
      setFilteredDiplomas(prev => {
        // Проверяем, соответствует ли обновленный диплом текущим фильтрам
        const matches = matchesFilters(editingDiploma, filters);
        if (matches) {
          return prev.map(diploma => 
            diploma.id === editingDiploma.id ? editingDiploma : diploma
          );
        } else {
          return prev.filter(diploma => diploma.id !== editingDiploma.id);
        }
      });
      
      // Закрываем модальное окно
      modalHelper.hide('editDiplomaModal');
      
      // Сброс редактируемого диплома
      setEditingDiploma(null);
      
      // Сброс ошибки
      setError(null);
    } catch (err) {
      console.error("Ошибка при обновлении диплома:", err);
      setError("Не удалось обновить диплом. Пожалуйста, попробуйте еще раз.");
    } finally {
      setLoading(false);
    }
  };
  
  // Удаление диплома
  const handleDelete = async (diplomaId) => {
    if (!confirm("Вы уверены, что хотите удалить этот диплом?")) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Удаление диплома из Firebase
      await diplomasService.deleteDiploma(diplomaId);
      
      // Обновление состояния
      setDiplomas(prev => prev.filter(diploma => diploma.id !== diplomaId));
      setFilteredDiplomas(prev => prev.filter(diploma => diploma.id !== diplomaId));
      
      // Сброс ошибки
      setError(null);
    } catch (err) {
      console.error("Ошибка при удалении диплома:", err);
      setError("Не удалось удалить диплом. Пожалуйста, попробуйте еще раз.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AdminProtected>
      <Layout title="Управление дипломами | Админ-панель">
        <div className="container-fluid px-4 px-lg-5 py-5">
          <div className="mx-auto" style={{ maxWidth: '1400px' }}>
            {/* Хлебные крошки */}
            <nav aria-label="breadcrumb" className="mb-4">
              <ol className="breadcrumb bg-transparent p-0 mb-0">
                <li className="breadcrumb-item">
                  <a href="/admin" className="text-decoration-none">
                    <i className="bi bi-house-door me-1"></i>
                    Админ-панель
                  </a>
                </li>
                <li className="breadcrumb-item active">
                  <span className="text-primary">
                    <i className="bi bi-award me-1"></i>
                    Управление дипломами
                  </span>
                </li>
              </ol>
            </nav>
            
            {/* Фильтры */}
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="card-title mb-0 d-flex align-items-center">
                    <i className="bi bi-funnel me-2 text-primary"></i>
                    Фильтры
                  </h5>
                  <button
                    className="btn btn-light btn-sm d-flex align-items-center"
                    onClick={resetFilters}
                  >
                    <i className="bi bi-x-circle me-2"></i>
                    Сбросить фильтры
                  </button>
                </div>

                <div className="row g-3">
                  {/* Поиск */}
                  <div className="col-md-6">
                    <div className="input-group">
                      <span className="input-group-text bg-transparent border-end-0">
                        <i className="bi bi-search text-muted"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0 ps-0"
                        placeholder="Поиск по ФИО или номеру диплома..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Класс */}
                  <div className="col-md-2">
                    <select
                      className="form-select form-select-sm border-0 shadow-sm"
                      value={filters.grade}
                      onChange={(e) => handleFilterChange('grade', e.target.value)}
                    >
                      <option value="">🎓 Все классы</option>
                      {GRADES.map(grade => (
                        <option key={grade} value={grade.toString()}>{grade} класс</option>
                      ))}
                    </select>
                  </div>

                  {/* Статус */}
                  <div className="col-md-2">
                    <select
                      className="form-select form-select-sm border-0 shadow-sm"
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                      <option value="">🏆 Все статусы</option>
                      <option value="Победитель">Победитель</option>
                      <option value="Призер 2 степени">Призер 2 степени</option>
                      <option value="Призер 3 степени">Призер 3 степени</option>
                    </select>
                  </div>

                  {/* Предмет */}
                  <div className="col-md-2">
                    <select
                      className="form-select form-select-sm border-0 shadow-sm"
                      value={filters.subject}
                      onChange={(e) => handleFilterChange('subject', e.target.value)}
                    >
                      <option value="">📚 Все предметы</option>
                      {Object.entries(SUBJECTS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Таблица дипломов */}
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h1 className="h3 mb-0 d-flex align-items-center">
                    <i className="bi bi-award me-3 text-primary"></i>
                    Управление дипломами
                  </h1>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-primary d-flex align-items-center shadow-sm"
                      onClick={() => {
                        setEditingDiploma(null);
                        setNewDiploma({
                          fio: '',
                          number: '',
                          status: 'Победитель',
                          grade: '7',
                          subject: 'математика'
                        });
                        modalHelper.show('addDiplomaModal');
                      }}
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      Добавить диплом
                    </button>
                    <button 
                      className="btn btn-outline-success d-flex align-items-center shadow-sm"
                      onClick={handleBulkUpload}
                    >
                      <i className="bi bi-upload me-2"></i>
                      Импорт из Excel
                    </button>
                    <button 
                      className="btn btn-success d-flex align-items-center shadow-sm"
                      onClick={exportToExcel}
                    >
                      <i className="bi bi-file-excel me-2"></i>
                      Экспорт в Excel
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="alert alert-danger d-flex align-items-center rounded-3" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                    <button type="button" className="btn-close ms-auto" onClick={() => setError(null)}></button>
                  </div>
                )}

                <div className="table-responsive rounded-3 border">
                  <table className="table table-hover align-middle small mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="fw-semibold">#</th>
                        <th className="fw-semibold" style={{ width: '25%' }}>ФИО</th>
                        <th className="fw-semibold" style={{ width: '15%' }}>Номер диплома</th>
                        <th className="fw-semibold" style={{ width: '10%' }}>Класс</th>
                        <th className="fw-semibold" style={{ width: '15%' }}>Статус</th>
                        <th className="fw-semibold" style={{ width: '15%' }}>Предмет</th>
                        <th className="fw-semibold text-end" style={{ width: '10%' }}>Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading && diplomas.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                              <span className="visually-hidden">Загрузка...</span>
                            </div>
                            <p className="mt-3">Загрузка данных дипломов...</p>
                          </td>
                        </tr>
                      ) : filteredDiplomas.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="text-center py-5 text-muted">
                            <i className="bi bi-inbox-fill fs-2 d-block mb-3"></i>
                            {filters.search || filters.grade || filters.status || filters.subject ? 
                              'По вашему запросу ничего не найдено. Попробуйте изменить параметры поиска.' : 
                              'В базе данных пока нет дипломов. Добавьте новый диплом или выполните массовую загрузку.'}
                          </td>
                        </tr>
                      ) : (
                        currentItems.map((diploma, index) => (
                          <tr key={diploma.id}>
                            <td>{indexOfFirstItem + index + 1}</td>
                            <td>{diploma.fio}</td>
                            <td>
                              <span className="badge bg-light text-dark">
                                {diploma.number}
                              </span>
                            </td>
                            <td>{diploma.grade} класс</td>
                            <td>
                              <span className={`badge ${
                                STATUS_STYLES[diploma.status]?.bg || 'bg-secondary'
                              }`}>
                                <i className={`bi bi-${STATUS_STYLES[diploma.status]?.icon || 'award'} me-1`}></i>
                                {diploma.status}
                              </span>
                            </td>
                            <td>
                              <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3">
                                {SUBJECTS[diploma.subject] || diploma.subject}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex justify-content-end gap-2">
                                <button 
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => handleEdit(diploma)}
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDelete(diploma.id)}
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
                {filteredDiplomas.length > 0 && (
                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <div className="d-flex align-items-center">
                      <span className="me-2">Показать:</span>
                      <select 
                        className="form-select form-select-sm" 
                        style={{ width: '70px' }}
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                      >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                      </select>
                      <span className="ms-2">записей</span>
                      <span className="ms-4">
                        {`Показано ${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, filteredDiplomas.length)} из ${filteredDiplomas.length}`}
                      </span>
                    </div>
                    
                    <nav aria-label="Навигация по страницам">
                      <ul className="pagination pagination-sm mb-0">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button className="page-link" onClick={() => handlePageChange(1)}>
                            <i className="bi bi-chevron-double-left"></i>
                          </button>
                        </li>
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                            <i className="bi bi-chevron-left"></i>
                          </button>
                        </li>
                        
                        {getPageNumbers().map((pageNumber, index) => (
                          <li key={index} className={`page-item ${pageNumber === currentPage ? 'active' : ''} ${pageNumber === '...' ? 'disabled' : ''}`}>
                            <button 
                              className="page-link"
                              onClick={() => pageNumber !== '...' && handlePageChange(pageNumber)}
                            >
                              {pageNumber}
                            </button>
                          </li>
                        ))}
                        
                        <li className={`page-item ${currentPage === Math.ceil(filteredDiplomas.length / itemsPerPage) ? 'disabled' : ''}`}>
                          <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                            <i className="bi bi-chevron-right"></i>
                          </button>
                        </li>
                        <li className={`page-item ${currentPage === Math.ceil(filteredDiplomas.length / itemsPerPage) ? 'disabled' : ''}`}>
                          <button className="page-link" onClick={() => handlePageChange(Math.ceil(filteredDiplomas.length / itemsPerPage))}>
                            <i className="bi bi-chevron-double-right"></i>
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}
              </div>
            </div>

            {/* Модальное окно добавления диплома */}
            <div className="modal fade" id="addDiplomaModal" tabIndex="-1" aria-labelledby="addDiplomaModalLabel" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content rounded-4 shadow">
                  <div className="modal-header border-bottom-0">
                    <h5 className="modal-title" id="addDiplomaModalLabel">
                      <i className="bi bi-plus-circle me-2 text-primary"></i>
                      Добавить новый диплом
                    </h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
                  </div>
                  <div className="modal-body py-0">
                    <form onSubmit={handleAddDiploma}>
                      <div className="mb-3">
                        <label htmlFor="fio" className="form-label">ФИО участника <span className="text-danger">*</span></label>
                        <input
                          type="text"
                          className="form-control"
                          id="fio"
                          name="fio"
                          value={newDiploma.fio}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="number" className="form-label">Номер диплома <span className="text-danger">*</span></label>
                        <input
                          type="text"
                          className="form-control"
                          id="number"
                          name="number"
                          value={newDiploma.number}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="grade" className="form-label">Класс</label>
                        <select
                          className="form-select"
                          id="grade"
                          name="grade"
                          value={newDiploma.grade}
                          onChange={handleInputChange}
                        >
                          {GRADES.map(grade => (
                            <option key={grade} value={grade.toString()}>{grade} класс</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="status" className="form-label">Статус</label>
                        <select
                          className="form-select"
                          id="status"
                          name="status"
                          value={newDiploma.status}
                          onChange={handleInputChange}
                        >
                          <option value="Победитель">Победитель</option>
                          <option value="Призер 2 степени">Призер 2 степени</option>
                          <option value="Призер 3 степени">Призер 3 степени</option>
                        </select>
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="subject" className="form-label">Предмет</label>
                        <select
                          className="form-select"
                          id="subject"
                          name="subject"
                          value={newDiploma.subject}
                          onChange={handleInputChange}
                        >
                          {Object.entries(SUBJECTS).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="d-flex justify-content-end gap-2 mt-4">
                        <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">Отмена</button>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Сохранение...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-check-circle me-2"></i>
                              Добавить диплом
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Модальное окно редактирования диплома */}
            <div className="modal fade" id="editDiplomaModal" tabIndex="-1" aria-labelledby="editDiplomaModalLabel" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content rounded-4 shadow">
                  <div className="modal-header border-bottom-0">
                    <h5 className="modal-title" id="editDiplomaModalLabel">
                      <i className="bi bi-pencil me-2 text-primary"></i>
                      Редактировать диплом
                    </h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
                  </div>
                  <div className="modal-body py-0">
                    {editingDiploma && (
                      <form onSubmit={handleUpdateDiploma}>
                        <div className="mb-3">
                          <label htmlFor="edit-fio" className="form-label">ФИО участника <span className="text-danger">*</span></label>
                          <input
                            type="text"
                            className="form-control"
                            id="edit-fio"
                            name="fio"
                            value={editingDiploma.fio}
                            onChange={handleEditInputChange}
                            required
                          />
                        </div>
                        
                        <div className="mb-3">
                          <label htmlFor="edit-number" className="form-label">Номер диплома <span className="text-danger">*</span></label>
                          <input
                            type="text"
                            className="form-control"
                            id="edit-number"
                            name="number"
                            value={editingDiploma.number}
                            onChange={handleEditInputChange}
                            required
                          />
                        </div>
                        
                        <div className="mb-3">
                          <label htmlFor="edit-grade" className="form-label">Класс</label>
                          <select
                            className="form-select"
                            id="edit-grade"
                            name="grade"
                            value={editingDiploma.grade}
                            onChange={handleEditInputChange}
                          >
                            {GRADES.map(grade => (
                              <option key={grade} value={grade.toString()}>{grade} класс</option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="mb-3">
                          <label htmlFor="edit-status" className="form-label">Статус</label>
                          <select
                            className="form-select"
                            id="edit-status"
                            name="status"
                            value={editingDiploma.status}
                            onChange={handleEditInputChange}
                          >
                            <option value="Победитель">Победитель</option>
                            <option value="Призер 2 степени">Призер 2 степени</option>
                            <option value="Призер 3 степени">Призер 3 степени</option>
                          </select>
                        </div>
                        
                        <div className="mb-3">
                          <label htmlFor="edit-subject" className="form-label">Предмет</label>
                          <select
                            className="form-select"
                            id="edit-subject"
                            name="subject"
                            value={editingDiploma.subject}
                            onChange={handleEditInputChange}
                          >
                            {Object.entries(SUBJECTS).map(([value, label]) => (
                              <option key={value} value={value}>{label}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="d-flex justify-content-end gap-2 mt-4">
                          <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">Отмена</button>
                          <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                          >
                            {loading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Сохранение...
                              </>
                            ) : (
                              <>
                                <i className="bi bi-check-circle me-2"></i>
                                Сохранить изменения
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bootstrap для модальных окон */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('DOMContentLoaded', function() {
                const initModals = function() {
                  if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
                    console.log('Initializing Bootstrap modals...');
                    // Инициализация всех модальных окон
                    var modals = document.querySelectorAll('.modal');
                    modals.forEach(function(modalEl) {
                      try {
                        new bootstrap.Modal(modalEl);
                        console.log('Modal initialized:', modalEl.id);
                      } catch (err) {
                        console.error('Error initializing modal:', modalEl.id, err);
                      }
                    });
                  } else {
                    console.warn('Bootstrap not available, retrying in 500ms...');
                    setTimeout(initModals, 500);
                  }
                };
                
                // Запускаем инициализацию модальных окон
                initModals();
                
                // Также инициализируем еще раз через 1 секунду для уверенности
                setTimeout(initModals, 1000);
              });
            `
          }}
        />
      </Layout>
    </AdminProtected>
  );
};

export default DiplomasAdmin; 