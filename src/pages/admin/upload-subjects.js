import { useState } from 'react';
import Layout from '../../components/Layout';
import { db } from '../../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function UploadSubjects() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Данные предметов для загрузки
  const subjectsData = [
    {
      id: 'math',
      title: 'Математика',
      shortDescription: 'Олимпиада по математике для учащихся 4-11 классов',
      description: 'Арктическая олимпиада «Полярный круг» стартовала в 2020 году как небольшое региональное состязание по математике. Сегодня это масштабная всероссийская олимпиада по четырем предметам, объединяющая участников из более чем 70 регионов России и стран СНГ — Беларуси, Молдовы, Кыргызстана и Узбекистана.',
      icon: 'calculator',
      color: 'primary',
      link: '/subjects/math',
      grades: [4, 5, 6, 7, 8, 9, 10, 11],
      schedule: {
        qualification: {
          start: '01.11.2024',
          end: '15.11.2024',
          format: 'Онлайн'
        },
        final: {
          start: '10.02.2025',
          end: '20.02.2025',
          format: 'Очно на региональных площадках'
        }
      },
      pastProblems: [
        {
          year: '2024',
          qualification: 'https://disk.360.yandex.ru/d/sXBClzFG1e8eZw',
          final: 'https://disk.360.yandex.ru/d/sXBClzFG1e8eZw',
          solutions: '/files/math/2024/solutions.pdf'
        },
        {
          year: '2023',
          qualification: 'https://disk.360.yandex.ru/d/sXBClzFG1e8eZw',
          final: '/files/math/2023/final.pdf',
          solutions: '/files/math/2023/solutions.pdf'
        }
      ],
      locations: ['Москва', 'Нижний Новгород', 'Липецк', 'Тюмень', 'Красноярск', 'Владивосток']
    },
    {
      id: 'biology',
      title: 'Биология',
      shortDescription: 'Олимпиада по биологии для учащихся 5-11 классов',
      description: 'Биология — один из профилей Арктической олимпиады, впервые организованный в 2022 году. В отборочном этапе 2024 года приняли участие 1381 школьник, а в заключительном — 426. К участию приглашаются учащиеся 5-11 классов.',
      icon: 'tree',
      color: 'success',
      link: '/subjects/biology',
      grades: [5, 6, 7, 8, 9, 10, 11],
      schedule: {
        qualification: {
          start: '01.11.2024',
          end: '15.11.2024',
          format: 'Онлайн'
        },
        final: {
          start: '17.02.2025',
          end: '27.02.2025',
          format: 'Очно на региональных площадках'
        }
      },
      pastProblems: [
        {
          year: '2024',
          qualification: '/files/biology/2024/qualification.pdf',
          final: '/files/biology/2024/final.pdf',
          solutions: '/files/biology/2024/solutions.pdf'
        },
        {
          year: '2023',
          qualification: '/files/biology/2023/qualification.pdf',
          final: '/files/biology/2023/final.pdf',
          solutions: '/files/biology/2023/solutions.pdf'
        }
      ],
      locations: ['Санкт-Петербург', 'Екатеринбург']
    },
    {
      id: 'physics',
      title: 'Физика',
      shortDescription: 'Олимпиада по физике для учащихся 7-11 классов',
      description: 'Физика включена в список профилей Арктической олимпиады с 2022 года. В отборочном этапе 2024 года приняли участие 391 школьник, а в заключительном — 81. К участию приглашаются учащиеся 7-11 классов.',
      icon: 'lightning',
      color: 'danger',
      link: '/subjects/physics',
      grades: [7, 8, 9, 10, 11],
      schedule: {
        qualification: {
          start: '01.11.2024',
          end: '15.11.2024',
          format: 'Онлайн'
        },
        final: {
          start: '24.02.2025',
          end: '05.03.2025',
          format: 'Очно на региональных площадках'
        }
      },
      pastProblems: [
        {
          year: '2024',
          qualification: '/files/physics/2024/qualification.pdf',
          final: '/files/physics/2024/final.pdf',
          solutions: '/files/physics/2024/solutions.pdf'
        },
        {
          year: '2023',
          qualification: '/files/physics/2023/qualification.pdf',
          final: '/files/physics/2023/final.pdf',
          solutions: '/files/physics/2023/solutions.pdf'
        }
      ]
    },
    {
      id: 'chemistry',
      title: 'Химия',
      shortDescription: 'Олимпиада по химии для учащихся 8-11 классов',
      description: 'Химия — профиль, добавленный в программу Арктической олимпиады в 2023 году. В отборочном этапе 2024 года приняли участие 532 школьника, а в заключительном — 127. К участию приглашаются учащиеся 8-11 классов.',
      icon: 'droplet-fill',
      color: 'warning',
      link: '/subjects/chemistry',
      grades: [8, 9, 10, 11],
      schedule: {
        qualification: {
          start: '01.11.2024',
          end: '15.11.2024',
          format: 'Онлайн'
        },
        final: {
          start: '03.03.2025',
          end: '12.03.2025',
          format: 'Очно на региональных площадках'
        }
      },
      pastProblems: [
        {
          year: '2024',
          qualification: '/files/chemistry/2024/qualification.pdf',
          final: '/files/chemistry/2024/final.pdf',
          solutions: '/files/chemistry/2024/solutions.pdf'
        }
      ]
    }
  ];

  const uploadSubjects = async () => {
    setLoading(true);
    setMessage('');

    try {
      for (let i = 0; i < subjectsData.length; i++) {
        const subject = subjectsData[i];
        const docRef = doc(db, 'subjects', i.toString());
        
        await setDoc(docRef, {
          ...subject,
          created_at: new Date(),
          updated_at: new Date()
        });
        
        console.log(`✅ Загружен предмет: ${subject.title} (ID: ${i})`);
      }
      
      setMessage('🎉 Все предметы успешно загружены в Firebase!');
    } catch (error) {
      console.error('❌ Ошибка при загрузке предметов:', error);
      setMessage(`❌ Ошибка: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Загрузка предметов в Firebase">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title mb-0">Загрузка данных предметов в Firebase</h2>
              </div>
              <div className="card-body">
                <p className="text-muted mb-4">
                  Эта страница поможет загрузить данные предметов в Firebase. 
                  Будут созданы документы с ID: 0 (математика), 1 (биология), 2 (физика), 3 (химия).
                </p>
                
                <div className="mb-4">
                  <h5>Предметы для загрузки:</h5>
                  <ul className="list-group">
                    {subjectsData.map((subject, index) => (
                      <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{subject.title}</strong>
                          <br />
                          <small className="text-muted">{subject.shortDescription}</small>
                        </div>
                        <span className="badge bg-primary">ID: {index}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button 
                  className="btn btn-primary btn-lg"
                  onClick={uploadSubjects}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Загружаем...
                    </>
                  ) : (
                    'Загрузить предметы в Firebase'
                  )}
                </button>

                {message && (
                  <div className={`alert ${message.includes('❌') ? 'alert-danger' : 'alert-success'} mt-3`}>
                    {message}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 