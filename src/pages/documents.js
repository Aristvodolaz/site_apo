import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import DocumentCard from '../components/DocumentCard';
import { db } from '../lib/firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import Head from 'next/head';

export default function Documents() {
  // State for category filter
  const [activeCategory, setActiveCategory] = useState('all');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  
  // Загрузка документов из Firebase
  useEffect(() => {
    async function fetchDocuments() {
      try {
        setLoading(true);
        setError(null);
        
        const docsRef = collection(db, 'documents');
        const snapshot = await getDocs(docsRef);
        
        if (snapshot.empty) {
          setDocuments([]);
          setLoading(false);
          return;
        }
        
        const docsArray = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setDocuments(docsArray);
      } catch (err) {
        console.error("Ошибка при загрузке документов:", err);
        setError("Не удалось загрузить документы. Пожалуйста, попробуйте позже.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchDocuments();
  }, []);
  
  // Функция получения названия категории
  function getCategoryTitle(categoryId) {
    const categories = {
      'all': 'Все документы',
      'official': 'Официальные документы',
      'main': 'Основные документы',
      'subjects': 'Документы по предметам',
      'additional': 'Дополнительные документы'
    };
    
    return categories[categoryId] || 'Документы';
  }

  // Filter documents based on active category and search term
  const getFilteredDocs = () => {
    let filtered = documents;
    
    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(doc => doc.category === activeCategory);
    }
    
    // Filter by search term
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(term) || 
        doc.description.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  };

  // Categories for filter
  const categories = [
    { id: 'all', name: 'Все документы', icon: 'folder2-open' },
    { id: 'official', name: 'Официальные', icon: 'journal-check' },
    { id: 'main', name: 'Основные', icon: 'file-earmark-text' },
    { id: 'subjects', name: 'По предметам', icon: 'book' },
    { id: 'additional', name: 'Дополнительные', icon: 'info-circle' }
  ];

  // Toggle mobile filters
  const toggleMobileFilters = () => {
    setShowFiltersMobile(!showFiltersMobile);
  };

  // UI компонента
  return (
    <Layout>
      <Head>
        <title>Документы | Арктическая олимпиада</title>
        <meta 
          name="description" 
          content="Официальные документы, положения и методические материалы Арктической олимпиады «Полярный круг»"
        />
      </Head>
      
      <PageHeader 
        title="Официальные документы" 
        subtitle="Положения, регламенты и информационные материалы Арктической олимпиады «Полярный круг»"
      />
      
      <div className="doc-section-bg">
        <div className="container py-4">
          <div className="row">
            <div className="col-lg-10 mx-auto">
              {/* Диагностика */}
              {error && (
                <div className="alert alert-danger alert-dismissible fade show mb-4 shadow-sm rounded-4" role="alert">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-exclamation-triangle-fill fs-4 me-2"></i>
                    <div>
                      <strong>Ошибка загрузки данных!</strong> {error}
                    </div>
                  </div>
                  <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
              )}

              {/* Поиск и мобильный фильтр */}
              <div className="search-filter-container mb-4 fade-in">
                <div className="row align-items-center">
                  <div className="col-md-7 mb-3 mb-md-0">
                    <div className="search-container mb-3 mb-md-0">
                      <i className="bi bi-search search-icon"></i>
                      <input 
                        type="text" 
                        className="form-control form-control-lg search-input" 
                        placeholder="Поиск по документам..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      {searchTerm && (
                        <button 
                          className="btn btn-link search-clear-btn"
                          onClick={() => setSearchTerm('')}
                        >
                          <i className="bi bi-x-circle"></i>
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="col-md-5">
                    <div className="d-md-none">
                      <button 
                        className="btn btn-outline-primary filter-toggle-btn"
                        onClick={toggleMobileFilters}
                      >
                        <i className="bi bi-funnel me-1"></i>
                        Фильтры
                        <span className="badge bg-primary rounded-pill ms-2">{getFilteredDocs().length}</span>
                      </button>
                    </div>
                    <div className="document-count d-none d-md-flex align-items-center justify-content-md-end">
                      <span className="text-muted me-2">Найдено:</span>
                      <span className="document-count-number">{getFilteredDocs().length}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                {/* Фильтры категорий - десктоп */}
                <div className="col-md-3 mb-4 mb-md-0">
                  <div className="filters-sidebar fade-in d-none d-md-block">
                    <h4 className="filters-title">Категории</h4>
                    <ul className="category-list">
                      {categories.map(category => (
                        <li 
                          key={category.id}
                          className={`category-item ${activeCategory === category.id ? 'active' : ''}`}
                          onClick={() => setActiveCategory(category.id)}
                        >
                          <i className={`bi bi-${category.icon}`}></i>
                          <span className="category-name">{category.name}</span>
                          {activeCategory === category.id && <i className="bi bi-check2 ms-auto"></i>}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Фильтры категорий - мобильные */}
                <div className={`mobile-filters-container ${showFiltersMobile ? 'show' : ''}`}>
                  <div className="mobile-filters-header">
                    <h4 className="mb-0">Категории</h4>
                    <button 
                      className="btn btn-sm btn-link text-dark"
                      onClick={toggleMobileFilters}
                    >
                      <i className="bi bi-x-lg"></i>
                    </button>
                  </div>
                  <ul className="category-list">
                    {categories.map(category => (
                      <li 
                        key={category.id}
                        className={`category-item ${activeCategory === category.id ? 'active' : ''}`}
                        onClick={() => {
                          setActiveCategory(category.id);
                          setShowFiltersMobile(false);
                        }}
                      >
                        <i className={`bi bi-${category.icon}`}></i>
                        <span className="category-name">{category.name}</span>
                        {activeCategory === category.id && <i className="bi bi-check2 ms-auto"></i>}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Затемнение для мобильного фильтра */}
                {showFiltersMobile && (
                  <div className="filter-backdrop" onClick={toggleMobileFilters}></div>
                )}

                {/* Загрузка и отображение документов */}
                <div className="col-md-9">
                  {loading ? (
                    <div className="text-center py-5 fade-in">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Загрузка...</span>
                      </div>
                      <p className="mt-3">Загрузка документов...</p>
                    </div>
                  ) : (
                    <div className="fade-in">
                      <h2 className="side-bordered-header mb-4">
                        {getCategoryTitle(activeCategory)}
                      </h2>
                      
                      {getFilteredDocs().length > 0 ? (
                        <div className="documents-grid">
                          {getFilteredDocs().map((doc) => (
                            <DocumentCard
                              key={doc.id}
                              title={doc.title}
                              description={doc.description}
                              url={doc.url}
                              category={doc.category}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="card shadow-sm border-0 rounded-4 p-4 text-center">
                          <div className="card-body p-4">
                            <div className="empty-state-icon">
                              <i className="bi bi-file-earmark-text"></i>
                            </div>
                            <h3 className="h4 mb-3">Документы не найдены</h3>
                            <p className="text-muted mb-4">
                              {searchTerm 
                                ? 'По вашему запросу ничего не найдено. Попробуйте изменить запрос или выбрать другую категорию.' 
                                : 'В выбранной категории пока нет документов.'}
                            </p>
                            <div className="d-flex gap-3 justify-content-center">
                              {searchTerm && (
                                <button 
                                  className="btn btn-outline-secondary"
                                  onClick={() => setSearchTerm('')}
                                >
                                  Очистить поиск
                                </button>
                              )}
                              <button 
                                className="btn btn-primary"
                                onClick={() => setActiveCategory('all')}
                              >
                                Показать все документы
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Информация о документах */}
                  {!loading && getFilteredDocs().length > 0 && (
                    <div className="alert alert-info mt-4 mb-0 border-0 shadow-sm rounded-4 fade-in">
                      <div className="d-flex py-2">
                        <div className="me-3">
                          <i className="bi bi-info-circle-fill fs-3"></i>
                        </div>
                        <div>
                          <h5 className="alert-heading mb-2">Информация о документах</h5>
                          <p className="mb-0">
                            Все официальные документы Арктической олимпиады «Полярный круг» представлены в формате PDF. 
                            Если у вас возникли вопросы по документам, пожалуйста, свяжитесь с нами по адресу{' '}
                            <a href="mailto:info@arctolymp.ru" className="alert-link">
                              info@arctolymp.ru
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 