import { useState, useEffect } from 'react';
import { regionsData } from '../data/regionsData';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    school: '',
    region: '',
    city: '',
    customRegion: '',
    customCity: '',
    customCountry: '',
    grade: '',
    subjects: [],
  });
  
  const [useCustomLocation, setUseCustomLocation] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [emailCheckTimeout, setEmailCheckTimeout] = useState(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [isHovered, setIsHovered] = useState(null);
  const [formProgress, setFormProgress] = useState(0);

  // Обработчик клика по предмету
  const handleSubjectClick = (subject) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  // Анимация для появления элементов
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
  };

  // Вычисление прогресса заполнения формы
  useEffect(() => {
    const requiredFields = ['firstName', 'lastName', 'email', 'school', 'region', 'city', 'grade'];
    const filledFields = requiredFields.filter(field => formData[field].trim() !== '').length;
    const subjectsProgress = formData.subjects.length > 0 ? 1 : 0;
    const progress = ((filledFields + subjectsProgress) / (requiredFields.length + 1)) * 100;
    setFormProgress(progress);
  }, [formData]);

  // Проверка валидности текущего шага
  const isStepValid = (step) => {
    switch(step) {
      case 1:
        return formData.firstName.trim() !== '' && 
               formData.lastName.trim() !== '' && 
               !emailError;
      case 2:
        const locationValid = useCustomLocation 
          ? (formData.customRegion.trim() !== '' && formData.customCity.trim() !== '')
          : (formData.region !== '' && formData.city !== '');
        return formData.school.trim() !== '' && 
               locationValid && 
               formData.grade !== '';
      case 3:
        return formData.subjects.length > 0;
      default:
        return true;
    }
  };

  // Обработчик перехода между шагами
  const handleStepChange = (direction) => {
    if (direction === 'next' && isStepValid(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    } else if (direction === 'prev') {
      setCurrentStep(prev => Math.max(prev - 1, 1));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'email') {
      setEmailError(null);
      // Отменяем предыдущий таймаут, если он существует
      if (emailCheckTimeout) {
        clearTimeout(emailCheckTimeout);
      }
      
      // Устанавливаем новый таймаут для проверки email
      if (value.trim() !== '') {
        const newTimeout = setTimeout(async () => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (emailRegex.test(value)) {
            try {
              const exists = await checkEmailExists(value);
              if (exists) {
                setEmailError('Этот email уже зарегистрирован');
              }
            } catch (error) {
              console.error('Ошибка при проверке email:', error);
            }
          }
        }, 500); // Проверяем через 500мс после последнего ввода
        setEmailCheckTimeout(newTimeout);
      }
    }

    // Обработка переключения режима местоположения
    if (name === 'locationMode') {
      if (value === 'custom') {
        setUseCustomLocation(true);
        // Очищаем поля выбора из списка
        setFormData(prev => ({
          ...prev,
          region: '',
          city: ''
        }));
      } else {
        setUseCustomLocation(false);
        // Очищаем поля свободного ввода
        setFormData(prev => ({
          ...prev,
          customRegion: '',
          customCity: '',
          customCountry: ''
        }));
      }
      return;
    }

    if (name === 'region') {
      setFormData({
        ...formData,
        [name]: value,
        city: ''
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({
        ...formData,
        subjects: [...formData.subjects, value]
      });
    } else {
      setFormData({
        ...formData,
        subjects: formData.subjects.filter(subject => subject !== value)
      });
    }
  };

  const validateForm = () => {
    // Проверка обязательных полей
    if (!formData.firstName.trim()) return 'Введите имя';
    if (!formData.lastName.trim()) return 'Введите фамилию';
    if (!formData.email.trim()) return 'Введите email';
    if (!formData.school.trim()) return 'Введите название учебного заведения';
    // Проверка местоположения в зависимости от режима
    if (useCustomLocation) {
      if (!formData.customRegion.trim()) return 'Введите регион';
      if (!formData.customCity.trim()) return 'Введите город';
    } else {
      if (!formData.region) return 'Выберите регион';
      if (!formData.city) return 'Выберите город';
    }
    if (!formData.grade) return 'Выберите класс';
    if (formData.subjects.length === 0) return 'Выберите хотя бы один предмет';

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return 'Введите корректный email';


    return null;
  };

  const checkEmailExists = async (email) => {
    const registrationsRef = collection(db, 'registrations');
    const q = query(registrationsRef, where('email', '==', email.toLowerCase()));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    // Проверяем валидацию
    const validationError = validateForm();
    if (validationError) {
      setSubmitError(validationError);
      setIsSubmitting(false);
      return;
    }

    try {
      // Проверяем, существует ли уже регистрация с таким email
      const emailExists = await checkEmailExists(formData.email);
      if (emailExists) {
        setSubmitError('Участник с таким email уже зарегистрирован');
        setIsSubmitting(false);
        return;
      }

      // Подготавливаем данные для сохранения
      const dataToSave = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        middleName: formData.middleName,
        email: formData.email.toLowerCase(), // Сохраняем email в нижнем регистре
        school: formData.school,
        grade: formData.grade,
        subjects: formData.subjects,
        useCustomLocation: useCustomLocation,
        // Сохраняем данные местоположения в зависимости от режима
        ...(useCustomLocation ? {
          region: formData.customRegion,
          city: formData.customCity,
          country: formData.customCountry
        } : {
          region: formData.region,
          city: formData.city
        }),
        createdAt: serverTimestamp(),
        status: 'new',
        year: new Date().getFullYear()
      };

      // Добавляем данные в коллекцию registrations
      const registrationsRef = collection(db, 'registrations');
      await addDoc(registrationsRef, dataToSave);
      
      setSubmitSuccess(true);
      
      // Сброс формы
      setFormData({
        firstName: '',
        lastName: '',
        middleName: '',
        email: '',
        school: '',
        region: '',
        city: '',
        customRegion: '',
        customCity: '',
        customCountry: '',
        grade: '',
        subjects: [],
      });
      setUseCustomLocation(false);
    } catch (error) {
      console.error('Ошибка при сохранении данных:', error);
      setSubmitError('Произошла ошибка при отправке формы. Пожалуйста, попробуйте снова.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const grades = ['4', '5', '6', '7', '8', '9', '10', '11'];

  return (
    <motion.div 
      className="card shadow-lg border-0 rounded-4"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="card-body p-4 p-md-5">
        {submitSuccess ? (
          <motion.div 
            className="text-center py-5"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="d-flex flex-column align-items-center justify-content-center mb-4">
              <div 
                className="d-flex align-items-center justify-content-center mb-4"
                style={{ width: 80, height: 80, background: '#22a3661a', borderRadius: '50%' }}
              >
                <i className="bi bi-check-lg" style={{ color: '#22A366', fontSize: 48 }}></i>
              </div>
              <h1 
                className="fw-bold mb-3 d-flex align-items-center justify-content-center"
                style={{ fontSize: '2.1rem', lineHeight: 1.2 }}
              >
                <span 
                  className="me-3 d-inline-block"
                  style={{ width: 4, height: 36, background: '#1976f6', borderRadius: 2 }}
                ></span>
                <span>Регистрация успешно завершена!</span>
              </h1>
            </div>
            <div className="mb-4">
              <div className="text-muted fs-5">
                Благодарим за регистрацию на Арктическую олимпиаду «Полярный круг».<br/>
                Дополнительная информация была отправлена на указанный вами email.
              </div>
            </div>
            <button 
              className="btn btn-primary btn-lg px-5 rounded-pill d-inline-flex align-items-center"
              onClick={() => setSubmitSuccess(false)}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Зарегистрировать еще участника
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="needs-validation" noValidate>
            {/* Прогресс заполнения формы */}
            <div className="position-relative mb-5">
              <div className="position-absolute w-100" style={{ top: '16px' }}>
                <div className="progress" style={{ height: '3px' }}>
                  <motion.div
                    className="progress-bar bg-primary"
                    animate={{ width: `${formProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
              <div className="position-relative w-100 d-flex justify-content-between">
                {[1, 2, 3].map((step) => (
                  <motion.button
                    key={step}
                    type="button"
                    className={`btn btn-${currentStep >= step ? 'primary' : 'light'} rounded-circle d-flex align-items-center justify-content-center p-0`}
                    style={{ width: '35px', height: '35px', fontSize: '1rem' }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentStep(step)}
                    disabled={step > currentStep && !isStepValid(currentStep)}
                  >
                    {step}
                  </motion.button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={fadeInUp}
              >
                {currentStep === 1 && (
                  <div className="step-content">
                    <div className="text-center mb-5">
                      <h2 className="card-title fw-bold">Персональные данные</h2>
                      <p className="text-muted">Шаг 1 из 3 - Основная информация</p>
                    </div>

                    <div className="row g-4">
                      <div className="col-12 mb-2">
                        <h5 className="fw-bold mb-3">
                          <i className="bi bi-person-circle me-2"></i>
                          Персональные данные
                        </h5>
                      </div>

                      <div className="col-md-4">
                        <label htmlFor="lastName" className="form-label">
                          Фамилия <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg rounded-3"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          placeholder="Введите фамилию"
                        />
                      </div>

                      <div className="col-md-4">
                        <label htmlFor="firstName" className="form-label">
                          Имя <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg rounded-3"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          placeholder="Введите имя"
                        />
                      </div>

                      <div className="col-md-4">
                        <label htmlFor="middleName" className="form-label">Отчество</label>
                        <input
                          type="text"
                          className="form-control form-control-lg rounded-3"
                          id="middleName"
                          name="middleName"
                          value={formData.middleName}
                          onChange={handleChange}
                          placeholder="Введите отчество"
                        />
                      </div>

                      <div className="col-12 mt-4 mb-2">
                        <h5 className="fw-bold mb-3">
                          <i className="bi bi-envelope-check me-2"></i>
                          Контактные данные
                        </h5>
                      </div>
                      
                      <div className="col-md-6">
                        <label htmlFor="email" className="form-label">
                          Электронная почта <span className="text-danger">*</span>
                        </label>
                        <div className="input-group input-group-lg">
                          <span className="input-group-text bg-light">
                            <i className="bi bi-envelope"></i>
                          </span>
                          <input
                            type="email"
                            className={`form-control rounded-end ${emailError ? 'is-invalid' : ''}`}
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="example@mail.ru"
                          />
                          {emailError && (
                            <div className="invalid-feedback">
                              {emailError}
                            </div>
                          )}
                        </div>
                        <div className="form-text">
                          <i className="bi bi-info-circle me-1"></i>
                          На этот адрес будут отправлены дальнейшие инструкции
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="step-content">
                    <div className="text-center mb-5">
                      <h2 className="card-title fw-bold">Учебное заведение</h2>
                      <p className="text-muted">Шаг 2 из 3 - Информация об обучении</p>
                    </div>

                    <div className="row g-4">
                      <div className="col-12">
                        <label htmlFor="school" className="form-label">
                          Название учебного заведения <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg rounded-3"
                          id="school"
                          name="school"
                          value={formData.school}
                          onChange={handleChange}
                          required
                          placeholder="Например: МБОУ СОШ №1"
                        />
                      </div>

                      {/* Переключатель режима ввода местоположения */}
                      <div className="col-12">
                        <div className="d-flex align-items-center gap-3 mb-3">
                          <span className="fw-medium">Режим ввода местоположения:</span>
                          <div className="btn-group" role="group">
                            <input
                              type="radio"
                              className="btn-check"
                              name="locationMode"
                              id="locationModeList"
                              checked={!useCustomLocation}
                              onChange={() => setUseCustomLocation(false)}
                            />
                            <label className="btn btn-outline-primary" htmlFor="locationModeList">
                              <i className="bi bi-list-ul me-1"></i>
                              Из списка
                            </label>

                            <input
                              type="radio"
                              className="btn-check"
                              name="locationMode"
                              id="locationModeCustom"
                              checked={useCustomLocation}
                              onChange={() => setUseCustomLocation(true)}
                            />
                            <label className="btn btn-outline-primary" htmlFor="locationModeCustom">
                              <i className="bi bi-pencil-square me-1"></i>
                              Свободный ввод
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Поля для выбора из списка */}
                      {!useCustomLocation && (
                        <>
                          <div className="col-md-4">
                            <label htmlFor="region" className="form-label">
                          Регион <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select form-select-lg rounded-3"
                          id="region"
                          name="region"
                          value={formData.region}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Выберите регион</option>
                          {Object.keys(regionsData).map(region => (
                            <option key={region} value={region}>{region}</option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-4">
                        <label htmlFor="city" className="form-label">
                          Город <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select form-select-lg rounded-3"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          disabled={!formData.region}
                        >
                          <option value="">Выберите город</option>
                          {formData.region && regionsData[formData.region].map(city => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                        </select>
                      </div>
                        </>
                      )}

                      {/* Поля для свободного ввода */}
                      {useCustomLocation && (
                        <>
                          <div className="col-md-4">
                            <label htmlFor="customCountry" className="form-label">
                              Страна
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-lg rounded-3"
                              id="customCountry"
                              name="customCountry"
                              value={formData.customCountry}
                              onChange={handleChange}
                              placeholder="Например: Россия"
                            />
                          </div>

                          <div className="col-md-4">
                            <label htmlFor="customRegion" className="form-label">
                              Регион <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-lg rounded-3"
                              id="customRegion"
                              name="customRegion"
                              value={formData.customRegion}
                              onChange={handleChange}
                              required
                              placeholder="Например: Московская область"
                            />
                          </div>

                          <div className="col-md-4">
                            <label htmlFor="customCity" className="form-label">
                              Город <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-lg rounded-3"
                              id="customCity"
                              name="customCity"
                              value={formData.customCity}
                              onChange={handleChange}
                              required
                              placeholder="Например: Москва"
                            />
                          </div>
                        </>
                      )}

                      <div className="col-md-4">
                        <label htmlFor="grade" className="form-label">
                          Класс <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select form-select-lg rounded-3"
                          id="grade"
                          name="grade"
                          value={formData.grade}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Выберите класс</option>
                          {grades.map(grade => (
                            <option key={grade} value={grade}>{grade} класс</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="step-content">
                    <div className="text-center mb-5">
                      <h2 className="card-title fw-bold">Выбор предметов</h2>
                      <p className="text-muted">Шаг 3 из 3 - Завершение регистрации</p>
                    </div>

                    <div className="row g-4">
                      <div className="col-12">
                        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-3">
                          {['math', 'biology', 'physics', 'chemistry'].map((subject, index) => (
                            <motion.div
                              key={subject}
                              className="col"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <motion.div
                                className="position-relative"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleSubjectClick(subject)}
                              >
                                <div 
                                  className={`card border-2 bg-white rounded-4`}
                                  style={{
                                    borderColor: formData.subjects.includes(subject) 
                                      ? `var(--bs-${getSubjectColor(subject)})` 
                                      : 'var(--bs-gray-200)',
                                    backgroundColor: formData.subjects.includes(subject)
                                      ? `rgba(var(--bs-${getSubjectColor(subject)}-rgb), 0.02)`
                                      : 'white',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    minWidth: '180px'
                                  }}
                                >
                                  <div className="card-body py-3 px-3 d-flex align-items-center">
                                    <div 
                                      className="form-check-input me-2 rounded-3 border-2 flex-shrink-0 position-relative d-flex align-items-center justify-content-center"
                                      style={{
                                        width: '20px',
                                        height: '20px',
                                        borderColor: formData.subjects.includes(subject)
                                          ? `var(--bs-${getSubjectColor(subject)})`
                                          : 'var(--bs-gray-400)',
                                        backgroundColor: formData.subjects.includes(subject)
                                          ? `var(--bs-${getSubjectColor(subject)})`
                                          : 'white',
                                        boxShadow: formData.subjects.includes(subject)
                                          ? `0 2px 8px rgba(var(--bs-${getSubjectColor(subject)}-rgb), 0.15)`
                                          : 'none',
                                        transition: 'all 0.2s cubic-bezier(.4,2,.6,1)',
                                        cursor: 'pointer',
                                        marginTop: '0'
                                      }}
                                    >
                                      <motion.span
                                        initial={{ scale: 0.7, opacity: 0 }}
                                        animate={formData.subjects.includes(subject) ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
                                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          width: '100%',
                                          height: '100%'
                                        }}
                                      >
                                        {formData.subjects.includes(subject) && (
                                          <i 
                                            className="bi bi-check2"
                                            style={{
                                              color: 'white',
                                              fontSize: '1.1rem',
                                              fontWeight: 700,
                                              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.10))'
                                            }}
                                          />
                                        )}
                                      </motion.span>
                                    </div>
                                    <div className="d-flex align-items-center flex-grow-1 overflow-hidden">
                                      <i 
                                        className={`bi bi-${getSubjectIcon(subject)} me-2 flex-shrink-0`}
                                        style={{
                                          color: `var(--bs-${getSubjectColor(subject)})`,
                                          fontSize: '1.1rem'
                                        }}
                                      />
                                      <span 
                                        className="fw-medium text-nowrap"
                                        style={{
                                          color: formData.subjects.includes(subject)
                                            ? `var(--bs-${getSubjectColor(subject)})`
                                            : 'var(--bs-gray-700)',
                                          fontSize: '0.95rem'
                                        }}
                                      >
                                        {getSubjectName(subject)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-5 d-flex justify-content-between">
              {currentStep > 1 && (
                <motion.button
                  type="button"
                  className="btn btn-outline-primary btn-lg px-5 rounded-pill"
                  onClick={() => handleStepChange('prev')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Назад
                </motion.button>
              )}

              {currentStep < 3 ? (
                <motion.button
                  type="button"
                  className="btn btn-primary btn-lg px-5 rounded-pill ms-auto"
                  onClick={() => handleStepChange('next')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!isStepValid(currentStep)}
                >
                  Далее
                  <i className="bi bi-arrow-right ms-2"></i>
                </motion.button>
              ) : (
                <motion.button
                  type="submit"
                  className="btn btn-primary btn-lg px-5 rounded-pill ms-auto"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting || !isStepValid(currentStep)}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Отправка...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send-fill me-2"></i>
                      Завершить регистрацию
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </form>
        )}
      </div>
    </motion.div>
  );
}

// Вспомогательные функции для работы с предметами
const getSubjectColor = (subject) => {
  const colors = {
    math: 'primary',
    biology: 'success',
    physics: 'warning',
    chemistry: 'danger'
  };
  return colors[subject];
};

const getSubjectIcon = (subject) => {
  const icons = {
    math: 'calculator',
    biology: 'tree',
    physics: 'lightning',
    chemistry: 'droplet'
  };
  return icons[subject];
};

const getSubjectName = (subject) => {
  const names = {
    math: 'Математика',
    biology: 'Биология',
    physics: 'Физика',
    chemistry: 'Химия'
  };
  return names[subject];
};

const getSubjectDescription = (subject) => {
  const descriptions = {
    math: 'Алгебра и геометрия',
    biology: 'Биология и экология',
    physics: 'Механика и электричество',
    chemistry: 'Органическая и неорганическая'
  };
  return descriptions[subject];
}; 