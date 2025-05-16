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
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [focusedField, setFocusedField] = useState(null);
  const router = useRouter();

  // Проверяем авторизацию при загрузке страницы
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/validate');
        const data = await res.json();
        
        if (data.authenticated) {
          router.push('/admin');
        }
      } catch (error) {
        console.error('Ошибка при проверке аутентификации:', error);
      } finally {
        setInitialLoading(false);
      }
    };
    
    // Проверяем, инициализирован ли дефолтный админ
    const initializeAdmin = async () => {
      try {
        await fetch('/api/admin/initialize', { method: 'POST' });
      } catch (error) {
        console.error('Ошибка при инициализации админа:', error);
      }
    };
    
    checkAuth();
    initializeAdmin();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Отправляем запрос на сервер для аутентификации
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: formData.login,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Дополнительно устанавливаем флаг в sessionStorage для совместимости
        sessionStorage.setItem('isAdminAuthenticated', 'true');
        
        // Логируем успешный вход
        addLog('Вход в систему', formData.login, 'success');
        
        // Перенаправляем на админ панель
        router.push('/admin');
      } else {
        // Логируем неудачную попытку
        addLog('Попытка входа', formData.login, 'error');
        setError(data.message || 'Неверный логин или пароль');
      }
    } catch (error) {
      console.error('Ошибка при входе:', error);
      setError('Произошла ошибка при входе. Пожалуйста, попробуйте позже.');
      addLog('Ошибка входа', formData.login, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFocus = (field) => {
    setFocusedField(field);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  // Отображаем загрузку при начальной проверке аутентификации
  if (initialLoading) {
    return (
      <Layout title="Вход в админ-панель">
        <div className="container py-5">
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <div className="text-center">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Загрузка...</span>
              </div>
              <p className="text-muted mb-0">Проверка аутентификации...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Вход в админ-панель">
      <style jsx>{`
        .card {
          transition: transform 0.3s ease;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
        }

        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
        }

        .btn-primary {
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .btn-primary::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 5px;
          height: 5px;
          background: rgba(255, 255, 255, 0.3);
          opacity: 0;
          border-radius: 100%;
          transform: scale(1, 1) translate(-50%);
          transform-origin: 50% 50%;
        }

        .btn-primary:hover::after {
          animation: ripple 1s ease-out;
        }

        @keyframes ripple {
          0% {
            transform: scale(0, 0);
            opacity: 0.5;
          }
          100% {
            transform: scale(30, 30);
            opacity: 0;
          }
        }

        .form-login {
          animation: fadeIn 0.5s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .input-group {
          margin-bottom: 1.5rem;
        }
        
        .input-icon {
          transition: all 0.2s ease;
          color: #6c757d;
        }
        
        .form-label {
          transition: all 0.2s ease;
        }
        
        .input-group:focus-within .input-icon {
          color: #0d6efd;
        }
      `}</style>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card border-0 rounded-4 overflow-hidden">
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <div className={`display-6 mb-3 ${loading ? 'text-muted' : 'text-primary'}`} 
                       style={{ transition: 'all 0.3s ease' }}>
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
                    <div>{error}</div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="form-login">
                  <div className="mb-3">
                    <label htmlFor="login" className="form-label">Логин</label>
                    <div className="input-group">
                      <span className={`input-group-text ${focusedField === 'login' ? 'bg-light border-primary' : 'bg-light'}`}
                            style={{ transition: 'all 0.3s ease' }}>
                        <i className={`bi bi-person input-icon ${focusedField === 'login' ? 'text-primary' : ''}`}></i>
                      </span>
                      <input
                        type="text"
                        className={`form-control form-control-lg ${focusedField === 'login' ? 'border-primary' : ''}`}
                        id="login"
                        name="login"
                        value={formData.login}
                        onChange={handleChange}
                        onFocus={() => handleFocus('login')}
                        onBlur={handleBlur}
                        required
                        autoComplete="username"
                        placeholder="Введите логин"
                        disabled={loading}
                        style={{ transition: 'all 0.3s ease' }}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label">Пароль</label>
                    <div className="input-group">
                      <span className={`input-group-text ${focusedField === 'password' ? 'bg-light border-primary' : 'bg-light'}`}
                            style={{ transition: 'all 0.3s ease' }}>
                        <i className={`bi bi-key input-icon ${focusedField === 'password' ? 'text-primary' : ''}`}></i>
                      </span>
                      <input
                        type="password"
                        className={`form-control form-control-lg ${focusedField === 'password' ? 'border-primary' : ''}`}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onFocus={() => handleFocus('password')}
                        onBlur={handleBlur}
                        required
                        autoComplete="current-password"
                        placeholder="Введите пароль"
                        disabled={loading}
                        style={{ transition: 'all 0.3s ease' }}
                      />
                    </div>
                  </div>

                  <div className="d-grid mt-4">
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg"
                      disabled={loading}
                      style={{ 
                        borderRadius: '10px', 
                        padding: '12px',
                        transition: 'all 0.3s ease',
                        fontWeight: '500'
                      }}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Выполняется вход...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-box-arrow-in-right me-2"></i>
                          Войти
                        </>
                      )}
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