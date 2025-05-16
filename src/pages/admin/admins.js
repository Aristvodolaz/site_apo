import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminsPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    name: '',
    role: 'admin'
  });
  const [formVisible, setFormVisible] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const router = useRouter();

  // Загрузка списка администраторов
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/admins');
      
      if (!response.ok) {
        throw new Error('Ошибка при загрузке администраторов');
      }
      
      const data = await response.json();
      setAdmins(data.admins || []);
    } catch (error) {
      console.error('Ошибка при загрузке администраторов:', error);
      setError('Не удалось загрузить список администраторов. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Обработка отправки формы добавления администратора
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormLoading(true);
    
    try {
      const response = await fetch('/api/admin/admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Ошибка при создании администратора');
      }
      
      // Очищаем форму и обновляем список
      setFormData({
        login: '',
        password: '',
        name: '',
        role: 'admin'
      });
      setFormVisible(false);
      fetchAdmins();
    } catch (error) {
      console.error('Ошибка при создании администратора:', error);
      setFormError(error.message || 'Не удалось создать администратора. Пожалуйста, попробуйте позже.');
    } finally {
      setFormLoading(false);
    }
  };

  // Обработка изменения полей формы
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Обработка изменения статуса администратора
  const handleStatusChange = async (id, active) => {
    try {
      const response = await fetch(`/api/admin/admins/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ active: !active })
      });
      
      if (!response.ok) {
        throw new Error('Ошибка при изменении статуса');
      }
      
      // Обновляем список после изменения
      fetchAdmins();
    } catch (error) {
      console.error('Ошибка при изменении статуса:', error);
      setError('Не удалось изменить статус администратора. Пожалуйста, попробуйте позже.');
    }
  };

  // Обработка удаления администратора
  const handleDelete = async (id) => {
    if (!confirm('Вы уверены, что хотите удалить этого администратора?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/admins/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Ошибка при удалении администратора');
      }
      
      // Обновляем список после удаления
      fetchAdmins();
    } catch (error) {
      console.error('Ошибка при удалении администратора:', error);
      setError('Не удалось удалить администратора. Пожалуйста, попробуйте позже.');
    }
  };

  return (
    <AdminLayout>
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h3">Управление администраторами</h1>
          <button
            className="btn btn-primary"
            onClick={() => setFormVisible(!formVisible)}
          >
            {formVisible ? (
              <>
                <i className="bi bi-x-lg me-2"></i>
                Отменить
              </>
            ) : (
              <>
                <i className="bi bi-plus-lg me-2"></i>
                Добавить администратора
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        )}

        {formVisible && (
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-light">
              <h5 className="card-title mb-0">Добавление нового администратора</h5>
            </div>
            <div className="card-body">
              {formError && (
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="login" className="form-label">Логин</label>
                    <input
                      type="text"
                      className="form-control"
                      id="login"
                      name="login"
                      value={formData.login}
                      onChange={handleChange}
                      required
                      disabled={formLoading}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="password" className="form-label">Пароль</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={formLoading}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="name" className="form-label">Имя</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={formLoading}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="role" className="form-label">Роль</label>
                    <select
                      className="form-select"
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      disabled={formLoading}
                    >
                      <option value="admin">Администратор</option>
                      <option value="editor">Редактор</option>
                      <option value="superadmin">Суперадминистратор</option>
                    </select>
                  </div>
                  <div className="col-12 mt-3">
                    <div className="d-flex justify-content-end">
                      <button
                        type="button"
                        className="btn btn-outline-secondary me-2"
                        onClick={() => setFormVisible(false)}
                        disabled={formLoading}
                      >
                        Отмена
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={formLoading}
                      >
                        {formLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Создание...
                          </>
                        ) : (
                          'Создать администратора'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="card shadow-sm">
          <div className="card-body">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Загрузка...</span>
                </div>
                <p className="mt-3 text-muted">Загрузка списка администраторов...</p>
              </div>
            ) : admins.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-people fs-1 text-muted"></i>
                <p className="mt-3">Нет зарегистрированных администраторов</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th scope="col">Логин</th>
                      <th scope="col">Имя</th>
                      <th scope="col">Роль</th>
                      <th scope="col">Последний вход</th>
                      <th scope="col">Статус</th>
                      <th scope="col">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map(admin => (
                      <tr key={admin.id}>
                        <td>{admin.login}</td>
                        <td>{admin.name}</td>
                        <td>
                          {admin.role === 'superadmin' && <span className="badge bg-danger">Суперадмин</span>}
                          {admin.role === 'admin' && <span className="badge bg-primary">Администратор</span>}
                          {admin.role === 'editor' && <span className="badge bg-info">Редактор</span>}
                        </td>
                        <td>{admin.lastLogin ? new Date(admin.lastLogin).toLocaleString() : 'Никогда'}</td>
                        <td>
                          <span className={`badge ${admin.active !== false ? 'bg-success' : 'bg-secondary'}`}>
                            {admin.active !== false ? 'Активен' : 'Заблокирован'}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex">
                            <button
                              className={`btn btn-sm ${admin.active !== false ? 'btn-outline-warning' : 'btn-outline-success'} me-2`}
                              onClick={() => handleStatusChange(admin.id, admin.active !== false)}
                              title={admin.active !== false ? 'Заблокировать' : 'Активировать'}
                            >
                              <i className={`bi ${admin.active !== false ? 'bi-pause-fill' : 'bi-play-fill'}`}></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(admin.id)}
                              title="Удалить"
                              disabled={admin.role === 'superadmin'}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 