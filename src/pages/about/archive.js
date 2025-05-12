import Layout from '../../components/Layout';
import PageHeader from '../../components/PageHeader';
import Link from 'next/link';

export default function Archive() {
  return (
    <Layout title="Архив">
      <div className="archive-intro">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <div className="intro-icon">
                <i className="bi bi-archive"></i>
              </div>
              <h1 className="display-4 mb-4">Архив олимпиады</h1>
              <p className="lead mb-4">
                В этом разделе вы найдете все материалы прошедших олимпиад: задания, решения, результаты и фотографии
              </p>
              <div className="archive-features">
                <div className="row g-4">
                  <div className="col-md-4">
                    <div className="feature-item">
                      <i className="bi bi-file-earmark-text"></i>
                      <h5>Задания и решения</h5>
                      <p>Доступ ко всем заданиям и подробным решениям</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="feature-item">
                      <i className="bi bi-trophy"></i>
                      <h5>Результаты</h5>
                      <p>Итоги и статистика прошлых лет</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="feature-item">
                      <i className="bi bi-images"></i>
                      <h5>Фотогалерея</h5>
                      <p>Фотографии с мероприятий</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="archive-wave"></div>
      </div>

      <div className="archive-content-section">
        <div className="container">
          <div className="archive-timeline">
            {/* 2024 */}
            <div className="archive-year-card">
              <div className="year-indicator">
                <div className="year-line"></div>
                <div className="year-badge">2024</div>
              </div>
              <div className="archive-card-content">
                <div className="archive-subjects">
                  <div className="subject-card">
                    <div className="subject-header">
                      <div className="subject-icon">
                        <i className="bi bi-calculator"></i>
                      </div>
                      <h3>Математика</h3>
                    </div>
                    <div className="materials-grid">
                      <div className="material-group">
                        <h6 className="material-group-title">
                          <i className="bi bi-1-circle"></i> Отборочный этап
                        </h6>
                        <div className="material-items">
                          <a href="#" className="material-link qualification">
                            <div className="material-icon">
                              <i className="bi bi-file-text"></i>
                            </div>
                            <div className="material-info">
                              <span className="material-title">Задания</span>
                              <span className="material-type">PDF, 2.1 MB</span>
                            </div>
                            <i className="bi bi-download"></i>
                          </a>
                          <a href="#" className="material-link qualification">
                            <div className="material-icon">
                              <i className="bi bi-check2-circle"></i>
                            </div>
                            <div className="material-info">
                              <span className="material-title">Решения</span>
                              <span className="material-type">PDF, 3.4 MB</span>
                            </div>
                            <i className="bi bi-download"></i>
                          </a>
                        </div>
                      </div>
                      <div className="material-group">
                        <h6 className="material-group-title">
                          <i className="bi bi-2-circle"></i> Заключительный этап
                        </h6>
                        <div className="material-items">
                          <a href="#" className="material-link final">
                            <div className="material-icon">
                              <i className="bi bi-file-text"></i>
                            </div>
                            <div className="material-info">
                              <span className="material-title">Задания</span>
                              <span className="material-type">PDF, 1.8 MB</span>
                            </div>
                            <i className="bi bi-download"></i>
                          </a>
                          <a href="#" className="material-link final">
                            <div className="material-icon">
                              <i className="bi bi-check2-circle"></i>
                            </div>
                            <div className="material-info">
                              <span className="material-title">Решения</span>
                              <span className="material-type">PDF, 2.9 MB</span>
                            </div>
                            <i className="bi bi-download"></i>
                          </a>
                        </div>
                      </div>
                      <div className="material-group">
                        <h6 className="material-group-title">
                          <i className="bi bi-trophy"></i> Результаты
                        </h6>
                        <div className="material-items">
                          <a href="#" className="material-link results">
                            <div className="material-icon">
                              <i className="bi bi-file-earmark-spreadsheet"></i>
                            </div>
                            <div className="material-info">
                              <span className="material-title">Итоговый протокол</span>
                              <span className="material-type">Excel, 1.2 MB</span>
                            </div>
                            <i className="bi bi-download"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="subject-card">
                    <div className="subject-header">
                      <div className="subject-icon">
                        <i className="bi bi-virus"></i>
                      </div>
                      <h3>Биология</h3>
                    </div>
                    <div className="materials-grid">
                      <div className="material-group">
                        <h6 className="material-group-title">
                          <i className="bi bi-1-circle"></i> Отборочный этап
                        </h6>
                        <div className="material-items">
                          <a href="#" className="material-link qualification">
                            <div className="material-icon">
                              <i className="bi bi-file-text"></i>
                            </div>
                            <div className="material-info">
                              <span className="material-title">Задания</span>
                              <span className="material-type">PDF, 3.5 MB</span>
                            </div>
                            <i className="bi bi-download"></i>
                          </a>
                          <a href="#" className="material-link qualification">
                            <div className="material-icon">
                              <i className="bi bi-check2-circle"></i>
                            </div>
                            <div className="material-info">
                              <span className="material-title">Решения</span>
                              <span className="material-type">PDF, 4.2 MB</span>
                            </div>
                            <i className="bi bi-download"></i>
                          </a>
                        </div>
                      </div>
                      <div className="material-group">
                        <h6 className="material-group-title">
                          <i className="bi bi-2-circle"></i> Заключительный этап
                        </h6>
                        <div className="material-items">
                          <a href="#" className="material-link final">
                            <div className="material-icon">
                              <i className="bi bi-file-text"></i>
                            </div>
                            <div className="material-info">
                              <span className="material-title">Задания</span>
                              <span className="material-type">PDF, 2.8 MB</span>
                            </div>
                            <i className="bi bi-download"></i>
                          </a>
                          <a href="#" className="material-link final">
                            <div className="material-icon">
                              <i className="bi bi-check2-circle"></i>
                            </div>
                            <div className="material-info">
                              <span className="material-title">Решения</span>
                              <span className="material-type">PDF, 3.7 MB</span>
                            </div>
                            <i className="bi bi-download"></i>
                          </a>
                        </div>
                      </div>
                      <div className="material-group">
                        <h6 className="material-group-title">
                          <i className="bi bi-trophy"></i> Результаты
                        </h6>
                        <div className="material-items">
                          <a href="#" className="material-link results">
                            <div className="material-icon">
                              <i className="bi bi-file-earmark-spreadsheet"></i>
                            </div>
                            <div className="material-info">
                              <span className="material-title">Итоговый протокол</span>
                              <span className="material-type">Excel, 0.9 MB</span>
                            </div>
                            <i className="bi bi-download"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="archive-photos">
                  <div className="photos-header">
                    <i className="bi bi-images"></i>
                    <h3>Фотогалерея</h3>
                  </div>
                  <div className="photos-grid">
                    <div className="photo-card">
                      <div className="photo-preview">
                        <i className="bi bi-image"></i>
                      </div>
                      <div className="photo-info">
                        <span className="photo-title">Открытие олимпиады</span>
                        <a href="#" className="photo-link">
                          <i className="bi bi-collection"></i>
                          Смотреть альбом
                        </a>
                      </div>
                    </div>
                    <div className="photo-card">
                      <div className="photo-preview">
                        <i className="bi bi-image"></i>
                      </div>
                      <div className="photo-info">
                        <span className="photo-title">Награждение победителей</span>
                        <a href="#" className="photo-link">
                          <i className="bi bi-collection"></i>
                          Смотреть альбом
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2023 */}
            <div className="archive-year-card">
              <div className="year-indicator">
                <div className="year-line"></div>
                <div className="year-badge">2023</div>
              </div>
              <div className="archive-card-content">
                <div className="archive-subjects">
                  <div className="subject-card">
                    <div className="subject-header">
                      <div className="subject-icon">
                        <i className="bi bi-calculator"></i>
                      </div>
                      <h3>Математика</h3>
                    </div>
                    <div className="materials-grid">
                      <div className="material-group">
                        <h6 className="material-group-title">
                          <i className="bi bi-1-circle"></i> Отборочный этап
                        </h6>
                        <div className="material-items">
                          <a href="#" className="material-link qualification">
                            <div className="material-icon">
                              <i className="bi bi-file-text"></i>
                            </div>
                            <div className="material-info">
                              <span className="material-title">Задания</span>
                              <span className="material-type">PDF, 1.9 MB</span>
                            </div>
                            <i className="bi bi-download"></i>
                          </a>
                          <a href="#" className="material-link qualification">
                            <div className="material-icon">
                              <i className="bi bi-check2-circle"></i>
                            </div>
                            <div className="material-info">
                              <span className="material-title">Решения</span>
                              <span className="material-type">PDF, 2.8 MB</span>
                            </div>
                            <i className="bi bi-download"></i>
                          </a>
                        </div>
                      </div>
                      <div className="material-group">
                        <h6 className="material-group-title">
                          <i className="bi bi-trophy"></i> Результаты
                        </h6>
                        <div className="material-items">
                          <a href="#" className="material-link results">
                            <div className="material-icon">
                              <i className="bi bi-file-earmark-spreadsheet"></i>
                            </div>
                            <div className="material-info">
                              <span className="material-title">Итоговый протокол</span>
                              <span className="material-type">Excel, 0.8 MB</span>
                            </div>
                            <i className="bi bi-download"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="subject-card">
                    <div className="subject-header">
                      <div className="subject-icon">
                        <i className="bi bi-virus"></i>
                      </div>
                      <h3>Биология</h3>
                    </div>
                    <div className="materials-grid">
                      <div className="material-group">
                        <h6 className="material-group-title">
                          <i className="bi bi-1-circle"></i> Отборочный этап
                        </h6>
                        <div className="material-items">
                          <a href="#" className="material-link qualification">
                            <div className="material-icon">
                              <i className="bi bi-file-text"></i>
                            </div>
                            <div className="material-info">
                              <span className="material-title">Задания</span>
                              <span className="material-type">PDF, 2.7 MB</span>
                            </div>
                            <i className="bi bi-download"></i>
                          </a>
                          <a href="#" className="material-link qualification">
                            <div className="material-icon">
                              <i className="bi bi-check2-circle"></i>
                            </div>
                            <div className="material-info">
                              <span className="material-title">Решения</span>
                              <span className="material-type">PDF, 3.5 MB</span>
                            </div>
                            <i className="bi bi-download"></i>
                          </a>
                        </div>
                      </div>
                      <div className="material-group">
                        <h6 className="material-group-title">
                          <i className="bi bi-trophy"></i> Результаты
                        </h6>
                        <div className="material-items">
                          <a href="#" className="material-link results">
                            <div className="material-icon">
                              <i className="bi bi-file-earmark-spreadsheet"></i>
                            </div>
                            <div className="material-info">
                              <span className="material-title">Итоговый протокол</span>
                              <span className="material-type">Excel, 0.7 MB</span>
                            </div>
                            <i className="bi bi-download"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="subject-card">
                    <div className="subject-header">
                      <div className="subject-icon">
                        <i className="bi bi-gear"></i>
                      </div>
                      <h3>Физика</h3>
                    </div>
                    <div className="materials-grid">
                      <div className="material-group">
                        <h6 className="material-group-title">
                          <i className="bi bi-1-circle"></i> Отборочный этап
                        </h6>
                        <div className="material-items">
                          <a href="#" className="material-link qualification">
                            <div className="material-icon">
                              <i className="bi bi-file-text"></i>
                            </div>
                            <div className="material-info">
                              <span className="material-title">Задания</span>
                              <span className="material-type">PDF, 2.3 MB</span>
                            </div>
                            <i className="bi bi-download"></i>
                          </a>
                          <a href="#" className="material-link qualification">
                            <div className="material-icon">
                              <i className="bi bi-check2-circle"></i>
                            </div>
                            <div className="material-info">
                              <span className="material-title">Решения</span>
                              <span className="material-type">PDF, 3.1 MB</span>
                            </div>
                            <i className="bi bi-download"></i>
                          </a>
                        </div>
                      </div>
                      <div className="material-group">
                        <h6 className="material-group-title">
                          <i className="bi bi-trophy"></i> Результаты
                        </h6>
                        <div className="material-items">
                          <a href="#" className="material-link results">
                            <div className="material-icon">
                              <i className="bi bi-file-earmark-spreadsheet"></i>
                            </div>
                            <div className="material-info">
                              <span className="material-title">Итоговый протокол</span>
                              <span className="material-type">Excel, 0.6 MB</span>
                            </div>
                            <i className="bi bi-download"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="subject-card">
                    <div className="subject-header">
                      <div className="subject-icon">
                        <i className="bi bi-globe"></i>
                      </div>
                      <h3>География</h3>
                    </div>
                    <div className="materials-grid">
                      <div className="material-group">
                        <h6 className="material-group-title">
                          <i className="bi bi-1-circle"></i> Отборочный этап
                        </h6>
                        <div className="material-items">
                          <a href="#" className="material-link qualification">
                            <div className="material-icon">
                              <i className="bi bi-file-text"></i>
                            </div>
                            <div className="material-info">
                              <span className="material-title">Задания</span>
                              <span className="material-type">PDF, 3.2 MB</span>
                            </div>
                            <i className="bi bi-download"></i>
                          </a>
                          <a href="#" className="material-link qualification">
                            <div className="material-icon">
                              <i className="bi bi-check2-circle"></i>
                            </div>
                            <div className="material-info">
                              <span className="material-title">Решения</span>
                              <span className="material-type">PDF, 4.1 MB</span>
                            </div>
                            <i className="bi bi-download"></i>
                          </a>
                        </div>
                      </div>
                      <div className="material-group">
                        <h6 className="material-group-title">
                          <i className="bi bi-trophy"></i> Результаты
                        </h6>
                        <div className="material-items">
                          <a href="#" className="material-link results">
                            <div className="material-icon">
                              <i className="bi bi-file-earmark-spreadsheet"></i>
                            </div>
                            <div className="material-info">
                              <span className="material-title">Итоговый протокол</span>
                              <span className="material-type">Excel, 0.5 MB</span>
                            </div>
                            <i className="bi bi-download"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="archive-photos">
                  <div className="photos-header">
                    <i className="bi bi-images"></i>
                    <h3>Фотогалерея</h3>
                  </div>
                  <div className="photos-grid">
                    <div className="photo-card">
                      <div className="photo-preview">
                        <i className="bi bi-image"></i>
                      </div>
                      <div className="photo-info">
                        <span className="photo-title">Церемония открытия</span>
                        <a href="#" className="photo-link">
                          <i className="bi bi-collection"></i>
                          Смотреть альбом
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2022 */}
            <div className="archive-year-card">
              <div className="year-indicator">
                <div className="year-line"></div>
                <div className="year-badge">2022</div>
              </div>
              <div className="archive-card-content">
                <div className="archive-subjects">
                  <div className="subject-card">
                    <div className="subject-header">
                      <div className="subject-icon">
                        <i className="bi bi-calculator"></i>
                      </div>
                      <h3>Математика</h3>
                    </div>
                    <div className="materials-grid">
                      <div className="material-group">
                        <h6 className="material-group-title">
                          <i className="bi bi-1-circle"></i> Отборочный этап
                        </h6>
                        <div className="material-items">
                          <a href="#" className="material-link qualification">
                            <div className="material-icon">
                              <i className="bi bi-file-text"></i>
                            </div>
                            <div className="material-info">
                              <span className="material-title">Задания</span>
                              <span className="material-type">PDF, 1.7 MB</span>
                            </div>
                            <i className="bi bi-download"></i>
                          </a>
                          <a href="#" className="material-link qualification">
                            <div className="material-icon">
                              <i className="bi bi-check2-circle"></i>
                            </div>
                            <div className="material-info">
                              <span className="material-title">Решения</span>
                              <span className="material-type">PDF, 2.5 MB</span>
                            </div>
                            <i className="bi bi-download"></i>
                          </a>
                        </div>
                      </div>
                      <div className="material-group">
                        <h6 className="material-group-title">
                          <i className="bi bi-trophy"></i> Результаты
                        </h6>
                        <div className="material-items">
                          <a href="#" className="material-link results">
                            <div className="material-icon">
                              <i className="bi bi-file-earmark-spreadsheet"></i>
                            </div>
                            <div className="material-info">
                              <span className="material-title">Итоговый протокол</span>
                              <span className="material-type">Excel, 0.6 MB</span>
                            </div>
                            <i className="bi bi-download"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="subject-card">
                    <div className="subject-header">
                      <div className="subject-icon">
                        <i className="bi bi-virus"></i>
                      </div>
                      <h3>Биология</h3>
                    </div>
                    <div className="materials-grid">
                      <div className="material-group">
                        <h6 className="material-group-title">
                          <i className="bi bi-1-circle"></i> Отборочный этап
                        </h6>
                        <div className="material-items">
                          <a href="#" className="material-link qualification">
                            <div className="material-icon">
                              <i className="bi bi-file-text"></i>
                            </div>
                            <div className="material-info">
                              <span className="material-title">Задания</span>
                              <span className="material-type">PDF, 2.4 MB</span>
                            </div>
                            <i className="bi bi-download"></i>
                          </a>
                          <a href="#" className="material-link qualification">
                            <div className="material-icon">
                              <i className="bi bi-check2-circle"></i>
                            </div>
                            <div className="material-info">
                              <span className="material-title">Решения</span>
                              <span className="material-type">PDF, 3.2 MB</span>
                            </div>
                            <i className="bi bi-download"></i>
                          </a>
                        </div>
                      </div>
                      <div className="material-group">
                        <h6 className="material-group-title">
                          <i className="bi bi-trophy"></i> Результаты
                        </h6>
                        <div className="material-items">
                          <a href="#" className="material-link results">
                            <div className="material-icon">
                              <i className="bi bi-file-earmark-spreadsheet"></i>
                            </div>
                            <div className="material-info">
                              <span className="material-title">Итоговый протокол</span>
                              <span className="material-type">Excel, 0.5 MB</span>
                            </div>
                            <i className="bi bi-download"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="subject-card">
                    <div className="subject-header">
                      <div className="subject-icon">
                        <i className="bi bi-gear"></i>
                      </div>
                      <h3>Физика</h3>
                    </div>
                    <div className="materials-grid">
                      <div className="material-group">
                        <h6 className="material-group-title">
                          <i className="bi bi-1-circle"></i> Отборочный этап
                        </h6>
                        <div className="material-items">
                          <a href="#" className="material-link qualification">
                            <div className="material-icon">
                              <i className="bi bi-file-text"></i>
                            </div>
                            <div className="material-info">
                              <span className="material-title">Задания</span>
                              <span className="material-type">PDF, 2.1 MB</span>
                            </div>
                            <i className="bi bi-download"></i>
                          </a>
                          <a href="#" className="material-link qualification">
                            <div className="material-icon">
                              <i className="bi bi-check2-circle"></i>
                            </div>
                            <div className="material-info">
                              <span className="material-title">Решения</span>
                              <span className="material-type">PDF, 2.8 MB</span>
                            </div>
                            <i className="bi bi-download"></i>
                          </a>
                        </div>
                      </div>
                      <div className="material-group">
                        <h6 className="material-group-title">
                          <i className="bi bi-trophy"></i> Результаты
                        </h6>
                        <div className="material-items">
                          <a href="#" className="material-link results">
                            <div className="material-icon">
                              <i className="bi bi-file-earmark-spreadsheet"></i>
                            </div>
                            <div className="material-info">
                              <span className="material-title">Итоговый протокол</span>
                              <span className="material-type">Excel, 0.4 MB</span>
                            </div>
                            <i className="bi bi-download"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="subject-card">
                    <div className="subject-header">
                      <div className="subject-icon">
                        <i className="bi bi-globe"></i>
                      </div>
                      <h3>География</h3>
                    </div>
                    <div className="materials-grid">
                      <div className="material-group">
                        <h6 className="material-group-title">
                          <i className="bi bi-1-circle"></i> Отборочный этап
                        </h6>
                        <div className="material-items">
                          <a href="#" className="material-link qualification">
                            <div className="material-icon">
                              <i className="bi bi-file-text"></i>
                            </div>
                            <div className="material-info">
                              <span className="material-title">Задания</span>
                              <span className="material-type">PDF, 2.9 MB</span>
                            </div>
                            <i className="bi bi-download"></i>
                          </a>
                          <a href="#" className="material-link qualification">
                            <div className="material-icon">
                              <i className="bi bi-check2-circle"></i>
                            </div>
                            <div className="material-info">
                              <span className="material-title">Решения</span>
                              <span className="material-type">PDF, 3.8 MB</span>
                            </div>
                            <i className="bi bi-download"></i>
                          </a>
                        </div>
                      </div>
                      <div className="material-group">
                        <h6 className="material-group-title">
                          <i className="bi bi-trophy"></i> Результаты
                        </h6>
                        <div className="material-items">
                          <a href="#" className="material-link results">
                            <div className="material-icon">
                              <i className="bi bi-file-earmark-spreadsheet"></i>
                            </div>
                            <div className="material-info">
                              <span className="material-title">Итоговый протокол</span>
                              <span className="material-type">Excel, 0.4 MB</span>
                            </div>
                            <i className="bi bi-download"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="subject-card">
                    <div className="subject-header">
                      <div className="subject-icon">
                        <i className="bi bi-droplet-fill"></i>
                      </div>
                      <h3>Химия</h3>
                    </div>
                    <div className="materials-grid">
                      <div className="material-group">
                        <h6 className="material-group-title">
                          <i className="bi bi-1-circle"></i> Отборочный этап
                        </h6>
                        <div className="material-items">
                          <a href="#" className="material-link qualification">
                            <div className="material-icon">
                              <i className="bi bi-file-text"></i>
                            </div>
                            <div className="material-info">
                              <span className="material-title">Задания</span>
                              <span className="material-type">PDF, 2.2 MB</span>
                            </div>
                            <i className="bi bi-download"></i>
                          </a>
                          <a href="#" className="material-link qualification">
                            <div className="material-icon">
                              <i className="bi bi-check2-circle"></i>
                            </div>
                            <div className="material-info">
                              <span className="material-title">Решения</span>
                              <span className="material-type">PDF, 3.0 MB</span>
                            </div>
                            <i className="bi bi-download"></i>
                          </a>
                        </div>
                      </div>
                      <div className="material-group">
                        <h6 className="material-group-title">
                          <i className="bi bi-trophy"></i> Результаты
                        </h6>
                        <div className="material-items">
                          <a href="#" className="material-link results">
                            <div className="material-icon">
                              <i className="bi bi-file-earmark-spreadsheet"></i>
                            </div>
                            <div className="material-info">
                              <span className="material-title">Итоговый протокол</span>
                              <span className="material-type">Excel, 0.3 MB</span>
                            </div>
                            <i className="bi bi-download"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="archive-photos">
                  <div className="photos-header">
                    <i className="bi bi-images"></i>
                    <h3>Фотогалерея</h3>
                  </div>
                  <div className="photos-grid">
                    <div className="photo-card">
                      <div className="photo-preview">
                        <i className="bi bi-image"></i>
                      </div>
                      <div className="photo-info">
                        <span className="photo-title">Церемония открытия</span>
                        <a href="#" className="photo-link">
                          <i className="bi bi-collection"></i>
                          Смотреть альбом
                        </a>
                      </div>
                    </div>
                    <div className="photo-card">
                      <div className="photo-preview">
                        <i className="bi bi-image"></i>
                      </div>
                      <div className="photo-info">
                        <span className="photo-title">Награждение победителей</span>
                        <a href="#" className="photo-link">
                          <i className="bi bi-collection"></i>
                          Смотреть альбом
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Добавьте другие годы по аналогии */}
          </div>

          {/* Help Section */}
          <div className="archive-help">
            <div className="help-wrapper">
              <div className="help-header">
                <div className="help-icon-wrapper">
                  <i className="bi bi-question-circle"></i>
                </div>
                <div>
                  <h3 className="help-title">Нужна помощь?</h3>
                </div>
              </div>
              
              <div className="help-content">
                <p className="help-text">
                  Если у вас возникли вопросы по материалам архива или вы не можете найти нужный документ, свяжитесь с нами по электронной почте:
                </p>
                
                <div className="help-contact">
                  <div className="help-email">
                    <i className="bi bi-envelope"></i>
                    <a href="mailto:support@arcticolympiad.ru">support@arcticolympiad.ru</a>
                  </div>
                  <p className="help-note">
                    Мы постараемся ответить на ваш запрос в течение одного рабочего дня
                  </p>
                </div>
              </div>
              
              <div className="help-decoration"></div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 