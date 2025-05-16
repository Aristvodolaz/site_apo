import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function AdminProtected({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateAuth = async () => {
      try {
        const res = await fetch('/api/auth/validate');
        const data = await res.json();

        if (!data.authenticated) {
          router.push('/admin/login');
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Ошибка проверки аутентификации:', error);
        router.push('/admin/login');
      }
    };

    validateAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Загрузка...</span>
          </div>
          <p className="text-muted mb-0">Проверка доступа к административной панели...</p>
        </div>
      </div>
    );
  }

  return children;
} 