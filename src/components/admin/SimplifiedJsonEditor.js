import { useState, useEffect } from 'react';

const SimplifiedJsonEditor = ({ value, onChange }) => {
  const [error, setError] = useState('');
  const [formattedValue, setFormattedValue] = useState('');
  
  // Форматирование JSON при инициализации
  useEffect(() => {
    try {
      // Проверяем, что входное значение является валидным JSON
      const parsedValue = typeof value === 'string' ? JSON.parse(value) : value;
      // Форматируем JSON
      const prettyJson = JSON.stringify(parsedValue, null, 2);
      setFormattedValue(prettyJson);
      setError('');
    } catch (err) {
      setFormattedValue(value);
      setError('Невалидный JSON: ' + err.message);
    }
  }, [value]);
  
  // Обработка изменений в редакторе
  const handleChange = (e) => {
    const newValue = e.target.value;
    setFormattedValue(newValue);
    try {
      // Проверяем валидность JSON
      JSON.parse(newValue);
      onChange(newValue);
      setError('');
    } catch (err) {
      onChange(newValue); // Всё равно обновляем значение, но с ошибкой
      setError('Невалидный JSON: ' + err.message);
    }
  };

  // Форматирование JSON
  const handleFormat = () => {
    try {
      const parsedValue = JSON.parse(formattedValue);
      const prettyJson = JSON.stringify(parsedValue, null, 2);
      setFormattedValue(prettyJson);
      onChange(prettyJson);
      setError('');
    } catch (err) {
      setError('Невалидный JSON: ' + err.message);
    }
  };

  return (
    <div>
      {error && (
        <div className="alert alert-warning mb-2">
          {error}
        </div>
      )}
      <div className="mb-2">
        <button 
          type="button" 
          className="btn btn-sm btn-outline-secondary me-2"
          onClick={handleFormat}
        >
          Форматировать
        </button>
      </div>
      <textarea
        value={formattedValue}
        onChange={handleChange}
        className="form-control font-monospace"
        style={{ 
          minHeight: '400px',
          fontSize: '14px',
          fontFamily: 'monospace',
          backgroundColor: '#f8f9fa',
          tabSize: 2
        }}
      />
    </div>
  );
};

export default SimplifiedJsonEditor; 