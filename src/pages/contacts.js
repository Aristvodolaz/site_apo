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
      
      <div className="container py-5">
        <div className="row">
          <div className="col-lg-10 mx-auto">
            {/* Main contact information */}
            <section className="mb-5">
              <h2 className="mb-4">Основные контакты олимпиады</h2>
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="d-flex mb-3">
                        <div className="text-primary me-3">
                          <i className="bi bi-envelope-fill fs-4"></i>
                        </div>
                        <div>
                          <h5 className="mb-1">Email</h5>
                          <a href={`mailto:${olympiadContacts.email}`} className="text-decoration-none">
                            {olympiadContacts.email}
                          </a>
                        </div>
                      </div>
                      
                      {olympiadContacts.registrationHelp && (
                        <div className="d-flex mb-3">
                          <div className="text-primary me-3">
                            <i className="bi bi-telephone-fill fs-4"></i>
                          </div>
                          <div>
                            <h5 className="mb-1">Горячая линия</h5>
                            <p className="mb-0">{olympiadContacts.registrationHelp}</p>
                            <small className="text-muted">По вопросам регистрации</small>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="col-md-6">
                      {olympiadContacts.telegram && (
                        <div className="d-flex mb-3">
                          <div className="text-primary me-3">
                            <i className="bi bi-telegram fs-4"></i>
                          </div>
                          <div>
                            <h5 className="mb-1">Telegram</h5>
                            <p className="mb-0">{olympiadContacts.telegram}</p>
                          </div>
                        </div>
                      )}
                      
                      {olympiadContacts.vk && (
                        <div className="d-flex">
                          <div className="text-primary me-3">
                            <i className="bi bi-chat-fill fs-4"></i>
                          </div>
                          <div>
                            <h5 className="mb-1">ВКонтакте</h5>
                            <p className="mb-0">{olympiadContacts.vk}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Main organizer */}
            <section className="mb-5">
              <h2 className="mb-4">Главный организатор</h2>
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="row">
                    <div className="col-md-8">
                      <h3 className="h4 mb-3">{mainOrganizer.name}</h3>
                      
                      <div className="d-flex mb-3">
                        <div className="text-primary me-3">
                          <i className="bi bi-geo-alt-fill"></i>
                        </div>
                        <div>
                          <p className="mb-0">{mainOrganizer.address}</p>
                        </div>
                      </div>
                      
                      <div className="d-flex mb-3">
                        <div className="text-primary me-3">
                          <i className="bi bi-telephone-fill"></i>
                        </div>
                        <div>
                          <p className="mb-0">{mainOrganizer.phone}</p>
                        </div>
                      </div>
                      
                      <div className="d-flex mb-3">
                        <div className="text-primary me-3">
                          <i className="bi bi-envelope-fill"></i>
                        </div>
                        <div>
                          <a href={`mailto:${mainOrganizer.email}`} className="text-decoration-none">
                            {mainOrganizer.email}
                          </a>
                        </div>
                      </div>
                      
                      <div className="d-flex">
                        <div className="text-primary me-3">
                          <i className="bi bi-globe"></i>
                        </div>
                        <div>
                          <a href={mainOrganizer.website} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                            {mainOrganizer.website}
                          </a>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-4 d-none d-md-flex align-items-center justify-content-center">
                      <div className="text-center">
                        <i className="bi bi-building text-primary" style={{ fontSize: '5rem' }}></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Partners */}
            <section className="mb-5">
              <h2 className="mb-4">Организации-партнеры</h2>
              <div className="row g-4">
                {partners.map((partner, index) => (
                  <div key={index} className="col-md-6">
                    <div className="card h-100 border-0 shadow-sm">
                      <div className="card-body p-4">
                        <h3 className="h4 mb-3">{partner.name}</h3>
                        <p className="mb-3">{partner.description}</p>
                        
                        <div className="d-flex mb-3">
                          <div className="text-primary me-3">
                            <i className="bi bi-globe"></i>
                          </div>
                          <div>
                            <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                              {partner.website}
                            </a>
                          </div>
                        </div>
                        
                        <div className="d-flex">
                          <div className="text-primary me-3">
                            <i className="bi bi-envelope-fill"></i>
                          </div>
                          <div>
                            <a href={`mailto:${partner.email}`} className="text-decoration-none">
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
            <section className="mb-5">
              <h2 className="mb-4">Координаторы по предметам</h2>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>Предмет</th>
                      <th>Контактное лицо</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjectCoordinators.map((coordinator, index) => (
                      <tr key={index}>
                        <td>{coordinator.subject}</td>
                        <td>{coordinator.name}</td>
                        <td>
                          <a href={`mailto:${coordinator.email}`}>
                            {coordinator.email}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            
            <div className="alert alert-info mt-5">
              <div className="d-flex">
                <div className="me-3">
                  <i className="bi bi-info-circle-fill fs-4"></i>
                </div>
                <div>
                  <h5 className="alert-heading">Остались вопросы?</h5>
                  <p className="mb-0">
                    Если у вас остались вопросы по организации Арктической олимпиады, 
                    пожалуйста, напишите нам на почту{' '}
                    <a href="mailto:regions@apo-team.ru" className="alert-link">
                      regions@apo-team.ru
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