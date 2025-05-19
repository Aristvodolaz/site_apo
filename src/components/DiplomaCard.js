import React from 'react';

const DiplomaCard = ({ fio, number, status, subject }) => {
  // Конфигурация цветов для разных статусов
  const getStatusConfig = (status) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('победитель')) {
      return {
        color: '#2962ff',
        gradient: 'linear-gradient(135deg, #2962ff15 0%, #2962ff05 100%)',
        icon: 'bi-trophy-fill'
      };
    } else if (statusLower.includes('призер')) {
      return {
        color: '#00c853',
        gradient: 'linear-gradient(135deg, #00c85315 0%, #00c85305 100%)',
        icon: 'bi-award-fill'
      };
    }
    return {
      color: '#546e7a',
      gradient: 'linear-gradient(135deg, #546e7a15 0%, #546e7a05 100%)',
      icon: 'bi-file-earmark-text'
    };
  };

  // Конфигурация иконок для предметов
  const subjectIcons = {
    'математика': { icon: 'bi-calculator', color: '#f44336' },
    'физика': { icon: 'bi-lightning', color: '#ff9100' },
    'химия': { icon: 'bi-droplet-fill', color: '#2196f3' },
    'биология': { icon: 'bi-tree', color: '#4caf50' },
    'default': { icon: 'bi-book', color: '#757575' }
  };

  const getSubjectConfig = (subject) => {
    return subjectIcons[subject?.toLowerCase()] || subjectIcons.default;
  };

  const statusConfig = getStatusConfig(status);
  const subjectConfig = getSubjectConfig(subject);

  return (
    <div className="diploma-card">
      <div className="diploma-main">
        <div className="diploma-icon" style={{ backgroundColor: statusConfig.gradient }}>
          <i className={`bi ${statusConfig.icon}`} style={{ color: statusConfig.color }}></i>
        </div>
        <div className="diploma-content">
          <div className="diploma-header">
            <h3 className="diploma-name">{fio}</h3>
            <div className="diploma-number">№ {number}</div>
          </div>
          <div className="diploma-details">
            {subject && (
              <div className="diploma-subject">
                <i className={`bi ${subjectConfig.icon}`} style={{ color: subjectConfig.color }}></i>
                <span>{subject}</span>
              </div>
            )}
            {status && (
              <div className="diploma-status" style={{ 
                color: statusConfig.color,
                backgroundColor: statusConfig.gradient
              }}>
                {status}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .diploma-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          border: 1px solid rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .diploma-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .diploma-main {
          display: flex;
          gap: 1.25rem;
          padding: 1.5rem;
          position: relative;
        }

        .diploma-main::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 3px;
          background: ${statusConfig.gradient};
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .diploma-card:hover .diploma-main::after {
          opacity: 1;
        }

        .diploma-icon {
          width: 48px;
          height: 48px;
          min-width: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          transition: all 0.3s ease;
        }

        .diploma-card:hover .diploma-icon {
          transform: scale(1.1);
        }

        .diploma-content {
          flex: 1;
          min-width: 0;
        }

        .diploma-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 0.75rem;
        }

        .diploma-name {
          margin: 0;
          font-size: 1.125rem;
          font-weight: 600;
          color: #1a1f36;
          line-height: 1.4;
          flex: 1;
          min-width: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .diploma-number {
          font-size: 0.875rem;
          color: #697386;
          font-weight: 500;
          white-space: nowrap;
        }

        .diploma-details {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .diploma-subject {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9375rem;
          color: #697386;
          padding: 0.25rem 0;
        }

        .diploma-subject i {
          font-size: 1.125rem;
        }

        .diploma-status {
          display: inline-flex;
          align-items: center;
          padding: 0.375rem 0.875rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          line-height: 1.25;
          white-space: nowrap;
        }

        @media (max-width: 768px) {
          .diploma-main {
            padding: 1.25rem;
            gap: 1rem;
          }

          .diploma-icon {
            width: 40px;
            height: 40px;
            min-width: 40px;
            font-size: 1.25rem;
          }

          .diploma-header {
            flex-direction: column;
            gap: 0.5rem;
          }

          .diploma-name {
            font-size: 1rem;
          }

          .diploma-details {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }

          .diploma-status {
            padding: 0.25rem 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default DiplomaCard; 