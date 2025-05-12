import Link from 'next/link';

export default function NewsCard({ title, date, summary, link }) {
  const formattedDate = new Date(date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  // Получаем месяц для отображения в бейдже
  const month = new Date(date).toLocaleDateString('ru-RU', { month: 'short' });
  const day = new Date(date).getDate();

  return (
    <div className="news-card">
      <div className="card h-100 border-0 shadow-sm">
        <div className="news-card-decoration"></div>
        <div className="card-body d-flex flex-column p-4">
          <div className="d-flex justify-content-between mb-3">
            <div className="news-card-header">
              <h3 className="news-card-title h5 mb-0">{title}</h3>
            </div>
            <div className="news-card-date-badge">
              <div className="date-badge-day">{day}</div>
              <div className="date-badge-month">{month}</div>
            </div>
          </div>
          <p className="news-card-summary flex-grow-1 mt-2">{summary}</p>
          <div className="news-card-footer mt-auto pt-3">
            <div className="d-flex justify-content-between align-items-center">
              <div className="news-card-date small">
                <i className="bi bi-calendar3 me-2"></i>
                {formattedDate}
              </div>
              {link && (
                <div className="news-card-link-container">
                  <Link href={link} legacyBehavior>
                    <a className="news-card-link">
                      Читать далее
                      <i className="bi bi-arrow-right ms-2"></i>
                    </a>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="news-card-hover-decoration"></div>
      </div>
    </div>
  );
} 