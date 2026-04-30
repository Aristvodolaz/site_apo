import { FINAL_STAGE_WORK_SHOWCASE } from '../data/finalStageWorkShowcaseData';

// Секция с карточками ссылок на материалы показа работ заключительного этапа
export default function FinalStageWorkShowcaseSection({ sectionClassName = 'py-5 bg-light' }) {
  return (
    <section className={sectionClassName}>
      <div className="container">
        <div className="row mb-4">
          <div className="col-12 text-center">
            <h2 className="section-heading mb-3">
              <i className="bi bi-journal-richtext text-primary me-2"></i>
              Показ работ заключительного этапа
            </h2>
            <p className="lead text-muted">Материалы по каждому предмету</p>
          </div>
        </div>

        <div className="row g-4 justify-content-center">
          {FINAL_STAGE_WORK_SHOWCASE.map((subject) => (
            <div key={subject.title} className="col-md-6 col-lg-3">
              <div className="card h-100 shadow-sm border-0 protocol-card">
                <div className="card-body p-4 text-center d-flex flex-column">
                  <div className="protocol-icon mb-3">
                    <i className={`bi bi-${subject.icon} text-${subject.colorClass}`} style={{ fontSize: '3rem' }}></i>
                  </div>
                  <h3 className="h4 mb-3">{subject.title}</h3>
                  <p className="text-muted mb-4">Показ работ заключительного этапа</p>
                  {subject.link ? (
                    <a
                      href={subject.link}
                      className={`btn btn-${subject.colorClass} btn-lg w-100 mt-auto`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="bi bi-box-arrow-up-right me-2"></i>
                      Открыть материалы
                    </a>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-lg w-100 mt-auto"
                      disabled
                    >
                      Скоро
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
