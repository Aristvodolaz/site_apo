import Layout from '../../components/Layout';
import PageHeader from '../../components/PageHeader';
import Link from 'next/link';
import { subjectsService } from '../../lib/firebaseService';
import { db } from '../../lib/firebase';
import { useEffect, useState } from 'react';

export default function MathSubject() {
  const [mathData, setMathData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Загружаем данные математики из Firebase
    async function fetchMathData() {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Начинаем загрузку данных математики...');
        console.log('Firebase db объект:', db);
        
        if (!db) {
          throw new Error('Firebase не инициализирован');
        }
        
        // Получаем данные предмета математики из Firebase
        const data = await subjectsService.getSubjectById('0'); // Математика имеет ID '0' в Firebase
        console.log('Math data loaded from Firebase:', data);
        
        if (data) {
          setMathData(data);
        } else {
          setError('Данные по математике не найдены.');
        }
      } catch (err) {
        console.error("Ошибка при загрузке данных математики:", err);
        console.error("Детали ошибки:", err.message);
        setError(`Не удалось загрузить данные: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
    
    fetchMathData();
  }, []);

  if (loading) {
    return (
      <Layout title="Математика">
        <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Загрузка...</span>
            </div>
            <p className="mt-3 text-muted">Загружаем данные...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !mathData) {
    return (
      <Layout title="Математика">
        <div className="container py-5">
          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error || 'Данные не найдены'}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Математика">
      <div className="subject-header" style={{ background: 'linear-gradient(135deg, #0559b9 0%, #0095ff 50%, #00c6ff 100%)' }}>
        <div className="container py-5 position-relative z-index-1">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h1 className="text-white display-4 fw-bold mb-3">{mathData.title}</h1>
              <p className="text-white opacity-90 lead mb-4">{mathData.shortDescription}</p>
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
                  <i className={`bi bi-${mathData.icon} subject-icon-large`}></i>
                  <div className="subject-icon-glow"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="aurora-effect"></div>
        <div className="polar-decoration polar-bear">
          <i className="bi bi-snow2"></i>
        </div>
        <div className="polar-decoration ice-berg">
          <i className="bi bi-pentagon"></i>
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
                <div className="inner"><i className="bi bi-asterisk"></i></div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-lg-8">
            <section className="mb-5">
              <h2 className="section-title mb-4">О профиле «{mathData.title}»</h2>
              <p className="lead">{mathData.description}</p>
              
              <div className="row mt-4 g-4">
                <div className="col-md-6">
                  <div className="subject-info-card h-100">
                    <div className="subject-info-card-decoration"></div>
                    <div className="subject-info-icon">
                      <i className="bi bi-mortarboard"></i>
                    </div>
                    <h4 className="subject-info-title">Классы</h4>
                    <p className="subject-info-text">{mathData.grades?.join(', ')} классы</p>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="subject-info-card h-100">
                    <div className="subject-info-card-decoration"></div>
                    <div className="subject-info-icon">
                      <i className="bi bi-geo-alt"></i>
                    </div>
                    <h4 className="subject-info-title">Площадки проведения</h4>
                    <p className="subject-info-text">
                      {mathData.locations && mathData.locations.length > 0 
                        ? mathData.locations.join(', ') 
                        : 'Информация будет доступна позже'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="subject-info-box mt-4">
                <div className="d-flex">
                  <div className="subject-info-box-icon">
                    <i className="bi bi-info-circle"></i>
                  </div>
                  <div>
                    <h5 className="subject-info-box-title">Важный принцип олимпиады</h5>
                    <p className="subject-info-box-text">
                      Арктическая олимпиада уделяет особое внимание составлению заданий для учащихся младших классов (4-6), 
                      чтобы способствовать их раннему вовлечению в олимпиадное движение для достижения высоких 
                      академических результатов в будущем.
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
                    <div className="phase-decoration"></div>
                    <h3 className="phase-title">
                      <i className="bi bi-1-circle me-2"></i>
                      Отборочный этап
                    </h3>
                    <div className="phase-info">
                      <div className="d-flex align-items-center mb-3">
                        <div className="phase-icon me-3">
                          <i className="bi bi-calendar-event"></i>
                        </div>
                        <div>
                          <div className="phase-label">Даты проведения</div>
                          <div className="phase-value">
                            {mathData.schedule?.qualification?.start} - {mathData.schedule?.qualification?.end}
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center mb-3">
                        <div className="phase-icon me-3">
                          <i className="bi bi-laptop"></i>
                        </div>
                        <div>
                          <div className="phase-label">Формат</div>
                          <div className="phase-value">{mathData.schedule?.qualification?.format}</div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        <div className="phase-icon me-3">
                          <i className="bi bi-people"></i>
                        </div>
                        <div>
                          <div className="phase-label">Участники</div>
                          <div className="phase-value">
                            Все зарегистрированные школьники {mathData.grades?.join(', ')} классов
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="subject-phase-card final">
                    <div className="phase-decoration"></div>
                    <h3 className="phase-title">
                      <i className="bi bi-2-circle me-2"></i>
                      Заключительный этап
                    </h3>
                    <div className="phase-info">
                      <div className="d-flex align-items-center mb-3">
                        <div className="phase-icon me-3">
                          <i className="bi bi-calendar-event"></i>
                        </div>
                        <div>
                          <div className="phase-label">Даты проведения</div>
                          <div className="phase-value">
                            {mathData.schedule?.final?.start} - {mathData.schedule?.final?.end}
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center mb-3">
                        <div className="phase-icon me-3">
                          <i className="bi bi-geo-alt"></i>
                        </div>
                        <div>
                          <div className="phase-label">Формат</div>
                          <div className="phase-value">{mathData.schedule?.final?.format}</div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        <div className="phase-icon me-3">
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
                  <a className="btn-register">
                    <span>Зарегистрироваться на олимпиаду</span>
                    <i className="bi bi-arrow-right-circle ms-2"></i>
                  </a>
                </Link>
              </div>
            </section>
            
            <section className="mb-5">
              <h2 className="section-title mb-4">Задания прошлых лет</h2>
              
              {mathData.pastProblems && mathData.pastProblems.length > 0 ? (
                <div className="past-problems-table">
                  {mathData.pastProblems.map((yearData, index) => (
                    <div key={index} className="past-problems-year-card">
                      <div className="year-badge">{yearData.year}</div>
                      <div className="past-problems-links">
                        {yearData.qualification && (
                          <a 
                            href={yearData.qualification} 
                            className="past-problems-link" 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <i className="bi bi-file-earmark-pdf me-2"></i>
                            <span>Отборочный этап</span>
                            <i className="bi bi-download ms-auto"></i>
                          </a>
                        )}
                        {yearData.final && (
                          <a 
                            href={yearData.final} 
                            className="past-problems-link" 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <i className="bi bi-file-earmark-pdf me-2"></i>
                            <span>Заключительный этап</span>
                            <i className="bi bi-download ms-auto"></i>
                          </a>
                        )}
                        {yearData.solutions && (
                          <a 
                            href={yearData.solutions} 
                            className="past-problems-link" 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <i className="bi bi-lightbulb me-2"></i>
                            <span>Решения</span>
                            <i className="bi bi-download ms-auto"></i>
                          </a>
                        )}
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
            <div className="subject-sidebar" style={{ top: '2rem' }}>
              <div className="subject-sidebar-card">
                <h3 className="sidebar-card-title">
                  <i className="bi bi-calendar-check me-2"></i>
                  Важные даты
                </h3>
                <ul className="sidebar-timeline">
                  <li className="sidebar-timeline-item">
                    <div className="timeline-badge"></div>
                    <div className="timeline-content">
                      <div className="timeline-title">Регистрация открыта до</div>
                      <div className="timeline-date">31.10.2024</div>
                    </div>
                  </li>
                  <li className="sidebar-timeline-item">
                    <div className="timeline-badge"></div>
                    <div className="timeline-content">
                      <div className="timeline-title">Отборочный этап</div>
                      <div className="timeline-date">
                        {mathData.schedule?.qualification?.start} - {mathData.schedule?.qualification?.end}
                      </div>
                    </div>
                  </li>
                  <li className="sidebar-timeline-item">
                    <div className="timeline-badge"></div>
                    <div className="timeline-content">
                      <div className="timeline-title">Заключительный этап</div>
                      <div className="timeline-date">
                        {mathData.schedule?.final?.start} - {mathData.schedule?.final?.end}
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
                
              <div className="subject-sidebar-card">
                <h3 className="sidebar-card-title">
                  <i className="bi bi-file-earmark-text me-2"></i>
                  Документы
                </h3>
                <ul className="sidebar-links">
                  <li>
                    <a href="/documents/math_reglament_2025.pdf" className="sidebar-link" target="_blank" rel="noopener noreferrer">
                      <i className="bi bi-file-earmark-pdf"></i>
                      <span>Регламент проведения</span>
                      <i className="bi bi-chevron-right"></i>
                    </a>
                  </li>
                  <li>
                    <a href="/documents/appeal_arctic_olympiad_2025.pdf" className="sidebar-link" target="_blank" rel="noopener noreferrer">
                      <i className="bi bi-file-earmark-pdf"></i>
                      <span>Положение об апелляции</span>
                      <i className="bi bi-chevron-right"></i>
                    </a>
                  </li>
                  <li>
                    <a href="/documents/personal_data_agreement_2025.pdf" className="sidebar-link" target="_blank" rel="noopener noreferrer">
                      <i className="bi bi-file-earmark-pdf"></i>
                      <span>Согласие на обработку персональных данных</span>
                      <i className="bi bi-chevron-right"></i>
                    </a>
                  </li>
                </ul>
              </div>
                
             
                
              <div className="d-grid gap-2 mt-4">
                <Link href="/register" legacyBehavior>
                  <a className="btn-register d-flex align-items-center justify-content-center">
                    <i className="bi bi-pencil-square me-2"></i>
                    <span>Зарегистрироваться</span>
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