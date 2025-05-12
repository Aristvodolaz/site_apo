import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function AdminLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Проверяем аутентификацию при загрузке
  useEffect(() => {
    const validateAuth = async () => {
      try {
        const res = await fetch('/api/auth/validate');
        const data = await res.json();

        if (data.authenticated) {
          setUser(data.user);
        } else {
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Ошибка проверки аутентификации:', error);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    validateAuth();
  }, [router]);

  // Функция для выхода из админ-панели
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Боковая панель навигации */}
        <div className="col-md-3 col-lg-2 d-md-block bg-light sidebar" style={{ minHeight: '100vh' }}>
          <div className="position-sticky pt-3">
            <h5 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
              <span>Админ-панель</span>
            </h5>
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link href="/admin/dashboard" className={`nav-link ${router.pathname === '/admin/dashboard' ? 'active' : ''}`}>
                  Главная
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/admin/news" className={`nav-link ${router.pathname.startsWith('/admin/news') ? 'active' : ''}`}>
                  Управление новостями
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/admin/content" className={`nav-link ${router.pathname.startsWith('/admin/content') ? 'active' : ''}`}>
                  Содержимое страниц
                </Link>
              </li>
            </ul>

            <hr />
            
            <div className="px-3 mt-4">
              {user && <p className="mb-1">Вы вошли как: <strong>{user.username}</strong></p>}
              <button 
                onClick={handleLogout} 
                className="btn btn-outline-danger btn-sm mt-2"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>

        {/* Основное содержимое */}
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
          {children}
        </main>
      </div>
    </div>
  );
} 