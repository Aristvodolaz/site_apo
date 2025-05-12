import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { newsData } from '../../data/newsData';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalNews: 0,
    recentNews: []
  });
  const [useFirebase, setUseFirebase] = useState(false);

  useEffect(() => {
    // В реальном приложении здесь будет запрос к API
    // На данном этапе используем данные из файла
    const news = newsData;
    
    // Сортируем новости по дате (от новых к старым)
    const sortedNews = [...news].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
    
    setStats({
      totalNews: news.length,
      recentNews: sortedNews.slice(0, 3) // Последние 3 новости
    });

    // Проверяем наличие конфигурации Firebase
    fetch('/api/admin/checkFirebase')
      .then(response => response.json())
      .then(data => {
        setUseFirebase(data.configured);
      })
      .catch(error => {
        console.error('Ошибка проверки Firebase:', error);
        setUseFirebase(false);
      });
  }, []);

  return (
    <AdminLayout>
      <Head>
        <title>Панель управления | Арктическая олимпиада</title>
      </Head>

      <div className="mb-4">
        <h1>Панель управления</h1>
        <p className="text-muted">Добро пожаловать в административную панель сайта Арктической олимпиады "Полярный круг"</p>
      </div>

      {!useFirebase && (
        <div className="alert alert-warning mb-4">
          <h5>Firebase не настроен</h5>
          <p className="mb-2">
            Для полноценной работы с данными рекомендуется настроить Firebase и выполнить миграцию данных.
          </p>
          <Link href="/admin/migrate" className="btn btn-sm btn-primary">
            Настроить Firebase
          </Link>
        </div>
      )}

      <div className="row">
        <div className="col-md-6 col-lg-4 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Статистика</h5>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="text-primary fw-bold h4 mb-0">{stats.totalNews}</div>
                <div className="text-muted">Всего новостей</div>
              </div>
              {useFirebase && (
                <div className="mt-3">
                  <span className="badge bg-success">Firebase активен</span>
                </div>
              )}
            </div>
            <div className="card-footer bg-transparent">
              <Link href="/admin/news" className="text-decoration-none">
                Управление новостями
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-8 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Последние новости</h5>
              <div className="list-group list-group-flush">
                {stats.recentNews.map(item => (
                  <div key={item.id} className="list-group-item list-group-item-action px-0">
                    <div className="d-flex w-100 justify-content-between">
                      <h6 className="mb-1">{item.title}</h6>
                      <small className="text-muted">
                        {new Date(item.date).toLocaleDateString('ru-RU')}
                      </small>
                    </div>
                    <p className="mb-1 text-muted small">{item.summary.substring(0, 100)}...</p>
                    <div className="mt-2">
                      <Link href={`/admin/news/edit/${item.id}`} className="btn btn-sm btn-outline-primary me-2">
                        Редактировать
                      </Link>
                      <Link href={item.link} target="_blank" className="btn btn-sm btn-outline-secondary">
                        Просмотр
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card-footer bg-transparent">
              <Link href="/admin/news/create" className="btn btn-primary">
                Добавить новость
              </Link>
            </div>
          </div>
        </div>

        <div className="col-12 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Быстрые действия</h5>
              <div className="d-flex flex-wrap gap-2 mt-3">
                <Link href="/admin/news" className="btn btn-outline-primary">
                  Управление новостями
                </Link>
                <Link href="/admin/content" className="btn btn-outline-secondary">
                  Редактирование страниц
                </Link>
                <Link href="/admin/migrate" className="btn btn-outline-info">
                  Миграция данных
                </Link>
                <Link href="/" target="_blank" className="btn btn-outline-dark">
                  Просмотр сайта
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 