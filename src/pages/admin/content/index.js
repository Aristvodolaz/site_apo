import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '../../../components/admin/AdminLayout';

export default function AdminContent() {
  const [loading, setLoading] = useState(false);
  
  // Список доступных для редактирования страниц
  const contentPages = [
    { 
      id: 'contacts',
      title: 'Контакты', 
      description: 'Контактная информация и форма обратной связи',
      dataFile: 'contactsData.js',
      route: '/contacts'
    },
    { 
      id: 'history',
      title: 'История олимпиады', 
      description: 'Историческая информация об олимпиаде',
      dataFile: 'historyData.js',
      route: '/about/history'
    },
    {
      id: 'documents',
      title: 'Документы', 
      description: 'Официальные документы и регламенты олимпиады',
      dataFile: 'documentsData.js',
      route: '/documents'
    },
    {
      id: 'subjects',
      title: 'Предметы', 
      description: 'Информация по предметам олимпиады',
      dataFile: 'subjectsData.js',
      route: '/subjects'
    },
    {
      id: 'regions',
      title: 'Регионы', 
      description: 'Данные по регионам участников',
      dataFile: 'regionsData.js',
      route: ''
    }
  ];

  return (
    <AdminLayout>
      <Head>
        <title>Управление содержимым | Админ-панель</title>
      </Head>
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Управление содержимым страниц</h1>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </div>
        </div>
      ) : (
        <div className="row">
          {contentPages.map(page => (
            <div className="col-md-6 col-lg-4 mb-4" key={page.id}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{page.title}</h5>
                  <p className="card-text text-muted">{page.description}</p>
                  <p className="card-text small">
                    <span className="badge bg-light text-dark">Файл: {page.dataFile}</span>
                  </p>
                </div>
                <div className="card-footer bg-transparent d-flex justify-content-between">
                  <Link href={`/admin/content/edit/${page.id}`} className="btn btn-primary">
                    Редактировать
                  </Link>
                  {page.route && (
                    <Link href={page.route} target="_blank" className="btn btn-outline-secondary">
                      Просмотр
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
} 