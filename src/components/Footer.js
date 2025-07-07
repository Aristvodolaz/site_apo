import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    about: [
      { title: 'История олимпиады', href: '/about/history' },
      // { title: 'Архив заданий', href: '/about/archive' },
      // { title: 'Организаторы', href: '/about/organizers' },
      { title: 'Контакты', href: '/contacts' }
    ],
    subjects: [
      { title: 'Математика', href: '/subjects/math' },
      { title: 'Биология', href: '/subjects/biology' },
      { title: 'Физика', href: '/subjects/physics' },
      { title: 'Химия', href: '/subjects/chemistry' }
    ],
    participants: [
      // { title: 'Регистрация', href: '/register' },
      // { title: 'Расписание', href: '/schedule' },
      { title: 'Документы', href: '/documents' },
      { title: 'Новости', href: '/news' }
    ],
    social: [
      // { title: 'VK', href: '#', icon: 'chat' },
      // { title: 'Telegram', href: '#', icon: 'telegram' },
      // { title: 'YouTube', href: '#', icon: 'youtube' }
    ]
  };

  return (
    <footer className="modern-footer">
      {/* Волнистый разделитель */}
      <div className="footer-wave-container">
        <div className="footer-wave"></div>
      </div>
      
      <div className="footer-content">
        <div className="container py-5">
          <div className="row g-5">
            {/* Логотип и описание */}
            <div className="col-lg-4 mb-4 mb-lg-0">
              <div className="footer-brand mb-4">
                <div className="d-flex align-items-center">
                  <div className="footer-logo">
                    <i className="bi bi-snow2 display-4"></i>
                  </div>
                  <div className="ms-3">
                    <h3 className="h4 mb-1">Арктическая олимпиада</h3>
                  </div>
                </div>
              </div>
              <p className="footer-description mb-4">
                Всероссийская олимпиада школьников по математике, биологии, физике и химии, 
                проводимая при поддержке Департамента образования ЯНАО.
              </p>
              <div className="footer-social">
                {footerLinks.social.map((social, index) => (
                  <a key={index} href={social.href} className="social-link" aria-label={social.title}>
                    <i className={`bi bi-${social.icon}`}></i>
                  </a>
                ))}
              </div>
            </div>

            {/* Ссылки */}
            <div className="col-sm-6 col-lg-2">
              <h4 className="footer-title">Об олимпиаде</h4>
              <ul className="footer-links">
                {footerLinks.about.map((link, index) => (
                  <li key={index}>
                    <Link href={link.href} legacyBehavior>
                      <a>{link.title}</a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-sm-6 col-lg-2">
              <h4 className="footer-title">Профили</h4>
              <ul className="footer-links">
                {footerLinks.subjects.map((link, index) => (
                  <li key={index}>
                    <Link href={link.href} legacyBehavior>
                      <a>{link.title}</a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-sm-6 col-lg-2">
              <h4 className="footer-title">Участникам</h4>
              <ul className="footer-links">
                {footerLinks.participants.map((link, index) => (
                  <li key={index}>
                    <Link href={link.href} legacyBehavior>
                      <a>{link.title}</a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Контакты */}
            <div className="col-sm-6 col-lg-2">
              <h4 className="footer-title">Контакты</h4>
              <ul className="footer-contacts">
                <li>
                  <i className="bi bi-envelope"></i>
                  <a href="mailto:info@arctic-olymp.ru">info@arctic-olymp.ru</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Нижняя часть футера */}
      <div className="footer-bottom">
        <div className="container">
          <div className="d-flex flex-wrap justify-content-between align-items-center py-3">
            <div className="footer-copyright">
              © {currentYear} Арктическая олимпиада. Все права защищены.
            </div>
            <div className="footer-links-secondary">
              <Link href="https://drive.google.com/file/d/1GYfVoYCsmM1US4B-TbDpLYOcphbdsUpw/view?usp=drive_link" legacyBehavior>
                <a>Политика конфиденциальности</a>
              </Link>
          
            </div>
          </div>
        </div>
      </div>

      {/* Декоративный элемент */}
      <div className="footer-decoration"></div>
    </footer>
  );
} 