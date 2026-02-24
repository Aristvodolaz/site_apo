import { useState, useEffect } from 'react';
import { regionsData } from '../data/regionsData';
import { getVenuesForSubject } from '../data/venuesData';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';

const SUBJECT_IDS = ['math', 'biology', 'physics', 'chemistry'];
const SUBJECT_NAMES = { math: 'Математика', biology: 'Биология', physics: 'Физика', chemistry: 'Химия' };
const SUBJECT_COLORS = { math: 'primary', biology: 'success', physics: 'warning', chemistry: 'danger' };
const SUBJECT_ICONS = { math: 'calculator', biology: 'tree', physics: 'lightning', chemistry: 'droplet' };

const STAGE_REGISTRATIONS = 'stage_registrations';

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    isWinnerOrPrize: false,
    lastName: '',
    firstName: '',
    middleName: '',
    email: '',
    participantId: '',
    region: '',
    locality: '',
    school: '',
    grade: '',
    subjects: [],
    subjectVenues: { math: '', biology: '', physics: '', chemistry: '' },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [emailCheckTimeout, setEmailCheckTimeout] = useState(null);
  const [showEmailRequired, setShowEmailRequired] = useState(false);

  const [currentStep, setCurrentStep] = useState(1);
  const [formProgress, setFormProgress] = useState(0);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 },
  };

  useEffect(() => {
    const step1 = formData.firstName.trim() && formData.lastName.trim() && formData.email.trim() && !emailError;
    const step1Id = formData.isWinnerOrPrize || formData.participantId.trim();
    const step2 = formData.region && formData.locality.trim() && formData.school.trim() && formData.grade;
    const step3 = formData.subjects.length > 0;
    const step4 = formData.subjects.every((s) => (formData.subjectVenues[s] || '').trim() !== '');
    const p = [step1 && step1Id, step2, step3, step4].filter(Boolean).length;
    setFormProgress((p / 4) * 100);
  }, [formData, emailError]);

  const isStepValid = (step) => {
    switch (step) {
      case 1: {
        const base = formData.firstName.trim() !== '' && formData.lastName.trim() !== '' && formData.email.trim() !== '' && !emailError;
        const idOk = formData.isWinnerOrPrize || (formData.participantId || '').trim() !== '';
        return base && idOk;
      }
      case 2:
        return formData.region !== '' && formData.locality.trim() !== '' && formData.school.trim() !== '' && formData.grade !== '';
      case 3:
        return formData.subjects.length > 0;
      case 4:
        return formData.subjects.every((s) => (formData.subjectVenues[s] || '').trim() !== '');
      default:
        return true;
    }
  };

  const handleStepChange = (direction) => {
    if (direction === 'next') {
      if (currentStep === 1 && formData.email.trim() === '') {
        setShowEmailRequired(true);
        return;
      }
      if (isStepValid(currentStep)) {
        setShowEmailRequired(false);
        setCurrentStep((prev) => Math.min(prev + 1, 4));
      }
    } else {
      setShowEmailRequired(false);
      setCurrentStep((prev) => Math.max(prev - 1, 1));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmailError(null);
      setShowEmailRequired(false);
      if (emailCheckTimeout) clearTimeout(emailCheckTimeout);
      if (value.trim() !== '') {
        const t = setTimeout(async () => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (emailRegex.test(value)) {
            try {
              const exists = await checkEmailExists(value);
              if (exists) setEmailError('Этот email уже зарегистрирован');
            } catch (err) {
              console.error('Ошибка при проверке email:', err);
            }
          }
        }, 500);
        setEmailCheckTimeout(t);
      }
    }
    if (name === 'region') {
      setFormData((prev) => ({ ...prev, [name]: value }));
      return;
    }
    if (name.startsWith('venue_')) {
      const sub = name.replace('venue_', '');
      setFormData((prev) => ({
        ...prev,
        subjectVenues: { ...prev.subjectVenues, [sub]: value },
      }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleWinnerChange = (e) => {
    const checked = e.target.checked;
    setFormData((prev) => ({
      ...prev,
      isWinnerOrPrize: checked,
      participantId: checked ? '' : prev.participantId,
    }));
  };

  const handleSubjectClick = (subject) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s) => s !== subject)
        : [...prev.subjects, subject],
      subjectVenues: prev.subjects.includes(subject)
        ? { ...prev.subjectVenues, [subject]: '' }
        : prev.subjectVenues,
    }));
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) return 'Введите имя';
    if (!formData.lastName.trim()) return 'Введите фамилию';
    if (!formData.email.trim()) return 'Введите email';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return 'Введите корректный email';
    if (!formData.isWinnerOrPrize && !(formData.participantId || '').trim()) return 'Укажите Айди участника (из протоколов отборочного этапа)';
    if (!formData.region) return 'Выберите регион';
    if (!formData.locality.trim()) return 'Введите населённый пункт';
    if (!formData.school.trim()) return 'Введите название ОУ';
    if (!formData.grade) return 'Выберите класс';
    if (formData.subjects.length === 0) return 'Выберите хотя бы один предмет';
    for (const s of formData.subjects) {
      if (!(formData.subjectVenues[s] || '').trim()) return `Выберите площадку для предмета «${SUBJECT_NAMES[s]}»`;
    }
    return null;
  };

  const checkEmailExists = async (email) => {
    const ref = collection(db, STAGE_REGISTRATIONS);
    const q = query(ref, where('email', '==', email.toLowerCase()));
    const snap = await getDocs(q);
    return !snap.empty;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    const err = validateForm();
    if (err) {
      setSubmitError(err);
      setIsSubmitting(false);
      return;
    }
    const emailExists = await checkEmailExists(formData.email);
    if (emailExists) {
      setSubmitError('Участник с таким email уже зарегистрирован');
      setIsSubmitting(false);
      return;
    }
    try {
      const payload = {
        isWinnerOrPrize: formData.isWinnerOrPrize,
        lastName: formData.lastName.trim(),
        firstName: formData.firstName.trim(),
        middleName: (formData.middleName || '').trim(),
        email: formData.email.toLowerCase(),
        participantId: formData.isWinnerOrPrize ? '' : (formData.participantId || '').trim(),
        region: formData.region,
        locality: formData.locality.trim(),
        school: formData.school.trim(),
        grade: formData.grade,
        subjects: formData.subjects,
        subjectVenues: formData.subjects.reduce((acc, s) => {
          acc[s] = (formData.subjectVenues[s] || '').trim();
          return acc;
        }, {}),
        createdAt: serverTimestamp(),
        status: 'new',
        year: new Date().getFullYear(),
      };
      const ref = collection(db, STAGE_REGISTRATIONS);
      await addDoc(ref, payload);

      try {
        await fetch('/api/email/send-registration-confirmation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            userData: {
              firstName: formData.firstName,
              middleName: formData.middleName,
              lastName: formData.lastName,
              email: formData.email,
              school: formData.school,
              grade: formData.grade,
              region: formData.region,
              locality: formData.locality,
              subjects: formData.subjects,
              participantId: payload.participantId || null,
            },
          }),
        });
      } catch (emailErr) {
        console.error('Ошибка отправки email:', emailErr);
      }

      setSubmitSuccess(true);
      setFormData({
        isWinnerOrPrize: false,
        lastName: '',
        firstName: '',
        middleName: '',
        email: '',
        participantId: '',
        region: '',
        locality: '',
        school: '',
        grade: '',
        subjects: [],
        subjectVenues: { math: '', biology: '', physics: '', chemistry: '' },
      });
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
      setSubmitError('Произошла ошибка при отправке формы. Попробуйте снова.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <h1 className="fw-bold mb-3" style={{ fontSize: '2.1rem', lineHeight: 1.2 }}>
                <span className="me-3 d-inline-block" style={{ width: 4, height: 36, background: '#1976f6', borderRadius: 2 }}></span>
                Регистрация успешно завершена!
              </h1>
            </div>
            <div className="mb-4 text-muted fs-5">
              Благодарим за регистрацию. Дополнительная информация отправлена на указанный email.
            </div>
            <button className="btn btn-primary btn-lg px-5 rounded-pill" onClick={() => setSubmitSuccess(false)}>
              <i className="bi bi-plus-circle me-2"></i>
              Зарегистрировать ещё участника
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="needs-validation" noValidate>
            {submitError && (
              <div className="alert alert-danger mb-4" role="alert">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {submitError}
              </div>
            )}
            <div className="position-relative mb-5">
              <div className="position-absolute w-100" style={{ top: '16px' }}>
                <div className="progress" style={{ height: '3px' }}>
                  <motion.div className="progress-bar bg-primary" animate={{ width: `${formProgress}%` }} transition={{ duration: 0.3 }} />
                </div>
              </div>
              <div className="position-relative w-100 d-flex justify-content-between">
                {[1, 2, 3, 4].map((step) => (
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
              <motion.div key={currentStep} initial="initial" animate="animate" exit="exit" variants={fadeInUp}>
                {currentStep === 1 && (
                  <div className="step-content">
                    <div className="text-center mb-4">
                      <h2 className="card-title fw-bold">Персональные данные</h2>
                      <p className="text-muted">Шаг 1 из 4</p>
                    </div>

                    <div className="alert alert-info d-flex align-items-start mb-4" role="alert">
                      <i className="bi bi-info-circle-fill me-2 mt-1"></i>
                      <div>
                        <strong>Айди участника:</strong> смотрите его в протоколах отборочного этапа на сайте. Если вы победитель или призёр прошлых лет — зарегистрируйтесь и дождитесь письма на почту с персональным Айди.
                      </div>
                    </div>

                    <div className="form-check mb-4">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="isWinnerOrPrize"
                        checked={formData.isWinnerOrPrize}
                        onChange={handleWinnerChange}
                      />
                      <label className="form-check-label fw-medium" htmlFor="isWinnerOrPrize">
                        Являюсь победителем/призёром прошлых лет
                      </label>
                    </div>

                    <div className="row g-4">
                      <div className="col-md-4">
                        <label htmlFor="lastName" className="form-label">Фамилия <span className="text-danger">*</span></label>
                        <input type="text" className="form-control form-control-lg rounded-3" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Фамилия" />
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="firstName" className="form-label">Имя <span className="text-danger">*</span></label>
                        <input type="text" className="form-control form-control-lg rounded-3" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="Имя" />
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="middleName" className="form-label">Отчество</label>
                        <input type="text" className="form-control form-control-lg rounded-3" id="middleName" name="middleName" value={formData.middleName} onChange={handleChange} placeholder="Отчество" />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="email" className="form-label">Почта <span className="text-danger">*</span></label>
                        <div className="input-group input-group-lg">
                          <span className="input-group-text bg-light"><i className="bi bi-envelope"></i></span>
                          <input
                            type="email"
                            className={`form-control rounded-end ${emailError || showEmailRequired ? 'is-invalid' : ''}`}
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="example@mail.ru"
                          />
                          {(emailError || (showEmailRequired && !emailError)) && (
                            <div className="invalid-feedback">{emailError || 'Введите электронную почту'}</div>
                          )}
                        </div>
                      </div>
                      {!formData.isWinnerOrPrize && (
                        <div className="col-md-6">
                          <label htmlFor="participantId" className="form-label">Айди <span className="text-danger">*</span></label>
                          <input
                            type="text"
                            className="form-control form-control-lg rounded-3"
                            id="participantId"
                            name="participantId"
                            value={formData.participantId}
                            onChange={handleChange}
                            required={!formData.isWinnerOrPrize}
                            placeholder="Из протоколов отборочного этапа"
                          />
                          <div className="form-text">Укажите Айди из протоколов отборочного этапа с сайта</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="step-content">
                    <div className="text-center mb-4">
                      <h2 className="card-title fw-bold">Регион и ОУ</h2>
                      <p className="text-muted">Шаг 2 из 4</p>
                    </div>
                    <div className="row g-4">
                      <div className="col-12">
                        <label htmlFor="region" className="form-label">Регион <span className="text-danger">*</span></label>
                        <select className="form-select form-select-lg rounded-3" id="region" name="region" value={formData.region} onChange={handleChange} required>
                          <option value="">Выберите регион</option>
                          {Object.keys(regionsData).map((region) => (
                            <option key={region} value={region}>{region}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-12">
                        <label htmlFor="locality" className="form-label">Населённый пункт <span className="text-danger">*</span></label>
                        <input type="text" className="form-control form-control-lg rounded-3" id="locality" name="locality" value={formData.locality} onChange={handleChange} required placeholder="Город, село, п.г.т. и т.д." />
                      </div>
                      <div className="col-12">
                        <label htmlFor="school" className="form-label">Название ОУ <span className="text-danger">*</span></label>
                        <input type="text" className="form-control form-control-lg rounded-3" id="school" name="school" value={formData.school} onChange={handleChange} required placeholder="Например: МБОУ СОШ №1" />
                      </div>
                      <div className="col-12">
                        <label htmlFor="grade" className="form-label">Класс <span className="text-danger">*</span></label>
                        <select className="form-select form-select-lg rounded-3" id="grade" name="grade" value={formData.grade} onChange={handleChange} required>
                          <option value="">Выберите класс</option>
                          {['4', '5', '6', '7', '8', '9', '10', '11'].map((g) => (
                            <option key={g} value={g}>{g} класс</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="step-content">
                    <div className="text-center mb-4">
                      <h2 className="card-title fw-bold">Выбор предметов</h2>
                      <p className="text-muted">Шаг 3 из 4</p>
                    </div>
                    <div className="row g-4">
                      <div className="col-12">
                        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-3">
                          {SUBJECT_IDS.map((subject) => (
                            <motion.div key={subject} className="col" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                              <motion.div
                                className="position-relative"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleSubjectClick(subject)}
                              >
                                <div
                                  className="card border-2 bg-white rounded-4"
                                  style={{
                                    borderColor: formData.subjects.includes(subject) ? `var(--bs-${SUBJECT_COLORS[subject]})` : 'var(--bs-gray-200)',
                                    backgroundColor: formData.subjects.includes(subject) ? `rgba(var(--bs-${SUBJECT_COLORS[subject]}-rgb), 0.02)` : 'white',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    minWidth: '180px',
                                  }}
                                >
                                  <div className="card-body py-3 px-3 d-flex align-items-center">
                                    <div
                                      className="form-check-input me-2 rounded-3 border-2 flex-shrink-0 d-flex align-items-center justify-content-center"
                                      style={{
                                        width: 20,
                                        height: 20,
                                        borderColor: formData.subjects.includes(subject) ? `var(--bs-${SUBJECT_COLORS[subject]})` : 'var(--bs-gray-400)',
                                        backgroundColor: formData.subjects.includes(subject) ? `var(--bs-${SUBJECT_COLORS[subject]})` : 'white',
                                        marginTop: 0,
                                      }}
                                    >
                                      {formData.subjects.includes(subject) && <i className="bi bi-check2" style={{ color: 'white', fontSize: '1.1rem' }} />}
                                    </div>
                                    <i className={`bi bi-${SUBJECT_ICONS[subject]} me-2`} style={{ color: `var(--bs-${SUBJECT_COLORS[subject]})` }} />
                                    <span className="fw-medium">{SUBJECT_NAMES[subject]}</span>
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

                {currentStep === 4 && (
                  <div className="step-content">
                    <div className="text-center mb-4">
                      <h2 className="card-title fw-bold">Площадка по каждому предмету</h2>
                      <p className="text-muted">Шаг 4 из 4</p>
                    </div>
                    <div className="alert alert-info mb-4">
                      <i className="bi bi-geo-alt me-2"></i>
                      Выберите площадку для каждого выбранного предмета.
                    </div>
                    <div className="row g-4">
                      {formData.subjects.map((subject) => (
                        <div key={subject} className="col-12">
                          <label htmlFor={`venue_${subject}`} className="form-label fw-medium">
                            <i className={`bi bi-${SUBJECT_ICONS[subject]} me-1 text-${SUBJECT_COLORS[subject]}`}></i>
                            {SUBJECT_NAMES[subject]} — площадка <span className="text-danger">*</span>
                          </label>
                          <select
                            className="form-select form-select-lg rounded-3"
                            id={`venue_${subject}`}
                            name={`venue_${subject}`}
                            value={formData.subjectVenues[subject] || ''}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Выберите площадку</option>
                            {getVenuesForSubject(subject).map((addr) => (
                              <option key={addr} value={addr}>{addr}</option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-5 d-flex justify-content-between">
              {currentStep > 1 && (
                <motion.button type="button" className="btn btn-outline-primary btn-lg px-5 rounded-pill" onClick={() => handleStepChange('prev')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <i className="bi bi-arrow-left me-2"></i>
                  Назад
                </motion.button>
              )}
              <div className="ms-auto">
                {currentStep < 4 ? (
                  <motion.button type="button" className="btn btn-primary btn-lg px-5 rounded-pill" onClick={() => handleStepChange('next')} disabled={!isStepValid(currentStep)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    Далее <i className="bi bi-arrow-right ms-2"></i>
                  </motion.button>
                ) : (
                  <motion.button type="submit" className="btn btn-primary btn-lg px-5 rounded-pill" disabled={isSubmitting || !isStepValid(currentStep)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    {isSubmitting ? <><span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Отправка...</> : <><i className="bi bi-send-fill me-2"></i>Завершить регистрацию</>}
                  </motion.button>
                )}
              </div>
            </div>
          </form>
        )}
      </div>
    </motion.div>
  );
}
