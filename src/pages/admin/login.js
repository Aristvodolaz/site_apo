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

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    // Проверяем учетные данные локально
    if (formData.login === ADMIN_CREDENTIALS.login && 
        formData.password === ADMIN_CREDENTIALS.password) {
      // Устанавливаем флаг авторизации
      sessionStorage.setItem('isAdminAuthenticated', 'true');
      
      // Логируем успешный вход
      addLog('Вход в систему', formData.login, 'success');
      
      // Перенаправляем на админ панель
      router.push('/admin');
    } else {
      // Логируем неудачную попытку
      addLog('Попытка входа', formData.login, 'error');
      setError('Неверный логин или пароль');
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
            <div className="card shadow-sm border-0 rounded-4">
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <div className="display-6 mb-3 text-primary">
                    <i className="bi bi-shield-lock"></i>
                  </div>
                  <h2 className="h4 mb-2">Вход в админ-панель</h2>
                  <p className="text-muted small mb-0">
                    Используйте свои учетные данные для входа
                  </p>
                </div>

                {error && (
                  <div className="alert alert-danger d-flex align-items-center rounded-3" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="login" className="form-label small fw-medium">Логин</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-person text-muted"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control form-control-lg border-start-0 ps-0"
                        id="login"
                        name="login"
                        value={formData.login}
                        onChange={handleChange}
                        required
                        autoComplete="username"
                        placeholder="Введите логин"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label small fw-medium">Пароль</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-key text-muted"></i>
                      </span>
                      <input
                        type="password"
                        className="form-control form-control-lg border-start-0 ps-0"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        autoComplete="current-password"
                        placeholder="Введите пароль"
                      />
                    </div>
                  </div>

                  <div className="d-grid">
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg shadow-sm"
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