import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, getDocs, doc, updateDoc, where, orderBy, deleteDoc, addDoc } from 'firebase/firestore';
import Layout from '../../components/Layout';
import { useRouter } from 'next/router';
import * as XLSX from 'xlsx';
import AdminProtected from '../../components/AdminProtected';
import { regionsData } from '../../data/regionsData';
import Link from 'next/link';

// Объявляем глобальную переменную для Bootstrap
let bootstrap;

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc'
  });
  const [filters, setFilters] = useState({
    search: '',
    region: '',
    city: '',
    school: '',
    subjects: []
  });
  const [availableSchools, setAvailableSchools] = useState([]);
  const [editingParticipant, setEditingParticipant] = useState(null);
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    phone: '',
    school: '',
    region: '',
    city: '',
    grade: '',
    subjects: []
  });

  // Загрузка данных
  useEffect(() => {
    loadParticipants();
  }, []);

  // Загрузка списка школ
  useEffect(() => {
    if (participants.length > 0) {
      const schools = [...new Set(participants.map(p => p.school))].sort();
      setAvailableSchools(schools);
    }
  }, [participants]);

  // Инициализация Bootstrap и обработчиков модального окна
  useEffect(() => {
    let modalInstance = null;
    let modalElement = null;
    
    // Импортируем Bootstrap только на клиенте
    if (typeof window !== 'undefined') {
      import('bootstrap/dist/js/bootstrap.bundle.min.js').then(module => {
        bootstrap = module.default;
        modalElement = document.getElementById('editParticipantModal');
        if (modalElement) {
          modalInstance = new bootstrap.Modal(modalElement, {
            backdrop: 'static',
            keyboard: false
          });
          
          // Добавляем обработчик события закрытия модального окна
          modalElement.addEventListener('hidden.bs.modal', () => {
            setEditingParticipant(null);
            setFormData({
              firstName: '',
              lastName: '',
              middleName: '',
              email: '',
              phone: '',
              school: '',
              region: '',
              city: '',
              grade: '',
              subjects: []
            });
            // Удаляем backdrop вручную
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
              backdrop.remove();
            }
            // Убираем класс modal-open с body
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
          });
        }
      });
    }

    // Очистка при размонтировании
    return () => {
      if (modalInstance) {
        modalInstance.dispose();
      }
      if (modalElement) {
        modalElement.remove();
      }
      // Удаляем backdrop при размонтировании
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }
      // Убираем класс modal-open с body
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, []);

  const loadParticipants = async () => {
    try {
      setLoading(true);
      const participantsRef = collection(db, 'registrations');
      const q = query(participantsRef);
      const querySnapshot = await getDocs(q);
      
      const data = querySnapshot.docs.map(doc => {
        const docData = doc.data();
        console.log('Raw document data:', docData);

        // Проверяем наличие обязательных полей
        const requiredFields = ['firstName', 'lastName', 'email', 'school', 'region', 'city', 'grade', 'subjects'];
        const missingFields = requiredFields.filter(field => !docData[field]);
        
        if (missingFields.length > 0) {
          console.warn(`Document ${doc.id} is missing required fields:`, missingFields);
        }

        return {
          id: doc.id,
          participantId: docData.participantId || '—',
          firstName: docData.firstName || '',
          lastName: docData.lastName || '',
          middleName: docData.middleName || '',
          email: docData.email || '',
          phone: docData.phone || '',
          school: docData.school || '',
          region: docData.region || '',
          city: docData.city || '',
          grade: docData.grade || '',
          subjects: Array.isArray(docData.subjects) ? docData.subjects : [],
          status: docData.status || 'new',
          createdAt: docData.createdAt?.toDate().toLocaleString() || 'Н/Д'
        };
      });

      console.log('Total documents:', querySnapshot.size);
      console.log('Mapped data:', data);
      
      setParticipants(data);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Функция сортировки
  const sortData = (data, key, direction) => {
    return [...data].sort((a, b) => {
      let aValue = a[key];
      let bValue = b[key];

      // Специальная обработка для разных типов данных
      if (key === 'createdAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (key === 'grade') {
        aValue = parseInt(aValue);
        bValue = parseInt(bValue);
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  // Функция для изменения сортировки
  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Фильтрация участников
  const filteredParticipants = participants.filter(participant => {
    const searchLower = filters.search.toLowerCase();
    const matchesSearch = 
      participant.firstName?.toLowerCase().includes(searchLower) ||
      participant.lastName?.toLowerCase().includes(searchLower) ||
      participant.middleName?.toLowerCase().includes(searchLower) ||
      participant.school?.toLowerCase().includes(searchLower) ||
      participant.email?.toLowerCase().includes(searchLower);

    const matchesRegion = !filters.region || participant.region === filters.region;
    const matchesCity = !filters.city || participant.city === filters.city;
    const matchesSchool = !filters.school || participant.school === filters.school;
    const matchesSubjects = filters.subjects.length === 0 || 
      participant.subjects?.some(subject => filters.subjects.includes(subject));

    const result = matchesSearch && matchesRegion && matchesCity && matchesSchool && matchesSubjects;
    console.log('Результат фильтрации:', {
      participant: `${participant.lastName} ${participant.firstName}`,
      matchesSearch,
      matchesRegion,
      matchesCity,
      matchesSchool,
      matchesSubjects,
      result
    });

    return result;
  });

  // Добавляем вывод количества отфильтрованных участников
  useEffect(() => {
    console.log('Всего участников:', participants.length);
    console.log('Отфильтровано участников:', filteredParticipants.length);
    console.log('Текущие фильтры:', filters);
  }, [participants, filteredParticipants, filters]);

  // Сортировка отфильтрованных данных
  const sortedParticipants = sortData(filteredParticipants, sortConfig.key, sortConfig.direction);

  // Добавляем функции для пагинации
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedParticipants.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredParticipants.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Сбрасываем на первую страницу при изменении количества элементов
  };

  // Генерация номеров страниц для пагинации
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Если страниц меньше или равно maxVisiblePages, показываем все
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Всегда показываем первую страницу
      pageNumbers.push(1);
      
      if (currentPage > 3) {
        pageNumbers.push('...');
      }
      
      // Показываем страницы вокруг текущей
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pageNumbers.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pageNumbers.push('...');
      }
      
      // Всегда показываем последнюю страницу
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, [name]: value };
      // Сброс города при изменении региона
      if (name === 'region') {
        newFilters.city = '';
      }
      return newFilters;
    });
  };

  const handleSubjectToggle = (subject) => {
    setFilters(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const subjects = ['math', 'physics', 'chemistry', 'biology'];
  const subjectNames = {
    math: 'Математика',
    physics: 'Физика',
    chemistry: 'Химия',
    biology: 'Биология'
  };

  // Обновление статуса участника
  const updateParticipantStatus = async (participantId, newStatus) => {
    try {
      const participantRef = doc(db, 'registrations', participantId);
      await updateDoc(participantRef, { status: newStatus });
      await loadParticipants(); // Перезагружаем список
    } catch (err) {
      setError('Ошибка при обновлении статуса');
      console.error(err);
    }
  };

  // Экспорт в Excel
  const exportToExcel = () => {
    // Подготовка данных для экспорта (используем отфильтрованные данные)
    const exportData = filteredParticipants.map(p => ({
      'ID участника': p.participantId || 'Не указан',
      'Фамилия': p.lastName,
      'Имя': p.firstName,
      'Отчество': p.middleName || 'Не указано',
      'Email': p.email,
      'Телефон': p.phone || 'Не указан',
      'Школа': p.school,
      'Регион': p.region,
      'Город': p.city,
      'Класс': `${p.grade} класс`,
      'Предметы': p.subjects.map(s => subjectNames[s]).join(', '),
      'Статус': p.status === 'new' ? 'Новый' : 
                p.status === 'approved' ? 'Подтвержден' : 
                p.status === 'rejected' ? 'Отклонен' : p.status,
      'Дата регистрации': p.createdAt
    }));

    // Создаем новую книгу
    const wb = XLSX.utils.book_new();
    
    // Создаем лист с данными
    const ws = XLSX.utils.json_to_sheet(exportData, { header: Object.keys(exportData[0]) });

    // Устанавливаем ширину колонок
    const colWidths = {
      'A': 15, // Фамилия
      'B': 15, // Имя
      'C': 15, // Отчество
      'D': 25, // Email
      'E': 15, // Телефон
      'F': 30, // Школа
      'G': 20, // Регион
      'H': 15, // Город
      'I': 8,  // Класс
      'J': 30, // Предметы
      'K': 12, // Статус
      'L': 20  // Дата регистрации
    };

    ws['!cols'] = Object.values(colWidths).map(width => ({ width }));

    // Добавляем стили для заголовков
    const headerStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "4472C4" } },
      alignment: { horizontal: "center", vertical: "center", wrapText: true }
    };

    // Применяем стили к заголовкам
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const headerCell = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!ws[headerCell]) continue;
      
      ws[headerCell].s = headerStyle;
    }

    // Добавляем стили для данных
    for (let R = 1; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell = XLSX.utils.encode_cell({ r: R, c: C });
        if (!ws[cell]) continue;

        // Базовые стили для всех ячеек
        const cellStyle = {
          alignment: { vertical: "center", wrapText: true },
          border: {
            top: { style: "thin", color: { rgb: "D9D9D9" } },
            bottom: { style: "thin", color: { rgb: "D9D9D9" } },
            left: { style: "thin", color: { rgb: "D9D9D9" } },
            right: { style: "thin", color: { rgb: "D9D9D9" } }
          }
        };

        // Специальные стили для статуса
        if (C === 10) { // Колонка статуса
          const status = ws[cell].v;
          if (status === 'Новый') {
            cellStyle.fill = { fgColor: { rgb: "FFF2CC" } }; // Светло-желтый
          } else if (status === 'Подтвержден') {
            cellStyle.fill = { fgColor: { rgb: "E2EFDA" } }; // Светло-зеленый
          } else if (status === 'Отклонен') {
            cellStyle.fill = { fgColor: { rgb: "FBE5D6" } }; // Светло-красный
          }
        }

        ws[cell].s = cellStyle;
      }
    }

    // Добавляем лист в книгу
    XLSX.utils.book_append_sheet(wb, ws, 'Участники');

    // Создаем имя файла с текущей датой и примененными фильтрами
    const date = new Date().toLocaleDateString('ru-RU').replace(/\./g, '-');
    let fileName = `Участники_олимпиады_${date}`;
    
    // Добавляем информацию о фильтрах в имя файла
    if (filters.region) fileName += `_${filters.region}`;
    if (filters.city) fileName += `_${filters.city}`;
    if (filters.subjects.length > 0) fileName += `_${filters.subjects.join('_')}`;
    
    fileName += '.xlsx';

    // Сохраняем файл
    XLSX.writeFile(wb, fileName, {
      bookType: 'xlsx',
      bookSST: false,
      type: 'binary',
      cellStyles: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Проверяем обязательные поля
      const requiredFields = ['firstName', 'lastName', 'email', 'school', 'region', 'city', 'grade'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Пожалуйста, заполните все обязательные поля: ${missingFields.join(', ')}`);
      }

      // Проверяем валидность email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Пожалуйста, введите корректный email адрес');
      }

      // Проверяем выбор предметов
      if (formData.subjects.length === 0) {
        throw new Error('Пожалуйста, выберите хотя бы один предмет');
      }

      if (editingParticipant) {
        // Обновление существующего участника
        const participantRef = doc(db, 'registrations', editingParticipant.id);
        await updateDoc(participantRef, {
          ...formData,
          updatedAt: new Date().toISOString()
        });
      } else {
        // Создание нового участника
        await addDoc(collection(db, 'registrations'), {
          ...formData,
          status: 'new',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      // Перезагружаем список участников
      await loadParticipants();
      
      // Закрываем модальное окно
      const modalElement = document.getElementById('editParticipantModal');
      if (modalElement) {
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
        // Удаляем backdrop вручную
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
          backdrop.remove();
        }
        // Убираем класс modal-open с body
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      }
      
      // Очищаем состояние формы
      setEditingParticipant(null);
      setFormData({
        firstName: '',
        lastName: '',
        middleName: '',
        email: '',
        phone: '',
        school: '',
        region: '',
        city: '',
        grade: '',
        subjects: []
      });

    } catch (error) {
      console.error('Ошибка при сохранении данных:', error);
      alert(error.message || 'Произошла ошибка при сохранении данных участника');
    }
  };

  // Обработчик открытия модального окна
  const handleEdit = (participant) => {
    setEditingParticipant(participant);
    // Заполняем форму текущими данными участника
    setFormData({
      firstName: participant.firstName || '',
      lastName: participant.lastName || '',
      middleName: participant.middleName || '',
      email: participant.email || '',
      phone: participant.phone || '',
      school: participant.school || '',
      region: participant.region || '',
      city: participant.city || '',
      grade: participant.grade || '',
      subjects: [...(participant.subjects || [])]
    });

    // Открываем модальное окно
    const modalElement = document.getElementById('editParticipantModal');
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.show();
      } else {
        const newModal = new bootstrap.Modal(modalElement, {
          backdrop: 'static',
          keyboard: false
        });
        newModal.show();
      }
    }
  };

  // Добавляем эффект для обновления городов при изменении региона в форме
  useEffect(() => {
    if (formData.region && !formData.city && regionsData[formData.region]?.length > 0) {
      setFormData(prev => ({
        ...prev,
        city: regionsData[formData.region][0]
      }));
    }
  }, [formData.region]);

  // Добавляем функцию сброса фильтров
  const resetFilters = () => {
    setFilters({
      search: '',
      region: '',
      city: '',
      school: '',
      subjects: []
    });
  };

  // Функция удаления участника
  const handleDelete = async (participantId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого участника?')) {
      return;
    }

    try {
      const participantRef = doc(db, 'registrations', participantId);
      await deleteDoc(participantRef);
      await loadParticipants(); // Перезагружаем список
    } catch (error) {
      console.error('Ошибка при удалении:', error);
      alert('Произошла ошибка при удалении участника');
    }
  };

  if (loading) {
    return (
      <Layout title="Админ панель | Участники">
        <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Загрузка...</span>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <AdminProtected>
      <Layout title="Управление участниками">
        <div className="container-fluid px-4 px-lg-5 py-5">
          <div className="container-xxl">
            {/* Breadcrumbs */}
            <nav aria-label="breadcrumb" className="mb-4">
              <ol className="breadcrumb bg-transparent p-0 mb-0">
                <li className="breadcrumb-item">
                  <Link href="/admin" className="text-decoration-none text-primary">
                    <i className="bi bi-house-door me-1"></i>
                    Админ-панель
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Участники
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
                  <div className="col-md-4">
                    <div className="input-group">
                      <span className="input-group-text bg-transparent border-end-0">
                        <i className="bi bi-search text-muted"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0 ps-0"
                        placeholder="Поиск по имени, фамилии, школе или email..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Регион */}
                  <div className="col-md-2">
                    <select
                      className="form-select form-select-sm border-0 shadow-sm"
                      value={filters.region}
                      onChange={(e) => handleFilterChange('region', e.target.value)}
                    >
                      <option value="">🌍 Все регионы</option>
                      {Object.keys(regionsData).map(region => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                  </div>

                  {/* Город */}
                  <div className="col-md-2">
                    <select
                      className="form-select form-select-sm border-0 shadow-sm"
                      value={filters.city}
                      onChange={(e) => handleFilterChange('city', e.target.value)}
                      disabled={!filters.region}
                    >
                      <option value="">🏢 Все города</option>
                      {filters.region && regionsData[filters.region].map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  {/* Школа */}
                  <div className="col-md-2">
                    <select
                      className="form-select form-select-sm border-0 shadow-sm"
                      value={filters.school}
                      onChange={(e) => handleFilterChange('school', e.target.value)}
                    >
                      <option value="">🏫 Все школы</option>
                      {availableSchools.map(school => (
                        <option key={school} value={school}>{school}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Предметы */}
                <div className="mt-4">
                  <div className="d-flex gap-2 flex-wrap">
                    {subjects.map(subject => (
                      <button
                        key={subject}
                        className={`btn btn-sm ${
                          filters.subjects.includes(subject)
                            ? 'btn-primary shadow-sm'
                            : 'btn-outline-primary'
                        } rounded-pill px-3`}
                        onClick={() => handleSubjectToggle(subject)}
                      >
                        {subjectNames[subject]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Таблица участников */}
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h1 className="h3 mb-0 d-flex align-items-center">
                    <i className="bi bi-people me-3 text-primary"></i>
                    Управление участниками
                  </h1>
                  <button 
                    className="btn btn-success d-flex align-items-center shadow-sm"
                    onClick={exportToExcel}
                  >
                    <i className="bi bi-file-excel me-2"></i>
                    Экспорт в Excel
                  </button>
                </div>

                {error && (
                  <div className="alert alert-danger d-flex align-items-center rounded-3" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                  </div>
                )}

                <div className="table-responsive rounded-3 border">
                  <table className="table table-hover align-middle small mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="fw-semibold">#</th>
                        <th 
                          className="fw-semibold" 
                          style={{ width: '10%', cursor: 'pointer' }}
                          onClick={() => handleSort('participantId')}
                        >
                          <div className="d-flex align-items-center">
                            ID участника
                            {sortConfig.key === 'participantId' && (
                              <i className={`bi bi-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'} ms-1`}></i>
                            )}
                          </div>
                        </th>
                        <th 
                          className="fw-semibold" 
                          style={{ width: '12%', cursor: 'pointer' }}
                          onClick={() => handleSort('lastName')}
                        >
                          <div className="d-flex align-items-center">
                            Фамилия
                            {sortConfig.key === 'lastName' && (
                              <i className={`bi bi-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'} ms-1`}></i>
                            )}
                          </div>
                        </th>
                        <th 
                          className="fw-semibold" 
                          style={{ width: '10%', cursor: 'pointer' }}
                          onClick={() => handleSort('firstName')}
                        >
                          <div className="d-flex align-items-center">
                            Имя
                            {sortConfig.key === 'firstName' && (
                              <i className={`bi bi-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'} ms-1`}></i>
                            )}
                          </div>
                        </th>
                        <th 
                          className="fw-semibold" 
                          style={{ width: '12%', cursor: 'pointer' }}
                          onClick={() => handleSort('middleName')}
                        >
                          <div className="d-flex align-items-center">
                            Отчество
                            {sortConfig.key === 'middleName' && (
                              <i className={`bi bi-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'} ms-1`}></i>
                            )}
                          </div>
                        </th>
                        <th 
                          className="fw-semibold" 
                          style={{ width: '12%', cursor: 'pointer' }}
                          onClick={() => handleSort('email')}
                        >
                          <div className="d-flex align-items-center">
                            Email
                            {sortConfig.key === 'email' && (
                              <i className={`bi bi-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'} ms-1`}></i>
                            )}
                          </div>
                        </th>
                        <th className="fw-semibold" style={{ width: '8%' }}>Телефон</th>
                        <th 
                          className="fw-semibold" 
                          style={{ width: '12%', cursor: 'pointer' }}
                          onClick={() => handleSort('school')}
                        >
                          <div className="d-flex align-items-center">
                            Школа
                            {sortConfig.key === 'school' && (
                              <i className={`bi bi-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'} ms-1`}></i>
                            )}
                          </div>
                        </th>
                        <th 
                          className="fw-semibold" 
                          style={{ width: '8%', cursor: 'pointer' }}
                          onClick={() => handleSort('region')}
                        >
                          <div className="d-flex align-items-center">
                            Регион
                            {sortConfig.key === 'region' && (
                              <i className={`bi bi-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'} ms-1`}></i>
                            )}
                          </div>
                        </th>
                        <th 
                          className="fw-semibold" 
                          style={{ width: '8%', cursor: 'pointer' }}
                          onClick={() => handleSort('city')}
                        >
                          <div className="d-flex align-items-center">
                            Город
                            {sortConfig.key === 'city' && (
                              <i className={`bi bi-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'} ms-1`}></i>
                            )}
                          </div>
                        </th>
                        <th 
                          className="fw-semibold" 
                          style={{ width: '5%', cursor: 'pointer' }}
                          onClick={() => handleSort('grade')}
                        >
                          <div className="d-flex align-items-center">
                            Класс
                            {sortConfig.key === 'grade' && (
                              <i className={`bi bi-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'} ms-1`}></i>
                            )}
                          </div>
                        </th>
                        <th className="fw-semibold" style={{ width: '12%' }}>Предметы</th>
                        <th 
                          className="fw-semibold" 
                          style={{ width: '12%', cursor: 'pointer' }}
                          onClick={() => handleSort('status')}
                        >
                          <div className="d-flex align-items-center">
                            Статус
                            {sortConfig.key === 'status' && (
                              <i className={`bi bi-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'} ms-1`}></i>
                            )}
                          </div>
                        </th>
                        <th className="fw-semibold" style={{ width: '8%' }}>Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="13" className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                              <span className="visually-hidden">Загрузка...</span>
                            </div>
                          </td>
                        </tr>
                      ) : filteredParticipants.length === 0 ? (
                        <tr>
                          <td colSpan="13" className="text-center py-5 text-muted">
                            <i className="bi bi-inbox-fill fs-2 d-block mb-3"></i>
                            Участники не найдены
                          </td>
                        </tr>
                      ) : (
                        currentItems.map((participant, index) => (
                          <tr key={participant.id}>
                            <td>{indexOfFirstItem + index + 1}</td>
                            <td>
                              <span className="badge bg-primary bg-opacity-10 text-primary px-2 py-1 fw-semibold" style={{ fontSize: '0.85rem' }}>
                                {participant.participantId || '—'}
                              </span>
                            </td>
                            <td>{participant.lastName}</td>
                            <td>{participant.firstName}</td>
                            <td>{participant.middleName || '—'}</td>
                            <td>
                              <span className="text-break">{participant.email}</span>
                            </td>
                            <td>{participant.phone || '—'}</td>
                            <td>
                              <span className="text-break">{participant.school}</span>
                            </td>
                            <td>{participant.region}</td>
                            <td>{participant.city}</td>
                            <td>{participant.grade}</td>
                            <td>
                              <div className="d-flex flex-wrap gap-1">
                                {participant.subjects.map(subject => (
                                  <span
                                    key={subject}
                                    className="badge bg-primary bg-opacity-10 text-primary rounded-pill"
                                    style={{ fontSize: '0.7rem' }}
                                  >
                                    {subjectNames[subject]}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td>
                              <select 
                                className={`form-select form-select-sm py-1 ${
                                  participant.status === 'approved' ? 'bg-success-subtle text-success border-success' :
                                  participant.status === 'rejected' ? 'bg-danger-subtle text-danger border-danger' :
                                  'bg-warning-subtle text-warning border-warning'
                                }`}
                                value={participant.status}
                                onChange={(e) => updateParticipantStatus(participant.id, e.target.value)}
                                style={{ fontSize: '0.85rem', fontWeight: '500' }}
                              >
                                <option value="new" className="bg-warning-subtle text-warning">
                                  <i className="bi bi-clock me-1"></i> Новый
                                </option>
                                <option value="approved" className="bg-success-subtle text-success">
                                  <i className="bi bi-check-circle me-1"></i> Подтвержден
                                </option>
                                <option value="rejected" className="bg-danger-subtle text-danger">
                                  <i className="bi bi-x-circle me-1"></i> Отклонен
                                </option>
                              </select>
                            </td>
                            <td>
                              <div className="btn-group btn-group-sm">
                                <button
                                  className="btn btn-outline-primary btn-sm"
                                  onClick={() => handleEdit(participant)}
                                  title="Редактировать"
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => handleDelete(participant.id)}
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

                {/* Пагинация и выбор количества элементов на странице */}
                <div className="d-flex justify-content-between align-items-center mt-4">
                  <div className="d-flex align-items-center">
                    <span className="me-2 text-muted">Показывать по:</span>
                    <select
                      className="form-select form-select-sm border-0 shadow-sm"
                      value={itemsPerPage}
                      onChange={handleItemsPerPageChange}
                      style={{ width: 'auto' }}
                    >
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                  </div>

                  <div className="d-flex align-items-center">
                    <span className="me-3 text-muted small">
                      Показано {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredParticipants.length)} из {filteredParticipants.length}
                    </span>
                    <nav aria-label="Page navigation">
                      <ul className="pagination pagination-sm mb-0">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button
                            className="page-link rounded-start"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            <i className="bi bi-chevron-left"></i>
                          </button>
                        </li>
                        
                        {getPageNumbers().map((pageNumber, index) => (
                          <li 
                            key={index} 
                            className={`page-item ${pageNumber === '...' ? 'disabled' : ''} ${pageNumber === currentPage ? 'active' : ''}`}
                          >
                            <button
                              className="page-link"
                              onClick={() => pageNumber !== '...' && handlePageChange(pageNumber)}
                              disabled={pageNumber === '...'}
                            >
                              {pageNumber}
                            </button>
                          </li>
                        ))}

                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                          <button
                            className="page-link rounded-end"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          >
                            <i className="bi bi-chevron-right"></i>
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Модальное окно редактирования */}
        <div 
          className="modal fade" 
          id="editParticipantModal" 
          tabIndex="-1" 
          aria-labelledby="editParticipantModalLabel" 
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header py-3 px-4">
                <h5 className="modal-title" id="editParticipantModalLabel">
                  {editingParticipant ? 'Редактирование участника' : 'Создание участника'}
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
                  <div className="row g-4">
                    <div className="col-md-4">
                      <label className="form-label">Фамилия</label>
                      <input
                        type="text"
                        className="form-control"
                        name="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Имя</label>
                      <input
                        type="text"
                        className="form-control"
                        name="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Отчество</label>
                      <input
                        type="text"
                        className="form-control"
                        name="middleName"
                        value={formData.middleName || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, middleName: e.target.value }))}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Телефон</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="phone"
                        value={formData.phone || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Школа</label>
                      <input
                        type="text"
                        className="form-control"
                        name="school"
                        value={formData.school}
                        onChange={(e) => setFormData(prev => ({ ...prev, school: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Регион</label>
                      <select
                        className="form-select"
                        name="region"
                        value={formData.region}
                        onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
                        required
                      >
                        <option value="">Выберите регион</option>
                        {Object.keys(regionsData).map(region => (
                          <option key={region} value={region}>{region}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Город</label>
                      <select
                        className="form-select"
                        name="city"
                        value={formData.city}
                        onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                        required
                        disabled={!formData.region}
                      >
                        <option value="">Выберите город</option>
                        {formData.region && regionsData[formData.region].map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Класс</label>
                      <select
                        className="form-select"
                        name="grade"
                        value={formData.grade}
                        onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                        required
                      >
                        <option value="">Выберите класс</option>
                        {['4', '5', '6', '7', '8', '9', '10', '11'].map(grade => (
                          <option key={grade} value={grade}>{grade}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label">Предметы</label>
                      <div className="d-flex gap-2 flex-wrap">
                        {subjects.map(subject => (
                          <button
                            key={subject}
                            type="button"
                            className={`btn btn-sm ${
                              formData.subjects.includes(subject)
                                ? 'btn-primary'
                                : 'btn-outline-primary'
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              setFormData(prev => ({
                                ...prev,
                                subjects: prev.subjects.includes(subject)
                                  ? prev.subjects.filter(s => s !== subject)
                                  : [...prev.subjects, subject]
                              }));
                            }}
                          >
                            {subjectNames[subject]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer py-3 px-4">
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
                    {editingParticipant ? 'Сохранить' : 'Создать'}
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