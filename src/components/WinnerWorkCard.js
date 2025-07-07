import React, { useState } from 'react';

const WinnerWorkCard = ({ title, author, subject, grade, year, description, file_url, award_type }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  // Конфигурация цветов для разных типов наград
  const getAwardConfig = (awardType) => {
    const awardLower = awardType?.toLowerCase() || '';
    if (awardLower.includes('победитель')) {
      return {
        color: '#ffd700',
        bgColor: '#fff8e1',
        icon: 'trophy-fill',
        text: 'Победитель',
        textColor: '#f57c00'
      };
    } else if (awardLower.includes('призер')) {
      return {
        color: '#c0c0c0',
        bgColor: '#f5f5f5',
        icon: 'award-fill',
        text: 'Призер',
        textColor: '#757575'
      };
    }
    return {
      color: '#cd7f32',
      bgColor: '#e8f5e9',
      icon: 'star-fill',
      text: 'Участник',
      textColor: '#388e3c'
    };
  };

  // Конфигурация иконок для предметов в стиле сайта
  const getSubjectConfig = (subject) => {
    const subjectLower = subject?.toLowerCase() || '';
    switch (subjectLower) {
      case 'математика':
        return { icon: 'calculator', color: '#007bff' };
      case 'физика':
        return { icon: 'lightning', color: '#ffc107' };
      case 'химия':
        return { icon: 'droplet-fill', color: '#28a745' };
      case 'биология':
        return { icon: 'tree', color: '#17a2b8' };
      default:
        return { icon: 'book', color: '#6c757d' };
    }
  };

  const awardConfig = getAwardConfig(award_type);
  const subjectConfig = getSubjectConfig(subject);

  // Функция для обработки скачивания файла
  const handleDownload = async () => {
    if (file_url) {
      setIsDownloading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        window.open(file_url, '_blank');
      } catch (error) {
        console.error('Ошибка при скачивании:', error);
      } finally {
        setIsDownloading(false);
      }
    }
  };

  return (
    <div className="winner-work-card">
      <div className="card h-100 border-0">
        <div className="card-body position-relative p-4">
          {/* Декоративная линия */}
          <div className="work-card-decoration"></div>
          
          {/* Заголовок с наградой и годом */}
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div 
              className="work-award-badge"
              style={{ 
                backgroundColor: awardConfig.bgColor,
                color: awardConfig.textColor
              }}
            >
              <i className={`bi bi-${awardConfig.icon} me-2`}></i>
              <span>{awardConfig.text}</span>
            </div>
            {year && (
              <div className="work-year">
                {year}
              </div>
            )}
          </div>

          {/* Название работы */}
          <h3 className="card-title h5 mb-3">{title}</h3>

          {/* Автор */}
          <div className="work-author mb-3">
            <i className="bi bi-person-fill me-2 text-primary"></i>
            <span className="text-muted">{author}</span>
          </div>
          
          {/* Мета-информация */}
          <div className="work-meta mb-3">
            <div className="work-subject">
              <i 
                className={`bi bi-${subjectConfig.icon} me-2`}
                style={{ color: subjectConfig.color }}
              ></i>
              <span>{subject}</span>
            </div>
            {grade && (
              <div className="work-grade">
                <i className="bi bi-mortarboard me-2 text-info"></i>
                <span>{grade} класс</span>
              </div>
            )}
          </div>

          {/* Описание */}
          {description && (
            <p className="card-text text-muted mb-4">{description}</p>
          )}

          {/* Кнопка скачивания */}
          {file_url && (
            <div className="work-actions mt-auto">
              <button 
                onClick={handleDownload}
                className={`btn btn-primary work-download-btn ${isDownloading ? 'downloading' : ''}`}
                type="button"
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <>
                    <div className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">Загрузка...</span>
                    </div>
                    Скачивание...
                  </>
                ) : (
                  <>
                    <i className="bi bi-download me-2"></i>
                    Скачать работу
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .winner-work-card {
          transition: all 0.3s ease;
        }

        .winner-work-card:hover {
          transform: translateY(-5px);
        }

        .winner-work-card .card {
          background: white;
          box-shadow: var(--card-shadow);
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .winner-work-card:hover .card {
          box-shadow: var(--card-hover-shadow);
        }

        .work-card-decoration {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--card-decoration);
          border-radius: 16px 16px 0 0;
        }

        .work-award-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.375rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .work-year {
          background: var(--background-light);
          color: var(--text-dark);
          padding: 0.375rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .work-author {
          display: flex;
          align-items: center;
          font-size: 0.9rem;
        }

        .work-meta {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .work-subject,
        .work-grade {
          display: flex;
          align-items: center;
          font-size: 0.875rem;
          color: var(--text-dark);
        }

        .work-download-btn {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          font-weight: 500;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .work-download-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .work-download-btn:hover::before {
          left: 100%;
        }

        .work-download-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
        }

        .work-download-btn.downloading {
          opacity: 0.7;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .work-meta {
            flex-direction: column;
            gap: 0.375rem;
          }

          .work-award-badge {
            font-size: 0.75rem;
            padding: 0.25rem 0.5rem;
          }

          .work-year {
            font-size: 0.75rem;
            padding: 0.25rem 0.5rem;
          }

          .work-download-btn {
            padding: 0.625rem 0.875rem;
            font-size: 0.875rem;
          }
        }
      `}</style>
    </div>
  );
};

export default WinnerWorkCard; 