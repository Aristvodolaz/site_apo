import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const isActive = (path) => {
    return router.pathname === path ? 'active' : '';
  };

  return (
    <nav className={`modern-navbar navbar navbar-expand-lg navbar-light sticky-top ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container">
        <Link href="/" legacyBehavior>
          <a className="navbar-brand d-flex align-items-center">
            <div className="brand-icon me-2">
              <i className="bi bi-snow2"></i>
            </div>
            <div>
              <span className="brand-text">Арктическая олимпиада</span>
            </div>
          </a>
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link href="/" legacyBehavior>
                <a className={`nav-link ${isActive('/')}`}>
                  <span className="nav-link-text">Главная</span>
                </a>
              </Link>
            </li>
            <li className="nav-item dropdown">
              <a 
                className={`nav-link dropdown-toggle ${router.pathname.startsWith('/about') ? 'active' : ''}`}
                href="#" 
                role="button" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                <span className="nav-link-text">Об олимпиаде</span>
              </a>
              <ul className="dropdown-menu">
                <li>
                  <Link href="/about/history" legacyBehavior>
                    <a className={`dropdown-item ${isActive('/about/history')}`}>
                      <i className="bi bi-clock-history me-2"></i>История
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/about/archive" legacyBehavior>
                    <a className={`dropdown-item ${isActive('/about/archive')}`}>
                      <i className="bi bi-archive me-2"></i>Архив
                    </a>
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <a 
                className={`nav-link dropdown-toggle ${router.pathname.startsWith('/subjects') ? 'active' : ''}`}
                href="#" 
                role="button" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                <span className="nav-link-text">Профили олимпиады</span>
              </a>
              <ul className="dropdown-menu">
                <li>
                  <Link href="/subjects/math" legacyBehavior>
                    <a className={`dropdown-item ${isActive('/subjects/math')}`}>
                      <i className="bi bi-calculator me-2"></i>Математика
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/subjects/biology" legacyBehavior>
                    <a className={`dropdown-item ${isActive('/subjects/biology')}`}>
                      <i className="bi bi-tree me-2"></i>Биология
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/subjects/physics" legacyBehavior>
                    <a className={`dropdown-item ${isActive('/subjects/physics')}`}>
                      <i className="bi bi-lightning me-2"></i>Физика
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/subjects/chemistry" legacyBehavior>
                    <a className={`dropdown-item ${isActive('/subjects/chemistry')}`}>
                      <i className="bi bi-droplet-fill me-2"></i>Химия
                    </a>
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <Link href="/news" legacyBehavior>
                <a className={`nav-link ${isActive('/news')}`}>
                  <span className="nav-link-text">Новости</span>
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/documents" legacyBehavior>
                <a className={`nav-link ${isActive('/documents')}`}>
                  <span className="nav-link-text">Документы</span>
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/contacts" legacyBehavior>
                <a className={`nav-link ${isActive('/contacts')}`}>
                  <span className="nav-link-text">Контакты</span>
                </a>
              </Link>
            </li>
            <li className="nav-item ms-lg-3">
              <Link href="/register" legacyBehavior>
                <a className="btn btn-register">
                  <span>Регистрация</span>
                </a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
} 