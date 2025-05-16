import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import AdminProtected from '../../components/AdminProtected';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { db } from '../../lib/firebase';
import { collection, query, getDocs } from 'firebase/firestore';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    approved: 0,
    rejected: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const registrationsRef = collection(db, 'registrations');
        const querySnapshot = await getDocs(query(registrationsRef));
        
        const newStats = {
          total: 0,
          new: 0,
          approved: 0,
          rejected: 0
        };

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          newStats.total++;
          if (data.status === 'new') newStats.new++;
          if (data.status === 'approved') newStats.approved++;
          if (data.status === 'rejected') newStats.rejected++;
        });

        setStats(newStats);
      } catch (error) {
        console.error('Ошибка при загрузке статистики:', error);
      }
    };

    fetchStats();
  }, []);

  const menuItems = [
    {
      title: 'Управление участниками',
      description: 'Просмотр и редактирование данных участников',
      icon: 'people',
      color: 'primary',
      link: '/admin/participants',
      bgColor: 'rgba(var(--bs-primary-rgb), 0.1)'
    },
    {
      title: 'Новости',
      description: 'Управление новостями и публикациями',
      icon: 'newspaper',
      color: 'success',
      link: '/admin/news',
      bgColor: 'rgba(var(--bs-success-rgb), 0.1)'
    },
    {
      title: 'Журнал действий',
      description: 'История входов и действий в системе',
      icon: 'journal-text',
      color: 'info',
      link: '/admin/logs',
      bgColor: 'rgba(var(--bs-info-rgb), 0.1)'
    },
    {
      title: 'Настройки',
      description: 'Управление системными настройками',
      icon: 'gear',
      color: 'secondary',
      link: '/admin/settings',
      bgColor: 'rgba(var(--bs-secondary-rgb), 0.1)'
    }
  ];

  const statCards = [
    {
      title: 'Всего участников',
      value: stats.total,
      icon: 'people-fill',
      color: 'primary',
      bgColor: 'rgba(var(--bs-primary-rgb), 0.1)'
    },
    {
      title: 'Новых заявок',
      value: stats.new,
      icon: 'file-earmark-plus',
      color: 'warning',
      bgColor: 'rgba(var(--bs-warning-rgb), 0.1)'
    },
    {
      title: 'Подтверждено',
      value: stats.approved,
      icon: 'check-circle',
      color: 'success',
      bgColor: 'rgba(var(--bs-success-rgb), 0.1)'
    },
    {
      title: 'Отклонено',
      value: stats.rejected,
      icon: 'x-circle',
      color: 'danger',
      bgColor: 'rgba(var(--bs-danger-rgb), 0.1)'
    }
  ];

  return (
    <AdminProtected>
      <Layout title="Админ-панель">
        <div className="container-fluid px-4 px-lg-5 py-5">
          <div className="mx-auto" style={{ maxWidth: '1400px' }}>
            {/* Хлебные крошки */}
            <nav aria-label="breadcrumb" className="mb-4">
              <ol className="breadcrumb bg-transparent p-0 mb-0">
                <li className="breadcrumb-item active">
                  <i className="bi bi-house-door me-1 text-primary"></i>
                  <span className="text-primary">Админ-панель</span>
                </li>
              </ol>
            </nav>

            {/* Статистика */}
            <div className="row g-4 mb-5">
              {statCards.map((stat, index) => (
                <div key={index} className="col-md-6 col-xl-3">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                    }}
                    className="card border-0 shadow-sm h-100 rounded-4 overflow-hidden"
                  >
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center">
                        <div 
                          className="rounded-4 me-3 d-flex align-items-center justify-content-center"
                          style={{ 
                            width: '56px', 
                            height: '56px',
                            backgroundColor: stat.bgColor,
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <i className={`bi bi-${stat.icon} fs-3`} style={{ color: `var(--bs-${stat.color})` }}></i>
                        </div>
                        <div>
                          <h6 className="card-subtitle mb-2 text-muted small text-uppercase">{stat.title}</h6>
                          <h2 className="card-title mb-0 fw-bold display-6" style={{ color: `var(--bs-${stat.color})` }}>
                            {stat.value}
                          </h2>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>

            {/* Меню */}
            <div className="row g-4">
              {menuItems.map((item, index) => (
                <div key={index} className="col-md-6 col-xl-3">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                    }}
                    className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${item.bgColor} 0%, rgba(255,255,255,1) 80%)`
                    }}
                  >
                    <Link 
                      href={item.link}
                      className="card-body p-4 text-decoration-none position-relative"
                    >
                      <div 
                        className="rounded-4 mb-3 d-flex align-items-center justify-content-center"
                        style={{ 
                          width: '64px', 
                          height: '64px',
                          backgroundColor: 'rgba(255,255,255,0.9)',
                          backdropFilter: 'blur(8px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                        }}
                      >
                        <i className={`bi bi-${item.icon} fs-3`} style={{ color: `var(--bs-${item.color})` }}></i>
                      </div>
                      <div>
                        <h5 className="card-title mb-2 fw-bold" style={{ color: `var(--bs-${item.color})` }}>
                          {item.title}
                        </h5>
                        <p className="card-text text-muted mb-0">
                          {item.description}
                        </p>
                      </div>
                      <div 
                        className="position-absolute"
                        style={{
                          right: '-20px',
                          bottom: '-20px',
                          opacity: 0.1,
                          transform: 'rotate(-15deg)'
                        }}
                      >
                        <i className={`bi bi-${item.icon} display-1`} style={{ color: `var(--bs-${item.color})` }}></i>
                      </div>
                    </Link>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    </AdminProtected>
  );
} 