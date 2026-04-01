import Head from 'next/head';
import Layout from '../components/Layout';
import NewsCard from '../components/NewsCard';
import SubjectCard from '../components/SubjectCard';
import FAQSection from '../components/FAQSection';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getNews } from '../lib/dataService';
import { subjectsService } from '../lib/firebaseService';
import OrganizersAndPartners from '../components/OrganizersAndPartners';
import { FINAL_STAGE_SCHEDULE } from '../data/finalStageScheduleData';

export default function Home() {
  const finalStageWorkShowcase = [
    { title: 'Математика', icon: 'calculator-fill', colorClass: 'info', link: 'https://disk.yandex.ru/d/xrHMJz0PTcUg9w' },
    { title: 'Физика', icon: 'lightning-charge-fill', colorClass: 'primary', link: 'https://disk.yandex.ru/d/xK23HIsRoMnP-Q' },
    { title: 'Химия', icon: 'droplet-fill', colorClass: 'success', link: 'https://disk.yandex.ru/d/D3KwJnW8x4uemw' },
    { title: 'Биология', icon: 'flower1', colorClass: 'warning', link: 'https://disk.yandex.ru/d/56FBoO3qcUK0Ow' }
  ];

  // Statistics data
  const statistics = [
    { label: 'Проведено олимпиад', value: '5', icon: 'calendar-check' },
    { label: 'Участников в 2024/25', value: '11 000+', icon: 'people' },
    { label: 'Региональных площадок', value: '50', icon: 'geo-alt' },
    { label: 'Регионов-участников', value: '70+', icon: 'map' }
  ];
  
  // Состояние для эффекта параллакса
  const [offsetY, setOffsetY] = useState(0);
  const handleScroll = () => setOffsetY(window.pageYOffset);

  // Состояние для новостей и предметов
  const [news, setNews] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  
  // Инициализируем эффект при монтировании компонента
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    
    // Загружаем новости
    const fetchNews = async () => {
      try {
        const newsData = await getNews();
        setNews(Array.isArray(newsData) ? newsData : []);
      } catch (err) {
        console.error('Error fetching news:', err);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    // Загружаем предметы из Firebase
    const fetchSubjects = async () => {
      try {
        const subjectsData = await subjectsService.getAllSubjects();
        console.log('Subjects loaded from Firebase:', subjectsData);
        setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
      } catch (err) {
        console.error('Error fetching subjects:', err);
        setSubjects([]);
      } finally {
        setSubjectsLoading(false);
      }
    };

    fetchNews();
    fetchSubjects();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-section position-relative overflow-hidden">
        {/* Снежинки */}
        <div className="snowflakes" aria-hidden="true">
          {[...Array(20)].map((_, index) => (
            <div key={index} className="snowflake">
              <div className="inner">❅</div>
            </div>
          ))}
        </div>
        
        {/* Северное сияние */}
        <div className="aurora-effect"></div>
        
        {/* Декоративные элементы */}
        <div 
          className="polar-decoration polar-bear" 
          style={{ transform: `translateY(${offsetY * 0.2}px)` }}
        >
          <i className="bi bi-snow2"></i>
        </div>
        <div 
          className="polar-decoration ice-berg" 
          style={{ transform: `translateY(${offsetY * 0.1}px)` }}
        >
          <i className="bi bi-snow"></i>
        </div>
        
        <div className="container py-5 position-relative z-index-1">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <div className="hero-content" style={{ transform: `translateY(${offsetY * -0.1}px)` }}>
                <h1 className="display-4 fw-bold mb-4 hero-title">
                  Арктическая олимпиада <span className="text-highlight">«Полярный круг»</span>
                </h1>
                <p className="lead mb-4 hero-subtitle">
                  Всероссийская олимпиада школьников по математике, биологии, физике и химии, 
                  проводимая при поддержке Департамента образования ЯНАО.
                </p>
                <div className="d-flex flex-wrap gap-3 hero-buttons">
                  {/* <Link href="/register" legacyBehavior>
                    <a className="btn btn-light btn-lg hero-btn-primary">
                      <span>Регистрация на заключительный этап</span>
                      <i className="bi bi-arrow-right-circle ms-2"></i>
                    </a>
                  </Link> */}
                  <a 
                    href="https://t.me/ArctolympBot" 
                    className="btn btn-outline-light btn-lg hero-btn-secondary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>Узнать свой номер участника</span>
                    <i className="bi bi-telegram ms-2"></i>
                  </a>

                
                </div>
              </div>
            </div>
            <div className="col-lg-5 d-none d-lg-block">
              <div className="hero-image-container" style={{ transform: `translateY(${offsetY * -0.15}px)` }}>
                <div className="hero-image">
                  <div className="hero-snowflake-icon">
                    <i className="bi bi-snow2"></i>
                    <div className="snowflake-glow"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Волна внизу секции */}
        <div className="hero-wave-container">
          <div className="hero-wave"></div>
        </div>
      </section>

      {/* Protocols Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row mb-4">
            <div className="col-12 text-center">
              <h2 className="section-heading mb-3">
                <i className="bi bi-file-earmark-text text-primary me-2"></i>
                Протоколы отборочного этапа
              </h2>
              <p className="lead text-muted">Общие протоколы по предметам</p>
            </div>
          </div>
          
          <div className="row g-4 justify-content-center">
            {/* Math Protocol */}
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 shadow-sm border-0 protocol-card">
                <div className="card-body p-4 text-center">
                  <div className="protocol-icon mb-3">
                    <i className="bi bi-calculator-fill text-info" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <h3 className="h4 mb-3">Математика</h3>
                  <p className="text-muted mb-4">Общий протокол заключительного этапа по математике</p>
                  <a 
                    href="/documents/protocols/Публикация_Отборочный_этап_Общий_протокол_Математика.pdf" 
                    className="btn btn-info btn-lg w-100"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="bi bi-download me-2"></i>
                    Скачать протокол
                  </a>
                </div>
              </div>
            </div>

            {/* Physics Protocol */}
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 shadow-sm border-0 protocol-card">
                <div className="card-body p-4 text-center">
                  <div className="protocol-icon mb-3">
                    <i className="bi bi-lightning-charge-fill text-primary" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <h3 className="h4 mb-3">Физика</h3>
                  <p className="text-muted mb-4">Общий протокол заключительного этапа по физике</p>
                  <a 
                    href="/documents/protocols/Публикация_Отборочный_этап_Общий_протокол_Физика.pdf" 
                    className="btn btn-primary btn-lg w-100"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="bi bi-download me-2"></i>
                    Скачать протокол
                  </a>
                </div>
              </div>
            </div>

            {/* Chemistry Protocol */}
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 shadow-sm border-0 protocol-card">
                <div className="card-body p-4 text-center">
                  <div className="protocol-icon mb-3">
                    <i className="bi bi-droplet-fill text-success" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <h3 className="h4 mb-3">Химия</h3>
                  <p className="text-muted mb-4">Общий протокол заключительного этапа по химии</p>
                  <a 
                    href="https://disk.yandex.ru/d/AF2o3o5icAQVBA" 
                    className="btn btn-success btn-lg w-100"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="bi bi-download me-2"></i>
                    Скачать протокол
                  </a>
                </div>
              </div>
            </div>

            {/* Biology Protocol */}
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 shadow-sm border-0 protocol-card">
                <div className="card-body p-4 text-center">
                  <div className="protocol-icon mb-3">
                    <i className="bi bi-flower1 text-warning" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <h3 className="h4 mb-3">Биология</h3>
                  <p className="text-muted mb-4">Общий протокол заключительного этапа по биологии</p>
                  <a 
                    href="https://disk.yandex.ru/d/ghuy_5HmoihhIA" 
                    className="btn btn-warning btn-lg w-100"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="bi bi-download me-2"></i>
                    Скачать протокол
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Время проведения заключительного этапа по регионам */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row mb-4">
            <div className="col-12 text-center">
              <h2 className="section-heading mb-3">
                <i className="bi bi-clock-history text-primary me-2"></i>
                Время проведения заключительного этапа по регионам
              </h2>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-12 overflow-auto">
              <div className="table-responsive">
                <table className="table table-hover align-middle shadow-sm rounded overflow-hidden">
                  <thead className="table-light">
                    <tr>
                      <th scope="col">Регион / город</th>
                      <th scope="col">Площадка</th>
                      <th scope="col">Адрес</th>
                      <th scope="col">Предметы</th>
                      <th scope="col" className="text-center text-nowrap">Время начала</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FINAL_STAGE_SCHEDULE.map((row, index) => (
                      <tr key={index}>
                        <td className="fw-medium">{row.region}</td>
                        <td>{row.institution}</td>
                        <td className="text-muted small">{row.address}</td>
                        <td className="small">{row.subjects || '—'}</td>
                        <td className="text-center">
                          <span className="badge bg-primary">{row.time}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="mt-4 mx-auto rounded-3 overflow-hidden shadow-sm border border-primary border-opacity-25" style={{ maxWidth: '720px' }}>
            <div className="bg-primary bg-opacity-10 px-4 py-3 d-flex flex-wrap align-items-center justify-content-center gap-3">
              <i className="bi bi-geo-alt-fill text-primary" style={{ fontSize: '1.25rem' }}></i>
              <span className="fw-bold text-dark">Ямало-Ненецкий автономный округ</span>
              <span className="text-muted">55 площадок</span>
              <span className="badge bg-primary px-3 py-2">12:00</span>
            </div>
            <div className="px-4 py-3 bg-white">
              <p className="mb-0 text-muted text-center small lh-lg">
                г. Губкинский · г. Лабытнанги · г. Муравленко · г. Новый Уренгой · г. Ноябрьск · г. Салехард · Приуральский район · Надымский район · Пуровский район · Тазовский район · Шурышкарский район · Ямальский район
              </p>
              <p className="mb-0 mt-2 text-center text-muted" style={{ fontSize: '0.85rem' }}>
                <i className="bi bi-info-circle me-1"></i>
                При необходимости уточняйте детали у организаторов площадки.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Показ работ заключительного этапа */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row mb-4">
            <div className="col-12 text-center">
              <h2 className="section-heading mb-3">
                <i className="bi bi-journal-richtext text-primary me-2"></i>
                Показ работ заключительного этапа
              </h2>
              <p className="lead text-muted">Материалы по каждому предмету</p>
            </div>
          </div>

          <div className="row g-4 justify-content-center">
            {finalStageWorkShowcase.map((subject) => (
              <div key={subject.title} className="col-md-6 col-lg-3">
                <div className="card h-100 shadow-sm border-0 protocol-card">
                  <div className="card-body p-4 text-center d-flex flex-column">
                    <div className="protocol-icon mb-3">
                      <i className={`bi bi-${subject.icon} text-${subject.colorClass}`} style={{ fontSize: '3rem' }}></i>
                    </div>
                    <h3 className="h4 mb-3">{subject.title}</h3>
                    <p className="text-muted mb-4">Показ работ заключительного этапа</p>
                    {subject.link ? (
                      <a
                        href={subject.link}
                        className={`btn btn-${subject.colorClass} btn-lg w-100 mt-auto`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="bi bi-box-arrow-up-right me-2"></i>
                        Открыть материалы
                      </a>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-lg w-100 mt-auto"
                        disabled
                      >
                        Скоро
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-5">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <h2 className="section-heading mb-0">О нашей олимпиаде</h2>
            </div>
          </div>
          
          {/* Statistics Section - Moved here */}
          <div className="row g-4 mb-5">
            {statistics.map((stat, index) => (
              <div key={index} className="col-md-6 col-lg-3">
                <div className="stat-card h-100">
                  <div className="d-flex align-items-center mb-2">
                    <i className={`bi bi-${stat.icon} fs-3 me-3 text-primary`}></i>
                    <h2 className="h1 mb-0">{stat.value}</h2>
                  </div>
                  <p className="mb-0 text-muted">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <p className="lead">
              Арктическая олимпиада «Полярный круг» стартовала в 2020 году как небольшое региональное состязание по математике. Сегодня это масштабная всероссийская олимпиада по четырем предметам, объединяющая участников из более чем 70 регионов России и стран СНГ — Беларуси, Молдовы, Кыргызстана и Узбекистана.
              </p>
              <p className="mb-4">
                Важный принцип, по которому проводится олимпиада — это составление заданий для учащихся младших классов (4-6 классы), 
                чтобы способствовать их вовлечению в олимпиадное движение и достижению высоких академических результатов.
              </p>
              <Link href="/about/history" legacyBehavior>
                <a className="btn btn-outline-primary">Подробнее об истории олимпиады</a>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Subjects Section */}
      <section className="py-5">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12">
              <h2 className="section-heading side-bordered-header mb-0">Профили олимпиады</h2>
            </div>
          </div>
          {subjectsLoading ? (
            <div className="d-flex justify-content-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Загрузка предметов...</span>
              </div>
            </div>
          ) : subjects.length > 0 ? (
            <div className="row g-4">
              {subjects.map((subject) => (
                <div key={subject.id} className="col-md-6 col-lg-3">
                  <SubjectCard
                    title={subject.title}
                    description={subject.shortDescription}
                    icon={subject.icon}
                    link={subject.link}
                    color={subject.color}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-info">
              Предметы пока не загружены
            </div>
          )}
        </div>
      </section>

      {/* Registration CTA */}
      {/* <section className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="card border-0 shadow">
                <div className="card-body p-5">
                  <div className="row align-items-center">
                    <div className="col-lg-8 mb-4 mb-lg-0">
                      <h2 className="section-heading mb-3">Регистрация участников открыта!</h2>
                      <p className="mb-0">
                        Приглашаем школьников 4-11 классов принять участие в Арктической олимпиаде «Полярный круг». 
                        Отборочный этап пройдет с 1 по 15 ноября 2024 года.
                      </p>
                    </div>
                    <div className="col-lg-4 text-center text-lg-end">
                      <Link href="/register" legacyBehavior>
                        <a className="btn btn-primary btn-lg">Зарегистрироваться</a>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* News Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="section-heading side-bordered-header mb-0">Новости олимпиады</h2>
                <Link href="/news" legacyBehavior>
                  <a className="btn btn-outline-primary">Все новости</a>
                </Link>
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="d-flex justify-content-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Загрузка...</span>
              </div>
            </div>
          ) : news.length > 0 ? (
            <div className="row g-4">
              {news.slice(0, 3).map((newsItem) => (
                <div key={newsItem.id} className="col-md-4">
                  <NewsCard
                    title={newsItem.title}
                    date={newsItem.date}
                    summary={newsItem.summary}
                    link={`/news/${newsItem.id}`}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-info">
              Новости пока отсутствуют
            </div>
          )}
        </div>
      </section>

      {/* Организаторы и партнеры */}
      <OrganizersAndPartners />

      {/* FAQ Section */}
      <FAQSection />
    </Layout>
  );
} 