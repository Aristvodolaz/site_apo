import React from 'react';
import Link from 'next/link';

const subjects = [
  {
    id: 'math',
    title: 'Математика',
    description: 'Олимпиада по математике для учащихся 4-11 классов',
    icon: 'bi-calculator',
    color: 'math',
    link: '/subjects/math'
  },
  {
    id: 'biology',
    title: 'Биология',
    description: 'Олимпиада по биологии для учащихся 5-11 классов',
    icon: 'bi-tree',
    color: 'biology',
    link: '/subjects/biology'
  },
  {
    id: 'physics',
    title: 'Физика',
    description: 'Олимпиада по физике для учащихся 7-11 классов',
    icon: 'bi-lightning',
    color: 'physics',
    link: '/subjects/physics'
  },
  {
    id: 'chemistry',
    title: 'Химия',
    description: 'Олимпиада по химии для учащихся 8-11 классов',
    icon: 'bi-droplet',
    color: 'chemistry',
    link: '/subjects/chemistry'
  }
];

const SubjectsGrid = () => {
  return (
    <div className="subjects-grid">
      {subjects.map((subject) => (
        <div key={subject.id} className="subject-profile-card">
          <div className={`subject-icon-wrapper ${subject.color}`}>
            <i className={`bi ${subject.icon}`}></i>
          </div>
          <h3 className="subject-title">{subject.title}</h3>
          <p className="subject-description">{subject.description}</p>
          <Link href={subject.link} className="subject-link">
            Подробнее <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default SubjectsGrid; 