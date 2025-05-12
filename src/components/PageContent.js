import { useState, useEffect } from 'react';
import { getDocument } from '../lib/dataService';

export default function PageContent({ contentId }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await getDocument('content', contentId);
        setContent(data);
      } catch (err) {
        console.error(`Error fetching ${contentId} content:`, err);
        setError('Не удалось загрузить содержимое страницы');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [contentId]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  if (!content) {
    return (
      <div className="alert alert-info" role="alert">
        Содержимое страницы не найдено
      </div>
    );
  }

  return (
    <div className="page-content">
      {/* Динамический рендеринг контента в зависимости от его структуры */}
      {Object.entries(content).map(([key, value]) => {
        // Пропускаем служебные поля
        if (['id', 'created_at', 'updated_at'].includes(key)) {
          return null;
        }

        // Если значение - массив
        if (Array.isArray(value)) {
          return (
            <div key={key} className="mb-4">
              <h3 className="mb-3">{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
              <ul className="list-group">
                {value.map((item, index) => (
                  <li key={index} className="list-group-item">
                    {typeof item === 'object' ? (
                      <>
                        {item.title && <h5>{item.title}</h5>}
                        {item.description && <p className="mb-0">{item.description}</p>}
                        {item.link && (
                          <a href={item.link} target="_blank" rel="noopener noreferrer" 
                             className="btn btn-sm btn-outline-primary mt-2">
                            Подробнее
                          </a>
                        )}
                      </>
                    ) : (
                      item
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        }

        // Если значение - объект
        if (typeof value === 'object') {
          return (
            <div key={key} className="mb-4">
              <h3 className="mb-3">{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
              {Object.entries(value).map(([subKey, subValue]) => (
                <div key={subKey} className="mb-3">
                  <h5>{subKey}</h5>
                  <p>{subValue}</p>
                </div>
              ))}
            </div>
          );
        }

        // Если значение - строка или число
        return (
          <div key={key} className="mb-4">
            <h3>{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
            <p>{value}</p>
          </div>
        );
      })}
    </div>
  );
} 