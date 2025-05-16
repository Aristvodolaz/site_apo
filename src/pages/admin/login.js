import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Захардкоженные учетные данные
const ADMIN_CREDENTIALS = {
  login: 'admin',
  password: 'arctic2025olympiad'
};

// Функция для добавления лога
const addLog = (action, user, status) => {
  const logs = JSON.parse(localStorage.getItem('admin_logs') || '[]');
  logs.push({
    timestamp: new Date().toISOString(),
    action,
    user,
    status,
    ip: 'local'
  });
  localStorage.setItem('admin_logs', JSON.stringify(logs));
};

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    login: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const router = useRouter();

  // Проверяем авторизацию при загрузке страницы
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('isAdminAuthenticated') === 'true';
    if (isAuthenticated) {
      router.push('/admin');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      console.log('Попытка входа:', formData.login); // Отладочный лог

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.login,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Успешная авторизация'); // Отладочный лог
        
        // Логируем успешный вход
        addLog('Вход в систему', formData.login, 'success');
        
        console.log('Перенаправление на /admin'); // Отладочный лог
        
        // Перенаправляем на админ панель
        router.push('/admin');
      } else {
        console.log('Ошибка авторизации:', data.message); // Отладочный лог
        
        // Логируем неудачную попытку
        addLog('Попытка входа', formData.login, 'error');
        setError(data.message || 'Неверный логин или пароль');
      }
    } catch (err) {
      console.error('Ошибка при входе:', err); // Отладочный лог
      setError('Произошла ошибка при входе в систему');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Layout title="Вход в админ-панель">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <div className="display-6 mb-3">
                    <i className="bi bi-shield-lock"></i>
                  </div>
                  <h2 className="h4">Вход в админ-панель</h2>
                  <p className="text-muted small mb-0">
                    Используйте свои учетные данные для входа
                  </p>
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="login" className="form-label">Логин</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-person"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        id="login"
                        name="login"
                        value={formData.login}
                        onChange={handleChange}
                        required
                        autoComplete="username"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label">Пароль</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-key"></i>
                      </span>
                      <input
                        type="password"
                        className="form-control form-control-lg"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        autoComplete="current-password"
                      />
                    </div>
                  </div>

                  <div className="d-grid">
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg"
                    >
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Войти
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 