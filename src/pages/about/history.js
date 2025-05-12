import Layout from '../../components/Layout';
import PageHeader from '../../components/PageHeader';
import { historyData } from '../../data/historyData';

export default function History() {
  return (
    <Layout title="История олимпиады">
      <PageHeader 
        title="История олимпиады" 
        subtitle="Развитие Арктической олимпиады «Полярный круг» с момента ее создания"
      />
      
      <div className="container py-5">
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <div className="mb-5">
              <p className="lead">
                Арктическая олимпиада «Полярный круг» прошла долгий путь развития 
                от небольшой региональной олимпиады по математике до всероссийского 
                соревнования по нескольким предметам.
              </p>
            </div>
            
            <div className="timeline">
              {historyData.map((item, index) => (
                <div className="timeline-item" key={index}>
                  <div className="card mb-4">
                    <div className="card-header bg-primary bg-opacity-10">
                      <h3 className="h5 mb-0">{item.year}: {item.title}</h3>
                    </div>
                    <div className="card-body">
                      <p>{item.description}</p>
                      
                      <h5 className="mt-4 mb-3">Основные характеристики:</h5>
                      <ul className="list-group list-group-flush mb-3">
                        {item.stats.subjects && (
                          <li className="list-group-item d-flex">
                            <strong className="me-2">Предметы:</strong>
                            <span>{item.stats.subjects.join(', ')}</span>
                          </li>
                        )}
                        
                        {item.stats.participants && (
                          <li className="list-group-item d-flex">
                            <strong className="me-2">Участники:</strong>
                            <span>
                              {typeof item.stats.participants === 'object' 
                                ? item.stats.participants.total 
                                : item.stats.participants}
                            </span>
                          </li>
                        )}
                        
                        {item.stats.finalists && (
                          <li className="list-group-item d-flex">
                            <strong className="me-2">Финалисты:</strong>
                            <span>{item.stats.finalists}</span>
                          </li>
                        )}
                        
                        {item.stats.winners && (
                          <li className="list-group-item d-flex">
                            <strong className="me-2">Победители и призеры:</strong>
                            <span>{item.stats.winners}</span>
                          </li>
                        )}
                        
                        {item.stats.grades && (
                          <li className="list-group-item d-flex">
                            <strong className="me-2">Классы:</strong>
                            <span>{item.stats.grades}</span>
                          </li>
                        )}
                        
                        {item.stats.regions && (
                          <li className="list-group-item d-flex">
                            <strong className="me-2">Регионы:</strong>
                            <span>{item.stats.regions}</span>
                          </li>
                        )}
                      </ul>
                      
                      {item.achievements && (
                        <div className="alert alert-success">
                          <strong>Достижения:</strong> {item.achievements}
                        </div>
                      )}
                      
                      {item.stats.locations && (
                        <div>
                          <h5 className="mt-4 mb-3">Площадки проведения:</h5>
                          {item.stats.locations.yanao && (
                            <p><strong>ЯНАО:</strong> {item.stats.locations.yanao}</p>
                          )}
                          {item.stats.locations.other && (
                            <p><strong>Другие регионы:</strong> {item.stats.locations.other.join(', ')}</p>
                          )}
                        </div>
                      )}
                      
                      {/* Detailed statistics for 2024/2025 */}
                      {item.year === '2024/2025' && item.stats.participants && typeof item.stats.participants === 'object' && (
                        <div className="mt-4">
                          <h5 className="mb-3">Статистика по предметам:</h5>
                          <div className="table-responsive">
                            <table className="table table-bordered">
                              <thead>
                                <tr>
                                  <th>Предмет</th>
                                  <th>Отборочный этап</th>
                                  <th>Заключительный этап</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>Математика</td>
                                  <td>{item.stats.participants.math.qualification}</td>
                                  <td>{item.stats.participants.math.final}</td>
                                </tr>
                                <tr>
                                  <td>Биология</td>
                                  <td>{item.stats.participants.biology.qualification}</td>
                                  <td>{item.stats.participants.biology.final}</td>
                                </tr>
                                <tr>
                                  <td>Физика</td>
                                  <td>{item.stats.participants.physics.qualification}</td>
                                  <td>{item.stats.participants.physics.final}</td>
                                </tr>
                                <tr>
                                  <td>Химия</td>
                                  <td>{item.stats.participants.chemistry.qualification}</td>
                                  <td>{item.stats.participants.chemistry.final}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 