import Layout from '../../components/Layout';
import PageHeader from '../../components/PageHeader';
import NewsCard from '../../components/NewsCard';
import { newsData } from '../../data/newsData';
import Link from 'next/link';
import { useState } from 'react';

export default function News() {
  // State for year filter
  const [activeYear, setActiveYear] = useState('all');
  
  // Сортируем новости по дате (сначала новые)
  const sortedNews = [...newsData].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Разделяем новости на главную и остальные
  const [mainNews, ...otherNews] = sortedNews;
  
  // Получаем уникальные годы из новостей
  const getYears = () => {
    const years = sortedNews.map(news => new Date(news.date).getFullYear());
    return ['all', ...new Set(years)];
  };
  
  // Фильтруем новости по году
  const getFilteredNews = () => {
    if (activeYear === 'all') return otherNews;
    return otherNews.filter(news => new Date(news.date).getFullYear() === parseInt(activeYear));
  };

  // Форматируем дату главной новости
  const mainNewsDate = new Date(mainNews.date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <Layout title="Новости">
      <PageHeader 
        title="Новости олимпиады" 
        subtitle="Актуальные новости и объявления Арктической олимпиады «Полярный круг»"
      />
      
      {/* Волновой эффект */}
      <div className="news-wave-container">
        <div className="news-wave"></div>
      </div>
      
      <div className="container py-5">
        {/* Главная новость */}
        <div className="featured-news mb-5">
          <div className="row">
            <div className="col-lg-10 mx-auto">
              <div className="featured-news-card">
                <div className="featured-news-badge">
                  <i className="bi bi-star-fill"></i>
                  <span>Важное</span>
                </div>
                <div className="card border-0">
                  <div className="featured-news-image-container">
                    <div className="featured-news-image"></div>
                  </div>
                  <div className="card-body p-4 p-lg-5">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div className="featured-news-date">
                        <i className="bi bi-calendar3 me-2"></i>
                        {mainNewsDate}
                      </div>
                    </div>
                    <h2 className="featured-news-title mb-4">{mainNews.title}</h2>
                    <p className="featured-news-summary mb-4">{mainNews.summary}</p>
                    <div className="featured-news-link-container">
                      <Link href={mainNews.link} legacyBehavior>
                        <a className="featured-news-link">
                          Читать подробнее
                          <i className="bi bi-arrow-right ms-2"></i>
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Фильтр по годам */}
        <div className="news-filter mb-5">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="section-title h4 mb-0">Архив новостей</h3>
                <div className="news-year-filter">
                  <div className="filter-tabs">
                    {getYears().map(year => (
                      <button
                        key={year}
                        className={`filter-tab ${activeYear === year ? 'active' : ''}`}
                        onClick={() => setActiveYear(year)}
                      >
                        {year === 'all' ? 'Все' : year}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Остальные новости */}
        <div className="other-news">
          <div className="row g-4">
            {getFilteredNews().map((newsItem) => (
              <div key={newsItem.id} className="col-md-6 col-lg-4">
                <NewsCard
                  title={newsItem.title}
                  date={newsItem.date}
                  summary={newsItem.summary}
                  link={newsItem.link}
                />
              </div>
            ))}
          </div>
          
          {/* Если нет новостей за выбранный год */}
          {getFilteredNews().length === 0 && (
            <div className="news-empty-state text-center py-5">
              <i className="bi bi-newspaper fs-1 mb-3"></i>
              <h4>Нет новостей за {activeYear} год</h4>
              <p className="text-muted">Выберите другой год из архива или просмотрите все новости</p>
              <button 
                className="btn btn-outline-primary mt-3"
                onClick={() => setActiveYear('all')}
              >
                Показать все новости
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
} 