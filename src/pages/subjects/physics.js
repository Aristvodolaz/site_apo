import Layout from '../../components/Layout';
import PageHeader from '../../components/PageHeader';
import Link from 'next/link';
import { subjectsData } from '../../data/subjectsData';
import { useEffect, useState } from 'react';

export default function PhysicsSubject() {
  // Get physics data from the subjectsData
  const physicsData = subjectsData.find(subject => subject.id === 'physics');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Layout title="Физика">
      <div className="subject-header" style={{ background: 'linear-gradient(135deg, #9f1239 0%, #dc3545 50%, #ff6b6b 100%)' }}>
        <div className="container py-5 position-relative z-index-1">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h1 className="text-white display-4 fw-bold mb-3">Физика</h1>
              <p className="text-white opacity-90 lead mb-4">Олимпиада по физике для учащихся 7-11 классов</p>
              <div className="d-flex flex-wrap gap-3">
                <Link href="/register" legacyBehavior>
                  <a className="hero-btn-primary">
                    <span>Регистрация</span>
                    <i className="bi bi-arrow-right-circle ms-2"></i>
                  </a>
                </Link>
              </div>
            </div>
            <div className="col-lg-4 d-none d-lg-block">
              <div className="subject-icon-wrapper">
                <div className="subject-icon-container">
                  <i className="bi bi-lightning subject-icon-large"></i>
                  <div className="subject-icon-glow"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="aurora-effect"></div>
        <div className="polar-decoration polar-bear">
          <i className="bi bi-magnet"></i>
        </div>
        <div className="polar-decoration ice-berg">
          <i className="bi bi-radioactive"></i>
        </div>
        
        {/* Wave effect */}
        <div className="hero-wave-container">
          <div className="hero-wave"></div>
        </div>
        
        {/* Snowflakes */}
        {isMounted && (
          <div className="snowflakes">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="snowflake">
                <div className="inner"><i className="bi bi-lightning"></i></div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-lg-8">
            <section className="mb-5">
              <h2 className="section-title mb-4">О профиле «Физика»</h2>
              <p className="lead">{physicsData.description}</p>
              
              <div className="row mt-4 g-4">
                <div className="col-md-6">
                  <div className="subject-info-card h-100">
                    <div className="subject-info-card-decoration"></div>
                    <div className="subject-info-icon" style={{background: 'rgba(220, 53, 69, 0.1)', color: '#dc3545'}}>
                      <i className="bi bi-mortarboard"></i>
                    </div>
                    <h4 className="subject-info-title">Классы</h4>
                    <p className="subject-info-text">{physicsData.grades.join(', ')} классы</p>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="subject-info-card h-100">
                    <div className="subject-info-card-decoration"></div>
                    <div className="subject-info-icon" style={{background: 'rgba(220, 53, 69, 0.1)', color: '#dc3545'}}>
                      <i className="bi bi-geo-alt"></i>
                    </div>
                    <h4 className="subject-info-title">Площадки проведения</h4>
                    <p className="subject-info-text">
                      {physicsData.locations ? physicsData.locations.join(', ') : 'Информация будет доступна позже'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="subject-info-box mt-4" style={{background: 'linear-gradient(135deg, rgba(220, 53, 69, 0.05), rgba(255, 107, 107, 0.05))'}}>
                <div className="d-flex">
                  <div className="subject-info-box-icon" style={{background: 'rgba(220, 53, 69, 0.1)', color: '#dc3545'}}>
                    <i className="bi bi-info-circle"></i>
                  </div>
                  <div>
                    <h5 className="subject-info-box-title">Особенности олимпиады по физике</h5>
                    <p className="subject-info-box-text">
                      Задания олимпиады по физике включают как теоретические задачи, так и экспериментальные задания. 
                      В заключительном этапе участники демонстрируют навыки практического применения физических законов.
                    </p>
                  </div>
                </div>
              </div>
            </section>
            
            <section className="mb-5">
              <h2 className="section-title mb-4">График проведения</h2>
              
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="subject-phase-card qualification">
                    <div className="phase-decoration" style={{background: 'linear-gradient(to right, #dc3545, #ff6b6b)'}}></div>
                    <h3 className="phase-title" style={{color: '#dc3545'}}>
                      <i className="bi bi-1-circle me-2"></i>
                      Отборочный этап
                    </h3>
                    <div className="phase-info">
                      <div className="d-flex align-items-center mb-3">
                        <div className="phase-icon me-3" style={{background: 'rgba(220, 53, 69, 0.1)', color: '#dc3545'}}>
                          <i className="bi bi-calendar-event"></i>
                        </div>
                        <div>
                          <div className="phase-label">Даты проведения</div>
                          <div className="phase-value">{physicsData.schedule.qualification.start} - {physicsData.schedule.qualification.end}</div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center mb-3">
                        <div className="phase-icon me-3" style={{background: 'rgba(220, 53, 69, 0.1)', color: '#dc3545'}}>
                          <i className="bi bi-laptop"></i>
                        </div>
                        <div>
                          <div className="phase-label">Формат</div>
                          <div className="phase-value">{physicsData.schedule.qualification.format}</div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        <div className="phase-icon me-3" style={{background: 'rgba(220, 53, 69, 0.1)', color: '#dc3545'}}>
                          <i className="bi bi-people"></i>
                        </div>
                        <div>
                          <div className="phase-label">Участники</div>
                          <div className="phase-value">Все зарегистрированные школьники {physicsData.grades.join(', ')} классов</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="subject-phase-card final">
                    <div className="phase-decoration" style={{background: 'linear-gradient(to right, #dc3545, #ff6b6b)'}}></div>
                    <h3 className="phase-title" style={{color: '#dc3545'}}>
                      <i className="bi bi-2-circle me-2"></i>
                      Заключительный этап
                    </h3>
                    <div className="phase-info">
                      <div className="d-flex align-items-center mb-3">
                        <div className="phase-icon me-3" style={{background: 'rgba(220, 53, 69, 0.1)', color: '#dc3545'}}>
                          <i className="bi bi-calendar-event"></i>
                        </div>
                        <div>
                          <div className="phase-label">Даты проведения</div>
                          <div className="phase-value">{physicsData.schedule.final.start} - {physicsData.schedule.final.end}</div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center mb-3">
                        <div className="phase-icon me-3" style={{background: 'rgba(220, 53, 69, 0.1)', color: '#dc3545'}}>
                          <i className="bi bi-geo-alt"></i>
                        </div>
                        <div>
                          <div className="phase-label">Формат</div>
                          <div className="phase-value">{physicsData.schedule.final.format}</div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        <div className="phase-icon me-3" style={{background: 'rgba(220, 53, 69, 0.1)', color: '#dc3545'}}>
                          <i className="bi bi-trophy"></i>
                        </div>
                        <div>
                          <div className="phase-label">Участники</div>
                          <div className="phase-value">Победители и призеры отборочного этапа</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-4">
                <Link href="/register" legacyBehavior>
                  <a className="btn-register" style={{background: 'linear-gradient(135deg, #dc3545, #ff6b6b)'}}>
                    <span>Зарегистрироваться на олимпиаду</span>
                    <i className="bi bi-arrow-right-circle ms-2"></i>
                  </a>
                </Link>
              </div>
            </section>
            
            <section className="mb-5">
              <h2 className="section-title mb-4">Задания прошлых лет</h2>
              
              {physicsData.pastProblems && physicsData.pastProblems.length > 0 ? (
                <div className="past-problems-table">
                  {physicsData.pastProblems.map((year, index) => (
                    <div key={index} className="past-problems-year-card">
                      <div className="year-badge" style={{background: '#dc3545'}}>{year.year}</div>
                      <div className="past-problems-links">
                        <a href={year.qualification} className="past-problems-link" target="_blank" rel="noopener noreferrer">
                          <i className="bi bi-file-earmark-pdf me-2"></i>
                          <span>Отборочный этап</span>
                          <i className="bi bi-download ms-auto"></i>
                        </a>
                        <a href={year.final} className="past-problems-link" target="_blank" rel="noopener noreferrer">
                          <i className="bi bi-file-earmark-pdf me-2"></i>
                          <span>Заключительный этап</span>
                          <i className="bi bi-download ms-auto"></i>
                        </a>
                        <a href={year.solutions} className="past-problems-link" target="_blank" rel="noopener noreferrer">
                          <i className="bi bi-lightbulb me-2"></i>
                          <span>Решения</span>
                          <i className="bi bi-download ms-auto"></i>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="news-empty-state text-center py-5">
                  <i className="bi bi-file-earmark-x d-block mb-3"></i>
                  <h4>Задания прошлых лет</h4>
                  <p>В настоящее время задания прошлых лет не доступны.</p>
                </div>
              )}
            </section>
          </div>
          
          <div className="col-lg-4">
            <div className="subject-sidebar sticky-top" style={{ top: '2rem' }}>
              <div className="subject-sidebar-card">
                <h3 className="sidebar-card-title">
                  <i className="bi bi-calendar-check me-2" style={{color: '#dc3545'}}></i>
                  Важные даты
                </h3>
                <ul className="sidebar-timeline">
                  <li className="sidebar-timeline-item">
                    <div className="timeline-badge" style={{borderColor: '#dc3545'}}></div>
                    <div className="timeline-content">
                      <div className="timeline-title">Регистрация открыта до</div>
                      <div className="timeline-date" style={{color: '#dc3545'}}>31.10.2024</div>
                    </div>
                  </li>
                  <li className="sidebar-timeline-item">
                    <div className="timeline-badge" style={{borderColor: '#dc3545'}}></div>
                    <div className="timeline-content">
                      <div className="timeline-title">Отборочный этап</div>
                      <div className="timeline-date" style={{color: '#dc3545'}}>01.11 - 15.11.2024</div>
                    </div>
                  </li>
                  <li className="sidebar-timeline-item">
                    <div className="timeline-badge" style={{borderColor: '#dc3545'}}></div>
                    <div className="timeline-content">
                      <div className="timeline-title">Заключительный этап</div>
                      <div className="timeline-date" style={{color: '#dc3545'}}>24.02 - 05.03.2025</div>
                    </div>
                  </li>
                </ul>
              </div>
                
              <div className="subject-sidebar-card">
                <h3 className="sidebar-card-title">
                  <i className="bi bi-file-earmark-text me-2" style={{color: '#dc3545'}}></i>
                  Документы
                </h3>
                <ul className="sidebar-links">
                  <li>
                    <a href="/documents/physics_reglament_2025.pdf" className="sidebar-link" target="_blank" rel="noopener noreferrer">
                      <i className="bi bi-file-earmark-pdf" style={{color: '#dc3545'}}></i>
                      <span>Регламент проведения</span>
                      <i className="bi bi-chevron-right"></i>
                    </a>
                  </li>
                  <li>
                    <a href="/documents/appeal_arctic_olympiad_2025.pdf" className="sidebar-link" target="_blank" rel="noopener noreferrer">
                      <i className="bi bi-file-earmark-pdf" style={{color: '#dc3545'}}></i>
                      <span>Положение об апелляции</span>
                      <i className="bi bi-chevron-right"></i>
                    </a>
                  </li>
                  <li>
                    <a href="/documents/personal_data_agreement_2025.pdf" className="sidebar-link" target="_blank" rel="noopener noreferrer">
                      <i className="bi bi-file-earmark-pdf" style={{color: '#dc3545'}}></i>
                      <span>Согласие на обработку персональных данных</span>
                      <i className="bi bi-chevron-right"></i>
                    </a>
                  </li>
                </ul>
              </div>
                
              <div className="subject-sidebar-card">
                <h3 className="sidebar-card-title">
                  <i className="bi bi-envelope me-2" style={{color: '#dc3545'}}></i>
                  Контакты
                </h3>
                <ul className="sidebar-contacts">
                  <li>
                    <a href="mailto:physics@arctic-olympiad.ru" className="sidebar-contact-link">
                      <i className="bi bi-envelope-fill" style={{color: '#dc3545'}}></i>
                      <span>physics@arctic-olympiad.ru</span>
                    </a>
                  </li>
                  <li>
                    <a href="mailto:regions@apo-team.ru" className="sidebar-contact-link">
                      <i className="bi bi-envelope-fill" style={{color: '#dc3545'}}></i>
                      <span>regions@apo-team.ru</span>
                    </a>
                  </li>
                </ul>
              </div>
                
              <div className="d-grid gap-2 mt-4">
                <Link href="/register" legacyBehavior>
                  <a className="btn-register d-flex align-items-center justify-content-center" style={{background: 'linear-gradient(135deg, #dc3545, #ff6b6b)'}}>
                    <i className="bi bi-pencil-square me-2"></i>
                    <span>Зарегистрироваться</span>
                  </a>
                </Link>
                <Link href="/about/archive" legacyBehavior>
                  <a className="btn btn-outline-danger d-flex align-items-center justify-content-center">
                    <i className="bi bi-archive me-2"></i>
                    <span>Архив олимпиады</span>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 