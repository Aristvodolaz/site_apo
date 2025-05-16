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
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Загрузка...</span>
          </div>
          <p className="text-muted mb-0">Загрузка административной панели...</p>
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
        
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link href="/admin/dashboard" className={`nav-link ${router.pathname === '/admin/dashboard' ? 'active' : ''}`}>
                  <i className="bi bi-speedometer2 me-2"></i>
                  Главная
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/admin/news" className={`nav-link ${router.pathname.startsWith('/admin/news') ? 'active' : ''}`}>
                  <i className="bi bi-newspaper me-2"></i>
                  Управление новостями
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/admin/content" className={`nav-link ${router.pathname.startsWith('/admin/content') ? 'active' : ''}`}>
                  <i className="bi bi-file-earmark-text me-2"></i>
                  Содержимое страниц
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/admin/migrate" className={`nav-link ${router.pathname === '/admin/migrate' ? 'active' : ''}`}>
                  <i className="bi bi-arrow-left-right me-2"></i>
                  Миграция данных
                </Link>
              </li>
              
              {/* Отображаем пункт управления администраторами только для суперадминов */}
              {user && user.role === 'superadmin' && (
                <li className="nav-item">
                  <Link href="/admin/admins" className={`nav-link ${router.pathname === '/admin/admins' ? 'active' : ''}`}>
                    <i className="bi bi-people-fill me-2"></i>
                    Управление администраторами
                  </Link>
                </li>
              )}
            </ul>

            <hr />
            
            <div className="px-3 mt-4">
              {user && (
                <div className="mb-3">
                  <p className="mb-1 d-flex align-items-center">
                    <i className="bi bi-person-circle me-2"></i>
                    <strong>{user.name || user.username}</strong>
                  </p>
                  <small className="d-block text-muted">
                    {user.role === 'superadmin' && 'Суперадминистратор'}
                    {user.role === 'admin' && 'Администратор'}
                    {user.role === 'editor' && 'Редактор'}
                  </small>
                </div>
              )}
              <button 
                onClick={handleLogout} 
                className="btn btn-outline-danger btn-sm d-flex align-items-center"
              >
                <i className="bi bi-box-arrow-right me-2"></i>
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