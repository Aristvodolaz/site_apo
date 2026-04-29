export const documentsData = [
    {
      id: 1,
      title: 'Порядок проведения олимпиад школьников',
      description: 'Официальный документ Министерства науки и высшего образования Российской Федерации, регламентирующий проведение олимпиад школьников.',
      url: 'https://olymp.hse.ru/mirror/pubs/share/757723981.pdf',
      category: 'official'
    },
    {
      id: 2,
      title: 'Положение о проведении Арктической олимпиады',
      description: 'Основной документ, определяющий цели, задачи, порядок организации и проведения Арктической олимпиады «Полярный круг».',
      url: '/documents/polozhenie_arctic_olympiad_2025.pdf',
      category: 'main'
    },
    {
      id: 3,
      title: 'Регламент проведения Арктической олимпиады',
      description: 'Документ, регламентирующий порядок проведения отборочного и заключительного этапов Арктической олимпиады.',
      url: '/documents/reglament_arctic_olympiad_2025.pdf',
      category: 'main'
    },
    {
      id: 4,
      title: 'Положение об апелляции',
      description: 'Регламент подачи и рассмотрения апелляций на результаты проверки работ участников Арктической олимпиады.',
      url: '/documents/appeal_arctic_olympiad_2025.pdf',
      category: 'main'
    },
    {
      id: 5,
      title: 'Согласие на обработку персональных данных',
      description: 'Форма согласия, необходимая для участия в Арктической олимпиаде. Заполняется участником или его законным представителем.',
      url: '/documents/personal_data_agreement_2025.pdf',
      category: 'additional'
    },
    {
      id: 6,
      title: 'Регламент проведения по математике',
      description: 'Подробный регламент проведения отборочного и заключительного этапов по профилю "Математика".',
      url: '/documents/math_reglament_2025.pdf',
      category: 'subjects'
    },
    {
      id: 7,
      title: 'Регламент проведения по биологии',
      description: 'Подробный регламент проведения отборочного и заключительного этапов по профилю "Биология".',
      url: '/documents/biology_reglament_2025.pdf',
      category: 'subjects'
    },
    {
      id: 8,
      title: 'Регламент проведения по физике',
      description: 'Подробный регламент проведения отборочного и заключительного этапов по профилю "Физика".',
      url: '/documents/physics_reglament_2025.pdf',
      category: 'subjects'
    },
    {
      id: 9,
      title: 'Регламент проведения по химии',
      description: 'Подробный регламент проведения отборочного и заключительного этапов по профилю "Химия".',
      url: '/documents/chemistry_reglament_2025.pdf',
      category: 'subjects'
    },
    {
      id: 10,
      title: 'Приказ по итогам Арктической олимпиады (2026)',
      description: 'Официальный приказ по итогам проведения Арктической олимпиады школьников «Полярный круг».',
      url: '/documents/prikaz_po_itogam_arctic_olympiada_2026.pdf',
      category: 'main'
    },
    {
      id: 11,
      title: 'Заключительный этап Арктической олимпиады (2026)',
      description: 'Документ по организации заключительного этапа Арктической олимпиады школьников «Полярный круг» в 2026 учебном году.',
      url: '/documents/arctic_olympiada_2026_zaklyuchitelnyy_etap.pdf',
      category: 'main'
    },
    {
      id: 12,
      title: 'Календарный план Арктической олимпиады (2026)',
      description: 'Календарный план мероприятий Арктической олимпиады школьников «Полярный круг» на 2026 год.',
      url: '/documents/arctic_olympiada_2026_kalendarnyy_plan.pdf',
      category: 'main'
    }
  ];

/** PDF из public/documents — подмешиваются к записям Firestore на странице /documents */
export const documentsPublicStaticUrls = new Set([
  '/documents/prikaz_po_itogam_arctic_olympiada_2026.pdf',
  '/documents/arctic_olympiada_2026_zaklyuchitelnyy_etap.pdf',
  '/documents/arctic_olympiada_2026_kalendarnyy_plan.pdf',
]); 