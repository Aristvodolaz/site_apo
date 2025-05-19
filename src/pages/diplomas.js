import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import DiplomaCard from '../components/DiplomaCard';
import { diplomasService } from '../lib/firebaseService';
import Head from 'next/head';

export default function Diplomas() {
  const [diplomas, setDiplomas] = useState([]);
  const [filteredDiplomas, setFilteredDiplomas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('all'); // 'all', 'fio', 'number'
  const [activeSubject, setActiveSubject] = useState('all');
  
  // Добавляем состояния для пагинации
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Предметы с иконками
  const subjectIcons = {
    'all': 'bi-collection',
    'математика': 'bi-calculator',
    'физика': 'bi-lightning',
    'химия': 'bi-droplet-fill',
    'биология': 'bi-tree'
  };
  
  // Названия предметов
  const subjectNames = {
    'all': 'Все предметы',
    'математика': 'Математика',
    'физика': 'Физика', 
    'химия': 'Химия',
    'биология': 'Биология'
  };
  
  // Загрузка дипломов из Firebase
  useEffect(() => {
    async function fetchDiplomas() {
      try {
        setLoading(true);
        setError(null);
        
        const data = await diplomasService.getAllDiplomas();
        console.log('Diplomas loaded:', data?.length || 0);
        
        if (data && Array.isArray(data)) {
          setDiplomas(data);
          setFilteredDiplomas(data);
        } else {
          console.error('Invalid diplomas data format:', data);
          setError('Данные дипломов имеют неверный формат.');
        }
      } catch (err) {
        console.error("Ошибка при загрузке дипломов:", err);
        setError("Не удалось загрузить данные дипломов. Пожалуйста, попробуйте позже.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchDiplomas();
  }, []);
  
  // Функция фильтрации
  const filterDiplomas = (term = searchTerm, subject = activeSubject, searchType = searchBy) => {
    let filtered = [...diplomas];
    
    // Фильтр по поисковому запросу
    if (term.trim() !== '') {
      const termLower = term.toLowerCase().trim();
      
      if (searchType === 'fio') {
        filtered = filtered.filter(diploma => 
          diploma.fio && diploma.fio.toLowerCase().includes(termLower)
        );
      } else if (searchType === 'number') {
        filtered = filtered.filter(diploma => 
          diploma.number && diploma.number.toLowerCase().includes(termLower)
        );
      } else {
        filtered = filtered.filter(diploma => 
          (diploma.fio && diploma.fio.toLowerCase().includes(termLower)) || 
          (diploma.number && diploma.number.toLowerCase().includes(termLower))
        );
      }
    }
    
    // Фильтр по предмету
    if (subject !== 'all') {
      filtered = filtered.filter(diploma => 
        diploma.subject && diploma.subject.toLowerCase() === subject.toLowerCase()
      );
    }
    
    setFilteredDiplomas(filtered);
  };
  
  // Обработка поиска
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setCurrentPage(1); // Сброс на первую страницу при новом поиске
    filterDiplomas(term, activeSubject, searchBy);
  };
  
  // Обработка фильтрации по предмету
  const handleSubjectFilter = (subject) => {
    setActiveSubject(subject);
    filterDiplomas(searchTerm, subject, searchBy);
  };
  
  // Обработка изменения типа поиска
  const handleSearchTypeChange = (type) => {
    setSearchBy(type);
    filterDiplomas(searchTerm, activeSubject, type);
  };
  
  // Сброс всех фильтров
  const resetFilters = () => {
    setSearchTerm('');
    setSearchBy('all');
    setActiveSubject('all');
    setCurrentPage(1);
    setFilteredDiplomas(diplomas);
  };

  // Группировка дипломов по классам
  const groupedDiplomas = filteredDiplomas.reduce((acc, diploma) => {
    const grade = diploma.grade || 'Другие';
    if (!acc[grade]) {
      acc[grade] = [];
    }
    acc[grade].push(diploma);
    return acc;
  }, {});

  // Сортировка классов для отображения
  const sortedGrades = Object.keys(groupedDiplomas).sort((a, b) => {
    if (a === 'Другие') return 1;
    if (b === 'Другие') return -1;
    return parseInt(a) - parseInt(b);
  });

  // Вычисляем текущие элементы для отображения
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDiplomas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDiplomas.length / itemsPerPage);

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

  return (
    <Layout>
      <Head>
        <title>Дипломы | Арктическая олимпиада</title>
        <meta 
          name="description" 
          content="Поиск дипломов победителей и призеров Арктической олимпиады «Полярный круг»"
        />
      </Head>
      
      <div className="diplomas-page">
        <div className="page-header">
          <PageHeader 
            title="Дипломы" 
            subtitle="Поиск и просмотр дипломов победителей и призеров Арктической олимпиады «Полярный круг»"
          />
        </div>

        <div className="content-wrapper">
          <div className="container">
            <div className="search-section">
              <div className="search-card">
                <div className="search-header">
                  <div className="search-title">
                    <i className="bi bi-search"></i>
                    <h2>Поиск диплома</h2>
                  </div>
                  {(searchTerm || activeSubject !== 'all' || searchBy !== 'all') && (
                    <button 
                      className="reset-button"
                      onClick={resetFilters}
                    >
                      <i className="bi bi-arrow-counterclockwise"></i>
                      <span>Сбросить фильтры</span>
                    </button>
                  )}
                </div>

                <div className="search-controls">
                  <div className="search-input-group">
                    <div className="search-input-wrapper">
                      <i className="bi bi-search"></i>
                      <input 
                        type="text" 
                        placeholder={
                          searchBy === 'fio' ? "Введите ФИО участника..." :
                          searchBy === 'number' ? "Введите номер диплома..." :
                          "Поиск по ФИО или номеру диплома..."
                        }
                        value={searchTerm}
                        onChange={handleSearch}
                      />
                      {searchTerm && (
                        <button 
                          className="clear-button"
                          onClick={() => {
                            setSearchTerm('');
                            filterDiplomas('', activeSubject, searchBy);
                          }}
                        >
                          <i className="bi bi-x-lg"></i>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="search-type-selector">
                    <button 
                      className={`type-button ${searchBy === 'all' ? 'active' : ''}`}
                      onClick={() => handleSearchTypeChange('all')}
                    >
                      <i className="bi bi-search"></i>
                      <span>Везде</span>
                    </button>
                    <button 
                      className={`type-button ${searchBy === 'fio' ? 'active' : ''}`}
                      onClick={() => handleSearchTypeChange('fio')}
                    >
                      <i className="bi bi-person"></i>
                      <span>По ФИО</span>
                    </button>
                    <button 
                      className={`type-button ${searchBy === 'number' ? 'active' : ''}`}
                      onClick={() => handleSearchTypeChange('number')}
                    >
                      <i className="bi bi-hash"></i>
                      <span>По номеру</span>
                    </button>
                  </div>

                  <div className="subject-filter">
                    {Object.entries(subjectNames).map(([value, label]) => (
                      <button
                        key={value}
                        className={`subject-button ${activeSubject === value ? 'active' : ''}`}
                        onClick={() => handleSubjectFilter(value)}
                      >
                        <i className={`bi ${subjectIcons[value] || 'bi-book'}`}></i>
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="results-section">
              <div className="results-header">
                <div className="results-info">
                  <div className="results-count">
                    <h3>Найденные дипломы</h3>
                    <span className="count-badge">{filteredDiplomas.length}</span>
                  </div>
                  {filteredDiplomas.length !== diplomas.length && (
                    <div className="total-count">
                      Всего в базе: {diplomas.length}
                    </div>
                  )}
                </div>
                {filteredDiplomas.length > 0 && (
                  <div className="page-info">
                    Показано {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredDiplomas.length)} из {filteredDiplomas.length}
                  </div>
                )}
              </div>

              {loading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Загрузка дипломов...</p>
                </div>
              ) : error ? (
                <div className="error-state">
                  <i className="bi bi-exclamation-triangle-fill"></i>
                  <h4>Ошибка загрузки данных</h4>
                  <p>{error}</p>
                </div>
              ) : filteredDiplomas.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <i className="bi bi-search"></i>
                  </div>
                  <h3>Дипломы не найдены</h3>
                  <p>
                    По вашему запросу ничего не найдено. Попробуйте изменить параметры поиска.
                  </p>
                  <button className="primary-button" onClick={resetFilters}>
                    <i className="bi bi-arrow-counterclockwise"></i>
                    Сбросить фильтры
                  </button>
                </div>
              ) : (
                <>
                  <div className="diplomas-list">
                    {currentItems.map((diploma) => (
                      <DiplomaCard
                        key={diploma.id || `${diploma.fio}-${diploma.number}`}
                        fio={diploma.fio}
                        number={diploma.number}
                        status={diploma.status}
                        subject={diploma.subject}
                      />
                    ))}
                  </div>

                  {filteredDiplomas.length > itemsPerPage && (
                    <div className="pagination-section">
                      <div className="pagination-controls">
                        <button 
                          className="page-button"
                          disabled={currentPage === 1}
                          onClick={() => handlePageChange(1)}
                        >
                          <i className="bi bi-chevron-double-left"></i>
                        </button>
                        
                        <button 
                          className="page-button"
                          disabled={currentPage === 1}
                          onClick={() => handlePageChange(currentPage - 1)}
                        >
                          <i className="bi bi-chevron-left"></i>
                        </button>
                        
                        <div className="page-numbers">
                          {getPageNumbers().map((number, index) => (
                            number === '...' ? (
                              <span key={`ellipsis-${index}`} className="page-ellipsis">...</span>
                            ) : (
                              <button
                                key={number}
                                className={`page-button ${currentPage === number ? 'active' : ''}`}
                                onClick={() => handlePageChange(number)}
                              >
                                {number}
                              </button>
                            )
                          ))}
                        </div>
                        
                        <button 
                          className="page-button"
                          disabled={currentPage === Math.ceil(filteredDiplomas.length / itemsPerPage)}
                          onClick={() => handlePageChange(currentPage + 1)}
                        >
                          <i className="bi bi-chevron-right"></i>
                        </button>
                        
                        <button 
                          className="page-button"
                          disabled={currentPage === totalPages}
                          onClick={() => handlePageChange(totalPages)}
                        >
                          <i className="bi bi-chevron-double-right"></i>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .diplomas-page {
          min-height: 100vh;
          background: linear-gradient(180deg, #f7fafc 0%, #edf2f7 100%);
        }

        .page-header {
          background: white;
          padding: 2rem 0;
          border-bottom: 1px solid #e2e8f0;
          margin-bottom: 2rem;
        }

        .content-wrapper {
          padding: 0 1rem 3rem;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .search-section {
          margin-bottom: 2rem;
        }

        .search-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          padding: 2rem;
          border: 1px solid #e2e8f0;
        }

        .search-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .search-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #2d3748;
        }

        .search-title i {
          font-size: 1.5rem;
          color: #4a5568;
        }

        .search-title h2 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .reset-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border: none;
          background: #edf2f7;
          color: #4a5568;
          border-radius: 8px;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .reset-button:hover {
          background: #e2e8f0;
        }

        .search-controls {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .search-input-group {
          position: relative;
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-input-wrapper i {
          position: absolute;
          left: 1.25rem;
          color: #a0aec0;
          font-size: 1.125rem;
        }

        .search-input-wrapper input {
          width: 100%;
          padding: 1rem 3rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.2s;
          color: #2d3748;
        }

        .search-input-wrapper input:focus {
          outline: none;
          border-color: #4299e1;
          box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
        }

        .search-input-wrapper input::placeholder {
          color: #a0aec0;
        }

        .clear-button {
          position: absolute;
          right: 1.25rem;
          background: none;
          border: none;
          padding: 0.5rem;
          margin: -0.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #a0aec0;
          transition: all 0.2s ease;
          border-radius: 50%;
        }

        .clear-button:hover {
          background-color: #f7fafc;
          color: #4a5568;
        }

        .clear-button i {
          font-size: 1rem;
          position: static;
          display: block;
        }

        .search-type-selector {
          display: flex;
          gap: 0.75rem;
        }

        .type-button {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.875rem;
          background: #edf2f7;
          border: none;
          border-radius: 10px;
          color: #4a5568;
          font-size: 0.9375rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .type-button:hover {
          background: #e2e8f0;
        }

        .type-button.active {
          background: #4299e1;
          color: white;
        }

        .subject-filter {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .subject-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          color: #4a5568;
          font-size: 0.9375rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .subject-button:hover {
          border-color: #4299e1;
          color: #4299e1;
        }

        .subject-button.active {
          background: #4299e1;
          border-color: #4299e1;
          color: white;
        }

        .results-section {
          background: white;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          padding: 2rem;
          border: 1px solid #e2e8f0;
        }

        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }

        .results-info {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .results-count {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .results-count h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #2d3748;
        }

        .count-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 28px;
          height: 28px;
          padding: 0 0.75rem;
          background: #4299e1;
          color: white;
          border-radius: 14px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .total-count {
          color: #718096;
          font-size: 0.875rem;
        }

        .page-info {
          color: #718096;
          font-size: 0.875rem;
        }

        .diplomas-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .pagination-section {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #e2e8f0;
        }

        .pagination-controls {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
        }

        .page-numbers {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .page-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          background: white;
          color: #4a5568;
          font-size: 0.9375rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .page-button:hover:not(:disabled) {
          border-color: #4299e1;
          color: #4299e1;
        }

        .page-button.active {
          background: #4299e1;
          border-color: #4299e1;
          color: white;
        }

        .page-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .page-ellipsis {
          color: #718096;
          width: 40px;
          text-align: center;
        }

        .loading-state,
        .error-state,
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          text-align: center;
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 4px solid rgba(66, 153, 225, 0.1);
          border-left-color: #4299e1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1.5rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .error-state i {
          font-size: 3rem;
          color: #e53e3e;
          margin-bottom: 1rem;
        }

        .error-state h4 {
          margin: 0 0 0.5rem;
          color: #e53e3e;
          font-size: 1.25rem;
        }

        .error-state p {
          color: #718096;
          max-width: 400px;
          margin: 0;
        }

        .empty-icon {
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #edf2f7;
          border-radius: 50%;
          font-size: 2rem;
          color: #718096;
          margin-bottom: 1.5rem;
        }

        .empty-state h3 {
          margin: 0 0 0.75rem;
          color: #2d3748;
          font-size: 1.25rem;
        }

        .empty-state p {
          color: #718096;
          max-width: 400px;
          margin: 0 0 1.5rem;
        }

        .primary-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: #4299e1;
          border: none;
          border-radius: 10px;
          color: white;
          font-size: 0.9375rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .primary-button:hover {
          background: #3182ce;
        }

        @media (max-width: 768px) {
          .search-card,
          .results-section {
            padding: 1.5rem;
            border-radius: 16px;
          }

          .search-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .search-type-selector {
            flex-direction: column;
          }

          .subject-filter {
            justify-content: flex-start;
          }

          .results-header {
            flex-direction: column;
            gap: 1rem;
          }

          .page-numbers {
            display: none;
          }

          .page-button {
            width: 36px;
            height: 36px;
          }
        }
      `}</style>
    </Layout>
  );
} 