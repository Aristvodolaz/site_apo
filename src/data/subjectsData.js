export const subjectsData = [
  {
    id: 'math',
    title: 'Математика',
    shortDescription: 'Олимпиада по математике для учащихся 4-11 классов',
    description: 'Математика — старейший профиль Арктической олимпиады, проводится с 2020 года. В отборочном этапе 2024 года приняли участие 2460 школьников, а в заключительном — 709. К участию приглашаются учащиеся 4-11 классов.',
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
        qualification: '/files/math/2024/qualification.pdf',
        final: '/files/math/2024/final.pdf',
        solutions: '/files/math/2024/solutions.pdf'
      },
      {
        year: '2023',
        qualification: '/files/math/2023/qualification.pdf',
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