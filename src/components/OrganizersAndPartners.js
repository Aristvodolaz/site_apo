import React, { useState, useEffect } from 'react';
import styles from '../styles/OrganizersAndPartners.module.css';
import { organizersService } from '../lib/firebaseService';
import Image from 'next/image';

const OrganizersAndPartners = () => {
  const [organizers, setOrganizers] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOrganizersData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Загружаем организаторов и партнеров отдельно
        const [organizersData, partnersData] = await Promise.all([
          organizersService.getOrganizers(),
          organizersService.getPartners()
        ]);
        
        setOrganizers(organizersData);
        setPartners(partnersData);
      } catch (err) {
        console.error('Ошибка при загрузке данных организаторов:', err);
        setError('Не удалось загрузить данные организаторов');
      } finally {
        setLoading(false);
      }
    };

    loadOrganizersData();
  }, []);

  const handleCardClick = (website) => {
    if (website) {
      window.open(website, '_blank', 'noopener,noreferrer');
    }
  };

  const renderOrganizerCard = (organizer) => (
    <div 
      key={organizer.id} 
      className={`${styles.card} ${organizer.website ? styles.clickable : ''}`}
      onClick={() => handleCardClick(organizer.website)}
      role={organizer.website ? "button" : undefined}
      tabIndex={organizer.website ? 0 : undefined}
      onKeyDown={(e) => {
        if (organizer.website && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleCardClick(organizer.website);
        }
      }}
    >
      <div className={styles.imageWrapper}>
        <Image
          src={organizer.image}
          alt={organizer.title}
          width={200}
          height={100}
          className={styles.organizerImage}
          onError={() => {
            // Fallback обрабатывается Next.js автоматически
            console.log('Изображение не найдено:', organizer.image);
          }}
        />
        {organizer.website && (
          <div className={styles.visitOverlay}>
            <i className="bi bi-arrow-up-right-square"></i>
            <span>Перейти на сайт</span>
          </div>
        )}
      </div>
      <div className={styles.content}>
        <h3 className={styles.organizerTitle}>{organizer.title}</h3>
        <p className={styles.description}>{organizer.description}</p>
        {organizer.website && (
          <div className={styles.websiteHint}>
            <i className="bi bi-globe"></i>
            <span>Нажмите для перехода на сайт</span>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <section className="py-5">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12">
              <h2 className="section-heading side-bordered-header mb-0">Организаторы и партнеры</h2>
            </div>
          </div>
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Загрузка...</span>
            </div>
            <p className="mt-3 text-muted">Загружаем данные...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-5">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12">
              <h2 className="section-heading side-bordered-header mb-0">Организаторы и партнеры</h2>
            </div>
          </div>
          <div className="alert alert-danger text-center" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-5">
      <div className="container">
        <div className="row mb-5">
          <div className="col-12">
            <h2 className="section-heading side-bordered-header mb-0">Организаторы и партнеры</h2>
          </div>
        </div>
        
        {organizers.length > 0 && (
          <div className="mb-5">
            <div className={styles.grid}>
              {organizers.map(renderOrganizerCard)}
            </div>
          </div>
        )}

        {partners.length > 0 && (
          <div className="mb-5">
            <div className={styles.grid}>
              {partners.map(renderOrganizerCard)}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default OrganizersAndPartners; 