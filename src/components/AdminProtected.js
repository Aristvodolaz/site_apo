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
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </div>
        </div>
      </div>
    );
  }

  return children;
} 