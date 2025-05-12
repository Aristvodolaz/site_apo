import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '../../../components/admin/AdminLayout';
import { newsData } from '../../../data/newsData';

export default function AdminNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // В реальном приложении здесь будет запрос к API
    // Сейчас используем данные из файла
    setNews(newsData);
    setLoading(false);
  }, []);

  const handleDeleteNews = async (id) => {
    if (confirm('Вы уверены, что хотите удалить эту новость?')) {
      try {
        // В реальном приложении здесь будет запрос к API
        // Для примера просто удаляем из состояния
        setNews(news.filter(item => item.id !== id));
        alert('Новость успешно удалена');
      } catch (error) {
        console.error('Ошибка при удалении новости:', error);
        alert('Произошла ошибка при удалении новости');
      }
    }
  };

  return (
    <AdminLayout>
      <Head>
        <title>Управление новостями | Админ-панель</title>
      </Head>
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Управление новостями</h1>
        <Link href="/admin/news/create" className="btn btn-primary">
          Добавить новость
        </Link>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Заголовок</th>
                <th>Дата</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {news.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.title}</td>
                  <td>{new Date(item.date).toLocaleDateString('ru-RU')}</td>
                  <td>
                    <div className="btn-group">
                      <Link href={`/admin/news/edit/${item.id}`} className="btn btn-sm btn-outline-secondary">
                        Редактировать
                      </Link>
                      <button
                        onClick={() => handleDeleteNews(item.id)}
                        className="btn btn-sm btn-outline-danger"
                      >
                        Удалить
                      </button>
                      <Link href={item.link} target="_blank" className="btn btn-sm btn-outline-info">
                        Просмотр
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
} 