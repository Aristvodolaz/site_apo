import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import DocumentCard from '../components/DocumentCard';
import { documentsData } from '../data/documentsData';
import { useState } from 'react';
import Head from 'next/head';

export default function Documents() {
  // State for category filter
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Group documents by category
  const officialDocs = documentsData.filter(doc => doc.category === 'official');
  const mainDocs = documentsData.filter(doc => doc.category === 'main');
  const subjectDocs = documentsData.filter(doc => doc.category === 'subjects');
  const additionalDocs = documentsData.filter(doc => doc.category === 'additional');

  // Filter documents based on active category
  const getFilteredDocs = () => {
    if (activeCategory === 'all') return documentsData;
    return documentsData.filter(doc => doc.category === activeCategory);
  };

  // Categories for filter
  const categories = [
    { id: 'all', name: 'Все документы' },
    { id: 'official', name: 'Официальные' },
    { id: 'main', name: 'Основные' },
    { id: 'subjects', name: 'По предметам' },
    { id: 'additional', name: 'Дополнительные' }
  ];

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
      
      <div className="container mb-5">
        <div className="row">
          <div className="col-lg-9 mx-auto">
            {/* Диагностика */}
            {error && (
              <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
                <strong>Ошибка загрузки данных!</strong> {error}
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
              </div>
            )}

            {/* Фильтры категорий */}
            <div className="mb-5 fade-in">
              <div className="filters-container">
                <button 
                  className={`filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('all')}
                >
                  Все документы
                </button>
                <button 
                  className={`filter-btn ${activeCategory === 'main' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('main')}
                >
                  Основные
                </button>
                <button 
                  className={`filter-btn ${activeCategory === 'subjects' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('subjects')}
                >
                  По предметам
                </button>
                <button 
                  className={`filter-btn ${activeCategory === 'official' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('official')}
                >
                  Официальные
                </button>
                <button 
                  className={`filter-btn ${activeCategory === 'additional' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('additional')}
                >
                  Дополнительные
                </button>
              </div>
            </div>

            {/* Загрузка и отображение документов */}
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
                  <span className="badge bg-primary rounded-pill ms-3 fs-6">{getFilteredDocs().length}</span>
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
                  <div className="card shadow-custom border-0 bg-light p-4 text-center">
                    <div className="card-body p-5">
                      <i className="bi bi-file-earmark-text text-muted mb-3" style={{ fontSize: '3rem' }}></i>
                      <h3 className="h4 mb-3">Документы не найдены</h3>
                      <p className="text-muted mb-4">
                        В выбранной категории пока нет документов.
                      </p>
                      <button 
                        className="btn btn-outline-primary"
                        onClick={() => setActiveCategory('all')}
                      >
                        Показать все документы
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Информация о документах */}
            <div className="alert alert-info mt-5 mb-0 border-0 shadow-sm rounded-4 fade-in" style={{animationDelay: "0.4s"}}>
              <div className="d-flex py-2">
                <div className="me-4">
                  <i className="bi bi-info-circle-fill fs-3"></i>
                </div>
                <div>
                  <h5 className="alert-heading mb-2">Информация о документах</h5>
                  <p className="mb-0">
                    Все официальные документы Арктической олимпиады «Полярный круг» представлены в формате PDF. 
                    Если у вас возникли вопросы по документам, пожалуйста, свяжитесь с нами по адресу{' '}
                    <a href="mailto:docs@arctic-olymp.ru" className="alert-link">
                      docs@arctic-olymp.ru
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 