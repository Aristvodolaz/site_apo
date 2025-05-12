import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import { contactsData } from '../data/contactsData';

export default function Contacts() {
  const { mainOrganizer, partners, olympiadContacts, subjectCoordinators } = contactsData;

  return (
    <Layout title="Контакты">
      <PageHeader 
        title="Контакты" 
        subtitle="Контактная информация организаторов Арктической олимпиады «Полярный круг»"
      />
      
      <div className="container pb-5 pt-4">
        <div className="row">
          <div className="col-lg-9 mx-auto">
            {/* Main contact information */}
            <section className="mb-5 fade-in">
              <h2 className="mb-4">Основные контакты олимпиады</h2>
              <div className="card border-0 shadow-lg rounded-4 hover-lift">
                <div className="card-body p-4 p-lg-5">
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="d-flex mb-4 align-items-center contact-item">
                        <div className="text-primary me-3">
                          <i className="bi bi-envelope-fill fs-4 pulse"></i>
                        </div>
                        <div>
                          <h5 className="mb-1">Email</h5>
                          <a href={`mailto:${olympiadContacts.email}`} className="text-decoration-none contact-link">
                            {olympiadContacts.email}
                          </a>
                        </div>
                      </div>
                      
                      {olympiadContacts.registrationHelp && (
                        <div className="d-flex mb-0 align-items-center contact-item">
                          <div className="text-primary me-3">
                            <i className="bi bi-telephone-fill fs-4 pulse"></i>
                          </div>
                          <div>
                            <h5 className="mb-1">Горячая линия</h5>
                            <p className="mb-0 fw-medium">{olympiadContacts.registrationHelp}</p>
                            <small className="text-muted">По вопросам регистрации</small>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="col-md-6">
                      {olympiadContacts.telegram && (
                        <div className="d-flex mb-4 align-items-center contact-item">
                          <div className="text-primary me-3">
                            <i className="bi bi-telegram fs-4 pulse"></i>
                          </div>
                          <div>
                            <h5 className="mb-1">Telegram</h5>
                            <p className="mb-0 fw-medium">{olympiadContacts.telegram}</p>
                          </div>
                        </div>
                      )}
                      
                      {olympiadContacts.vk && (
                        <div className="d-flex align-items-center contact-item">
                          <div className="text-primary me-3">
                            <i className="bi bi-chat-fill fs-4 pulse"></i>
                          </div>
                          <div>
                            <h5 className="mb-1">ВКонтакте</h5>
                            <p className="mb-0 fw-medium">{olympiadContacts.vk}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Main organizer */}
            <section className="mb-5 fade-in" style={{animationDelay: "0.2s"}}>
              <h2 className="mb-4">Главный организатор</h2>
              <div className="card border-0 shadow-lg rounded-4 hover-lift">
                <div className="card-body p-4 p-lg-5">
                  <div className="row">
                    <div className="col-md-8">
                      <h3 className="h4 mb-4 fw-bold">{mainOrganizer.name}</h3>
                      
                      <div className="d-flex mb-3 align-items-center contact-item">
                        <div className="text-primary me-3">
                          <i className="bi bi-geo-alt-fill"></i>
                        </div>
                        <div>
                          <p className="mb-0">{mainOrganizer.address}</p>
                        </div>
                      </div>
                      
                      <div className="d-flex mb-3 align-items-center contact-item">
                        <div className="text-primary me-3">
                          <i className="bi bi-telephone-fill"></i>
                        </div>
                        <div>
                          <p className="mb-0">{mainOrganizer.phone}</p>
                        </div>
                      </div>
                      
                      <div className="d-flex mb-3 align-items-center contact-item">
                        <div className="text-primary me-3">
                          <i className="bi bi-envelope-fill"></i>
                        </div>
                        <div>
                          <a href={`mailto:${mainOrganizer.email}`} className="text-decoration-none contact-link">
                            {mainOrganizer.email}
                          </a>
                        </div>
                      </div>
                      
                      <div className="d-flex align-items-center contact-item">
                        <div className="text-primary me-3">
                          <i className="bi bi-globe"></i>
                        </div>
                        <div>
                          <a href={mainOrganizer.website} target="_blank" rel="noopener noreferrer" className="text-decoration-none contact-link">
                            {mainOrganizer.website}
                          </a>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-4 d-none d-md-flex align-items-center justify-content-center">
                      <div className="organizer-icon-container">
                        <i className="bi bi-building text-primary"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Partners */}
            <section className="mb-5 fade-in" style={{animationDelay: "0.4s"}}>
              <h2 className="mb-4">Организации-партнеры</h2>
              <div className="row g-4">
                {partners.map((partner, index) => (
                  <div key={index} className="col-md-6">
                    <div className="card h-100 border-0 shadow-lg rounded-4 hover-lift">
                      <div className="card-body p-4 p-lg-5">
                        <h3 className="h4 mb-4 fw-bold">{partner.name}</h3>
                        <p className="mb-4">{partner.description}</p>
                        
                        <div className="d-flex mb-3 align-items-center contact-item">
                          <div className="text-primary me-3">
                            <i className="bi bi-globe"></i>
                          </div>
                          <div>
                            <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-decoration-none contact-link">
                              {partner.website}
                            </a>
                          </div>
                        </div>
                        
                        <div className="d-flex align-items-center contact-item">
                          <div className="text-primary me-3">
                            <i className="bi bi-envelope-fill"></i>
                          </div>
                          <div>
                            <a href={`mailto:${partner.email}`} className="text-decoration-none contact-link">
                              {partner.email}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            
            {/* Subject coordinators */}
            <section className="mb-5 fade-in" style={{animationDelay: "0.6s"}}>
              <h2 className="mb-4">Координаторы по предметам</h2>
              <div className="coordinators-grid">
                {subjectCoordinators.map((coordinator, index) => (
                  <div key={index} className="coordinator-card">
                    <div className="subject-badge">{coordinator.subject}</div>
                    <h3 className="coordinator-name">{coordinator.name}</h3>
                    <a href={`mailto:${coordinator.email}`} className="coordinator-email">
                      {coordinator.email}
                    </a>
                  </div>
                ))}
              </div>
            </section>
            
            <div className="alert alert-info mt-5 mb-4 border-0 shadow-sm rounded-4 fade-in" style={{animationDelay: "0.8s"}}>
              <div className="d-flex py-2">
                <div className="me-4">
                  <i className="bi bi-info-circle-fill fs-3"></i>
                </div>
                <div>
                  <h5 className="alert-heading mb-2">Остались вопросы?</h5>
                  <p className="mb-0">
                    Если у вас остались вопросы по организации Арктической олимпиады, 
                    пожалуйста, напишите нам на почту{' '}
                    <a href={`mailto:${olympiadContacts.email || 'info@arctic-olymp.ru'}`} className="alert-link">
                      {olympiadContacts.email || 'info@arctic-olymp.ru'}
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