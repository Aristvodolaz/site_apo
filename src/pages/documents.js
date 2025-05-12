import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import DocumentCard from '../components/DocumentCard';
import { documentsData } from '../data/documentsData';
import { useState } from 'react';

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

  return (
    <Layout title="Документы">
      <PageHeader 
        title="Документы" 
        subtitle="Официальные документы, регламентирующие проведение Арктической олимпиады «Полярный круг»"
      />
      
      {/* Волновой эффект */}
      <div className="document-wave-container">
        <div className="document-wave"></div>
      </div>
      
      <div className="container py-5">
        <div className="row">
          <div className="col-lg-10 mx-auto">
            <div className="mb-5">
              <p className="lead text-center mb-5">
                На этой странице собраны все официальные документы, регламентирующие проведение 
                Арктической олимпиады «Полярный круг» 2025.
              </p>
              
              {/* Filter tabs */}
              <div className="documents-filter mb-5">
                <div className="filter-tabs">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      className={`filter-tab ${activeCategory === category.id ? 'active' : ''}`}
                      onClick={() => setActiveCategory(category.id)}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Document Grid */}
            <div className="document-grid">
              {activeCategory === 'all' && (
                <>
                  {/* Official documents */}
                  {officialDocs.length > 0 && (
                    <section className="mb-5">
                      <h2 className="document-section-title mb-4">Официальные документы</h2>
                      <div className="row g-4">
                        {officialDocs.map(doc => (
                          <div key={doc.id} className="col-md-6">
                            <DocumentCard 
                              title={doc.title}
                              description={doc.description}
                              url={doc.url}
                            />
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                  
                  {/* Main olympiad documents */}
                  {mainDocs.length > 0 && (
                    <section className="mb-5">
                      <h2 className="document-section-title mb-4">Основные документы олимпиады</h2>
                      <div className="row g-4">
                        {mainDocs.map(doc => (
                          <div key={doc.id} className="col-md-6">
                            <DocumentCard 
                              title={doc.title}
                              description={doc.description}
                              url={doc.url}
                            />
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                  
                  {/* Subject-specific documents */}
                  {subjectDocs.length > 0 && (
                    <section className="mb-5">
                      <h2 className="document-section-title mb-4">Документы по предметам</h2>
                      <div className="row g-4">
                        {subjectDocs.map(doc => (
                          <div key={doc.id} className="col-md-6">
                            <DocumentCard 
                              title={doc.title}
                              description={doc.description}
                              url={doc.url}
                            />
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                  
                  {/* Additional documents */}
                  {additionalDocs.length > 0 && (
                    <section className="mb-5">
                      <h2 className="document-section-title mb-4">Дополнительные документы</h2>
                      <div className="row g-4">
                        {additionalDocs.map(doc => (
                          <div key={doc.id} className="col-md-6">
                            <DocumentCard 
                              title={doc.title}
                              description={doc.description}
                              url={doc.url}
                            />
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </>
              )}
              
              {/* Filtered documents */}
              {activeCategory !== 'all' && (
                <div className="row g-4">
                  {getFilteredDocs().map(doc => (
                    <div key={doc.id} className="col-md-6">
                      <DocumentCard 
                        title={doc.title}
                        description={doc.description}
                        url={doc.url}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Help notice */}
            <div className="document-help-box mt-5">
              <div className="d-flex">
                <div className="help-icon">
                  <i className="bi bi-info-circle-fill"></i>
                </div>
                <div>
                  <h5>Не нашли нужный документ?</h5>
                  <p className="mb-0">
                    Если вы не нашли нужный документ или у вас возникли вопросы, 
                    пожалуйста, напишите нам на почту{' '}
                    <a href="mailto:info@arctic-olymp.ru" className="help-link">
                      info@arctic-olymp.ru
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