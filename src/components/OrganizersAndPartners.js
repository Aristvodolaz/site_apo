import React from 'react';
import styles from '../styles/OrganizersAndPartners.module.css';

const organizers = [
  {
    id: 1,
    title: 'Департамент образования',
    description: 'Главный организатор Арктической олимпиады',
    icon: '🏛️'
  },
  {
    id: 2,
    title: 'Региональный институт развития образования ЯНАО',
    description: 'Организационно-методическое сопровождение',
    icon: '📚'
  },
  {
    id: 3,
    title: 'ЦПМ',
    description: 'Учебный центр подготовки',
    icon: '🎓'
  },
  {
    id: 4,
    title: 'АПО',
    description: 'Методическая поддержка',
    icon: '📋'
  }
];

const OrganizersAndPartners = () => {
  return (
    <section className="py-5">
      <div className="container">
        <div className="row mb-5">
          <div className="col-12">
            <h2 className="section-heading side-bordered-header mb-0">Организаторы и партнеры</h2>
          </div>
        </div>
        <div className={styles.grid}>
          {organizers.map((org) => (
            <div key={org.id} className={styles.card}>
              <div className={styles.iconWrapper}>
                <span className={styles.icon}>{org.icon}</span>
              </div>
              <h3 className={styles.organizerTitle}>{org.title}</h3>
              <p className={styles.description}>{org.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OrganizersAndPartners; 