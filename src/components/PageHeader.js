export default function PageHeader({ title, subtitle }) {
  return (
    <div className="page-header">
      <div className="container">
        <h1 className="display-4 fw-bold">{title}</h1>
        {subtitle && <p className="lead">{subtitle}</p>}
      </div>
    </div>
  );
} 