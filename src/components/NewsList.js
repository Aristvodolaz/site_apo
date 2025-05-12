import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getNews } from '../lib/dataService';

export default function NewsList() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const newsData = await getNews();
        setNews(Array.isArray(newsData) ? newsData : []);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Не удалось загрузить новости');
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  if (!Array.isArray(news) || news.length === 0) {
    return (
      <div className="alert alert-info" role="alert">
        Новости пока отсутствуют
      </div>
    );
  }

  return (
    <div className="news-list">
      {news.map((item) => (
        <div key={item.id} className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">{item.title}</h5>
            <h6 className="card-subtitle mb-2 text-muted">
              {new Date(item.date).toLocaleDateString('ru-RU')}
            </h6>
            <p className="card-text">{item.summary}</p>
            <Link href={`/news/${item.id}`} className="btn btn-primary">
              Читать далее
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
} 