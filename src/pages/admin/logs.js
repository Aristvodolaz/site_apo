import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import AdminProtected from '../../components/AdminProtected';

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Получаем логи из localStorage
    const storedLogs = localStorage.getItem('admin_logs');
    if (storedLogs) {
      setLogs(JSON.parse(storedLogs));
    }
  }, []);

  return (
    <AdminProtected>
      <Layout title="Админ панель | Логи">
        <div className="container py-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h3 mb-0">Логи системы</h1>
            <button 
              className="btn btn-danger btn-sm"
              onClick={() => {
                localStorage.removeItem('admin_logs');
                setLogs([]);
              }}
            >
              <i className="bi bi-trash me-2"></i>
              Очистить логи
            </button>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Время</th>
                      <th>Действие</th>
                      <th>Пользователь</th>
                      <th>Статус</th>
                      <th>IP адрес</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.length > 0 ? (
                      logs.map((log, index) => (
                        <tr key={index}>
                          <td style={{ whiteSpace: 'nowrap' }}>{new Date(log.timestamp).toLocaleString()}</td>
                          <td>{log.action}</td>
                          <td>{log.user}</td>
                          <td>
                            <span className={`badge bg-${log.status === 'success' ? 'success' : 'danger'}`}>
                              {log.status === 'success' ? 'Успешно' : 'Ошибка'}
                            </span>
                          </td>
                          <td>{log.ip}</td>
                        </tr>
                      )).reverse()
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-4 text-muted">
                          Логи отсутствуют
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </AdminProtected>
  );
} 