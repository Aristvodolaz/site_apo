import React from 'react';

export default function DocumentCard({ title, description, url, category }) {
  // Определяем иконку и цвет в зависимости от категории
  const getCategoryDetails = (categoryName) => {
    switch(categoryName) {
      case 'official':
        return { icon: 'journal-check', color: '#4361ee' };
      case 'main':
        return { icon: 'file-earmark-text', color: '#3a0ca3' };
      case 'subjects':
        return { icon: 'book', color: '#7209b7' };
      case 'additional':
        return { icon: 'info-circle', color: '#f72585' };
      default:
        return { icon: 'file-earmark-pdf', color: '#4895ef' };
    }
  };

  const { icon, color } = getCategoryDetails(category);
  
  // Проверяем, является ли URL внешней ссылкой
  const isExternalLink = url && url.startsWith('http');
  
  // Определяем тип документа по расширению
  const getDocumentType = (url) => {
    if (!url) return 'Документ';
    if (url.endsWith('.pdf')) return 'PDF';
    if (url.endsWith('.doc') || url.endsWith('.docx')) return 'DOC';
    if (url.endsWith('.xls') || url.endsWith('.xlsx')) return 'XLS';
    if (url.endsWith('.ppt') || url.endsWith('.pptx')) return 'PPT';
    return 'Документ';
  };
  
  const docType = getDocumentType(url);

  return (
    <div className="document-card" style={{ borderLeftColor: color }}>
      <div className="document-card-content">
        <div className="document-icon-container" style={{ backgroundColor: `${color}15` }}>
          <i className={`bi bi-${icon}`} style={{ color: color }}></i>
        </div>
        
        <h3 className="document-title">{title}</h3>
        {description && <p className="document-description">{description}</p>}
        
        <div className="document-actions">
          <a 
            href={url || '#'} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="document-link"
            style={{ color: color }}
          >
            <span>{isExternalLink ? 'Открыть документ' : 'Скачать документ'}</span>
            <i className={`bi ${isExternalLink ? 'bi-box-arrow-up-right' : 'bi-download'}`}></i>
          </a>
        </div>
      </div>
    </div>
  );
} 