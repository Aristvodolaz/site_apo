import { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import WinnerWorkCard from '../components/WinnerWorkCard';
import { winnersWorksService } from '../lib/firebaseService';
import Head from 'next/head';

export default function Winners() {
  const [works, setWorks] = useState([]);
  const [filteredWorks, setFilteredWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSubject, setActiveSubject] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Состояния для пагинации
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);

  // Предметы с иконками и цветами в стиле сайта
  const subjects = [
    { id: 'all', name: 'Все предметы', icon: 'collection', color: 'primary' },
    { id: 'математика', name: 'Математика', icon: 'calculator', color: 'primary' },
    { id: 'физика', name: 'Физика', icon: 'lightning', color: 'warning' },
    { id: 'химия', name: 'Химия', icon: 'droplet-fill', color: 'success' },
    { id: 'биология', name: 'Биология', icon: 'tree', color: 'info' }
  ];

  // Загрузка работ из Firebase
  useEffect(() => {
    async function fetchWorks() {
      try {
        setLoading(true);
        setError(null);
        
        const data = await winnersWorksService.getAllWinnersWorks();
        console.log('Winners works loaded:', data?.length || 0);
        
        if (data && Array.isArray(data)) {
          setWorks(data);
          setFilteredWorks(data);
        } else {
          console.error('Invalid works data format:', data);
          setError('Данные работ имеют неверный формат.');
        }
      } catch (err) {
        console.error("Ошибка при загрузке работ:", err);
        setError("Не удалось загрузить данные работ. Пожалуйста, попробуйте позже.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchWorks();
  }, []);
  
  // Функция фильтрации
  const filterWorks = useCallback((term = searchTerm, subject = activeSubject) => {
    let filtered = [...works];
    
    // Фильтр по поисковому запросу
    if (term.trim() !== '') {
      const termLower = term.toLowerCase().trim();
      filtered = filtered.filter(work => 
        (work.title && work.title.toLowerCase().includes(termLower)) || 
        (work.author && work.author.toLowerCase().includes(termLower))
      );
    }
    
    // Фильтр по предмету
    if (subject !== 'all') {
      filtered = filtered.filter(work => 
        work.subject && work.subject.toLowerCase() === subject.toLowerCase()
      );
    }
    
    setFilteredWorks(filtered);
    setCurrentPage(1);
  }, [works, searchTerm, activeSubject]);
  
  // Обработка поиска
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterWorks(term, activeSubject);
  };
  
  // Обработка фильтрации по предмету
  const handleSubjectFilter = useCallback((subject) => {
    setActiveSubject(subject);
    filterWorks(searchTerm, subject);
    setShowFilters(false);
  }, [searchTerm, filterWorks]);
  
  // Сброс всех фильтров
  const resetFilters = () => {
    setSearchTerm('');
    setActiveSubject('all');
    setCurrentPage(1);
    setFilteredWorks(works);
  };

  // Вычисляем текущие элементы для отображения
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredWorks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredWorks.length / itemsPerPage);

  // Обработка смены страницы
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Генерация номеров страниц
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 5;
    
    if (totalPages <= maxPageButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  // Статистика по предметам
  const getSubjectStats = () => {
    return subjects.map(subject => ({
      ...subject,
      count: subject.id === 'all' ? works.length : works.filter(work => 
        work.subject && work.subject.toLowerCase() === subject.id.toLowerCase()
      ).length
    }));
  };

  if (loading) {
    return (
      <Layout title="Работы победителей и призеров">
        <PageHeader 
          title="Работы победителей и призеров" 
          subtitle="Лучшие работы участников Арктической олимпиады по всем предметам"
        />
        <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Загрузка...</span>
            </div>
            <p className="mt-3 text-muted">Загружаем работы...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Работы победителей и призеров">
        <PageHeader 
          title="Работы победителей и призеров" 
          subtitle="Лучшие работы участников Арктической олимпиады по всем предметам"
        />
        <div className="container py-5">
          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Работы победителей и призеров">
      <Head>
        <title>Работы победителей и призеров | Арктическая олимпиада</title>
        <meta name="description" content="Работы победителей и призеров Арктической олимпиады по математике, физике, химии и биологии" />
      </Head>

      <PageHeader 
        title="Работы победителей и призеров" 
        subtitle="Лучшие работы участников Арктической олимпиады по всем предметам"
      />

      {/* Волновой эффект */}
      <div className="winners-wave-container">
        <div className="winners-wave"></div>
      </div>

      <div className="container py-5">
        {/* Статистика */}
        <div className="row g-4 mb-5">
          {getSubjectStats().map((subject, index) => (
            <div key={subject.id} className="col-md-6 col-lg-3">
              <div className="winners-stat-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="winners-stat-decoration"></div>
                <div className="winners-stat-content">
                  <div className="winners-stat-icon-wrapper">
                    <i className={`bi bi-${subject.icon} winners-stat-icon`}></i>
                  </div>
                  <div className="winners-stat-info">
                    <h3 className="winners-stat-number">{subject.count}</h3>
                    <p className="winners-stat-label">{subject.name}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Поиск и фильтры */}
        <div className="winners-search-container mb-5">
          <div className="row">
            <div className="col-lg-8">
              {/* Поиск */}
              <div className="winners-search-wrapper mb-4">
                <div className="position-relative">
                  <i className="bi bi-search winners-search-icon"></i>
                  <input
                    type="text"
                    className="form-control winners-search-input"
                    placeholder="Поиск по названию или автору..."
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                  {searchTerm && (
                    <button
                      className="btn winners-search-clear"
                      onClick={() => {
                        setSearchTerm('');
                        filterWorks('', activeSubject);
                      }}
                      type="button"
                    >
                      <i className="bi bi-x"></i>
                    </button>
                  )}
                </div>
              </div>

              {/* Мобильная кнопка фильтров */}
              <div className="d-lg-none mb-3">
                <button
                  className="btn btn-outline-primary winners-filter-toggle"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <i className="bi bi-funnel me-2"></i>
                  Фильтры
                  <i className={`bi bi-chevron-${showFilters ? 'up' : 'down'} ms-2`}></i>
                </button>
              </div>

              {/* Результаты поиска */}
              <div className="winners-results-info mb-4">
                <div className="winners-count">
                  <span className="winners-count-number">{filteredWorks.length}</span>
                  <span className="winners-count-text">
                    {filteredWorks.length === 1 ? 'работа найдена' : 
                     filteredWorks.length < 5 ? 'работы найдено' : 'работ найдено'}
                  </span>
                </div>
                {(searchTerm || activeSubject !== 'all') && (
                  <button
                    className="btn winners-reset-btn"
                    onClick={resetFilters}
                  >
                    <i className="bi bi-x-circle me-1"></i>
                    Сбросить фильтры
                  </button>
                )}
              </div>
            </div>

            {/* Боковая панель фильтров */}
            <div className="col-lg-4">
              <div className={`winners-filters-sidebar ${showFilters ? 'show' : ''}`}>
                <div className="winners-filters-header">
                  <h5 className="winners-filters-title">Фильтр по предметам</h5>
                  <div className="winners-filters-decoration"></div>
                </div>
                <div className="winners-subjects-filter">
                  {subjects.map((subject) => (
                    <button
                      key={subject.id}
                      className={`winners-filter-btn ${
                        activeSubject === subject.id ? 'active' : ''
                      }`}
                      onClick={() => handleSubjectFilter(subject.id)}
                      data-color={subject.color}
                    >
                      <div className="winners-filter-btn-content">
                        <i className={`bi bi-${subject.icon} winners-filter-icon`}></i>
                        <span className="winners-filter-name">{subject.name}</span>
                        <span className="winners-filter-count">
                          {works.filter(work => 
                            subject.id === 'all' || 
                            (work.subject && work.subject.toLowerCase() === subject.id.toLowerCase())
                          ).length}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Список работ */}
        {filteredWorks.length === 0 ? (
          <div className="winners-empty-state">
            <div className="winners-empty-icon">
              <i className="bi bi-search"></i>
            </div>
            <h4 className="winners-empty-title">Работы не найдены</h4>
            <p className="winners-empty-text">
              Попробуйте изменить параметры поиска или фильтры
            </p>
            <button
              className="btn btn-primary winners-empty-btn"
              onClick={resetFilters}
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              Сбросить фильтры
            </button>
          </div>
        ) : (
          <>
            {/* Сетка работ */}
            <div className="winners-grid mb-5">
              {currentItems.map((work, index) => (
                <div key={work.id || index} className="winners-grid-item">
                  <WinnerWorkCard
                    title={work.title}
                    author={work.author}
                    subject={work.subject}
                    grade={work.grade}
                    year={work.year}
                    description={work.description}
                    file_url={work.file_url}
                    award_type={work.award_type}
                  />
                </div>
              ))}
            </div>

            {/* Пагинация */}
            {totalPages > 1 && (
              <nav aria-label="Пагинация работ" className="winners-pagination-wrapper">
                <ul className="pagination justify-content-center winners-pagination">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <i className="bi bi-chevron-left"></i>
                    </button>
                  </li>
                  
                  {getPageNumbers().map((pageNumber, index) => (
                    <li key={index} className={`page-item ${
                      pageNumber === currentPage ? 'active' : ''
                    } ${pageNumber === '...' ? 'disabled' : ''}`}>
                      {pageNumber === '...' ? (
                        <span className="page-link">...</span>
                      ) : (
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(pageNumber)}
                        >
                          {pageNumber}
                        </button>
                      )}
                    </li>
                  ))}
                  
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <i className="bi bi-chevron-right"></i>
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </>
        )}
      </div>
    </Layout>
  );
} 