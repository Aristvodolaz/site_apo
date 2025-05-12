export default function DocumentCard({ title, description, url }) {
  return (
    <div className="modern-document-card">
      <div className="document-card-icon">
        <i className="bi bi-file-earmark-pdf"></i>
      </div>
      <div className="document-card-content">
        <h4 className="document-card-title">{title}</h4>
        {description && <p className="document-card-description">{description}</p>}
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="document-card-link"
        >
          <span>Скачать документ</span>
          <i className="bi bi-download ms-2"></i>
        </a>
      </div>
      <div className="document-card-decoration"></div>
    </div>
  );
} 