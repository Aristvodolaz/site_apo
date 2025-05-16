import Head from 'next/head';
import Navbar from './Navbar';
import Footer from './Footer';
import { useRouter } from 'next/router';

export default function Layout({ children, title = 'Арктическая олимпиада' }) {
  const router = useRouter();
  const isAdminPage = router.pathname.startsWith('/admin');

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST'
      });
      router.push('/admin/login');
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  const pageTitle = `${title} | Полярный круг`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Navbar />
      {isAdminPage && (
        <div className="bg-light py-2">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center">
              <nav aria-label="breadcrumb">
                
              </nav>
              <button 
                className="btn btn-outline-danger btn-sm"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right me-2"></i>
                Выйти
              </button>
            </div>
          </div>
        </div>
      )}
      <main>{children}</main>
      <Footer />
    </>
  );
} 