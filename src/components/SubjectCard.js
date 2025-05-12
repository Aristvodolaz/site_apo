import Link from 'next/link';

export default function SubjectCard({ title, description, icon, link, color = "primary" }) {
  const colorMap = {
    primary: {
      light: '#e3f2fd',
      main: '#007bff',
      gradient: 'linear-gradient(135deg, #007bff, #00c6ff)'
    },
    success: {
      light: '#e8f5e9',
      main: '#28a745',
      gradient: 'linear-gradient(135deg, #28a745, #5fd855)'
    },
    danger: {
      light: '#ffebee',
      main: '#dc3545',
      gradient: 'linear-gradient(135deg, #dc3545, #ff6b6b)'
    },
    warning: {
      light: '#fff8e1',
      main: '#ffc107',
      gradient: 'linear-gradient(135deg, #ffc107, #ffdb4d)'
    }
  };

  return (
    <div className="subject-card" data-color={color}>
      <div className="card h-100 border-0" style={{ overflow: 'hidden' }}>
        <div className="card-body position-relative p-4">
          <div className="subject-card-icon" style={{ background: colorMap[color].light, color: colorMap[color].main }}>
            <i className={`bi bi-${icon}`} style={{ fontSize: '1.5rem' }}></i>
          </div>
          <h3 className="card-title h5 mb-3 mt-4">{title}</h3>
          <p className="card-text text-muted mb-4">{description}</p>
          {link && (
            <Link href={link} legacyBehavior>
              <a className="subject-card-link" style={{ color: colorMap[color].main }}>
                Подробнее
                <i className="bi bi-arrow-right ms-2"></i>
              </a>
            </Link>
          )}
          <div 
            className="subject-card-decoration" 
            style={{ 
              background: colorMap[color].gradient 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
} 