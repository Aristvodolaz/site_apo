import Head from 'next/head';
import Layout from '../components/Layout';
import NewsCard from '../components/NewsCard';
import SubjectCard from '../components/SubjectCard';
import Link from 'next/link';
import { subjectsData } from '../data/subjectsData';
import { useEffect, useState } from 'react';
import { getNews } from '../lib/dataService';

export default function Home() {
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

  // Состояние для новостей
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  
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

    fetchNews();
    
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
                  Арктическая олимпиада <span className="text-highlight">«Полярный круг»</span> 2025
                </h1>
                <p className="lead mb-4 hero-subtitle">
                  Всероссийская олимпиада школьников по математике, биологии, физике и химии, 
                  проводимая при поддержке Департамента образования ЯНАО.
                </p>
                <div className="d-flex flex-wrap gap-3 hero-buttons">
                  <Link href="/register" legacyBehavior>
                    <a className="btn btn-light btn-lg hero-btn-primary">
                      <span>Зарегистрироваться</span>
                      <i className="bi bi-arrow-right-circle ms-2"></i>
                    </a>
                  </Link>
                  <Link href="/about/history" legacyBehavior>
                    <a className="btn btn-outline-light btn-lg hero-btn-secondary">
                      <span>Узнать больше</span>
                      <i className="bi bi-info-circle ms-2"></i>
                    </a>
                  </Link>
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
                Арктическая олимпиада «Полярный круг» проводится с 2020 года. 
                За это время из небольшой региональной олимпиады по математике она выросла во всероссийское соревнование 
                по четырем предметам с участниками из более чем 70 регионов России.
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
          <div className="row g-4">
            {subjectsData.map((subject) => (
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
        </div>
      </section>

      {/* Registration CTA */}
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="card border-0 shadow">
                <div className="card-body p-5">
                  <div className="row align-items-center">
                    <div className="col-lg-8 mb-4 mb-lg-0">
                      <h2 className="section-heading mb-3">Регистрация участников открыта!</h2>
                      <p className="mb-0">
                        Приглашаем школьников 4-11 классов принять участие в Арктической олимпиаде «Полярный круг» 2025. 
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
      </section>

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

      {/* Partners Section */}
      <section className="py-5 bg-light partners-section">
        <div className="container py-4">
          <h2 className="section-heading side-bordered-header mb-5 text-center">Организаторы и партнеры</h2>
          <div className="row justify-content-center g-5">
            <div className="col-md-4">
              <div className="partner-card h-100 text-center fade-in" style={{animationDelay: "0.1s"}}>
                <div className="partner-icon-container">
                  <i className="bi bi-building"></i>
                </div>
                <h4 className="mb-3 mt-4">Департамент образования ЯНАО</h4>
                <p className="text-muted">Главный организатор Арктической олимпиады</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="partner-card h-100 text-center fade-in" style={{animationDelay: "0.2s"}}>
                <div className="partner-icon-container">
                  <i className="bi bi-award"></i>
                </div>
                <h4 className="mb-3 mt-4">Ассоциация победителей олимпиад</h4>
                <p className="text-muted">Научно-методическое сопровождение олимпиады</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="partner-card h-100 text-center fade-in" style={{animationDelay: "0.3s"}}>
                <div className="partner-icon-container">
                  <i className="bi bi-mortarboard"></i>
                </div>
                <h4 className="mb-3 mt-4">Центр педагогического мастерства</h4>
                <p className="text-muted">Подготовка заданий и проверка работ</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
} 