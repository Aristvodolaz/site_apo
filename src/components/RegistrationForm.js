import { useState } from 'react';
import { regionsData } from '../data/regionsData';
import InputMask from 'react-input-mask';

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    school: '',
    region: '',
    city: '',
    grade: '',
    subjects: [],
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'region') {
      setFormData({
        ...formData,
        [name]: value,
        city: '' // Reset city when region changes
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // This would be replaced with an actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Form submitted:', formData);
      setSubmitSuccess(true);
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        school: '',
        region: '',
        city: '',
        grade: '',
        subjects: [],
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('Произошла ошибка при отправке формы. Пожалуйста, попробуйте снова.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const grades = ['4', '5', '6', '7', '8', '9', '10', '11'];

  return (
    <div className="card shadow border-0 rounded-4">
      <div className="card-body p-4 p-md-5">
        {submitSuccess ? (
          <div className="text-center py-5">
            <div className="display-1 text-success mb-4">
              <i className="bi bi-check-circle"></i>
            </div>
            <h3 className="mb-4">Регистрация успешно завершена!</h3>
            <p className="mb-4">
              Благодарим за регистрацию на Арктическую олимпиаду «Полярный круг» 2025. 
              Дополнительная информация была отправлена на указанный вами email.
            </p>
            <button 
              className="btn btn-primary btn-lg px-5"
              onClick={() => setSubmitSuccess(false)}
            >
              Зарегистрировать еще участника
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="needs-validation" noValidate>
            <h3 className="card-title text-center mb-4">Регистрация участника</h3>
            
            {submitError && (
              <div className="alert alert-danger" role="alert">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {submitError}
              </div>
            )}
            
            <div className="row g-4">
              <div className="col-md-6">
                <label htmlFor="lastName" className="form-label">Фамилия *</label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="firstName" className="form-label">Имя *</label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="col-md-6">
                <label htmlFor="email" className="form-label">Электронная почта *</label>
                <input
                  type="email"
                  className="form-control form-control-lg"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <div className="form-text">
                  На этот адрес будут отправлены дальнейшие инструкции
                </div>
              </div>
              <div className="col-md-6">
                <label htmlFor="phone" className="form-label">Телефон</label>
                <InputMask
                  mask="+7 (999) 999-99-99"
                  maskChar="_"
                  className="form-control form-control-lg"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+7 (___) ___-__-__"
                >
                  {(inputProps) => <input {...inputProps} type="tel" />}
                </InputMask>
                <div className="form-text">
                  Формат: +7 (999) 999-99-99
                </div>
              </div>
              
              <div className="col-12">
                <label htmlFor="school" className="form-label">Учебное заведение *</label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  id="school"
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="col-md-6">
                <label htmlFor="region" className="form-label">Регион *</label>
                <select
                  className="form-select form-select-lg"
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
              
              <div className="col-md-6">
                <label htmlFor="city" className="form-label">Город *</label>
                <select
                  className="form-select form-select-lg"
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
              
              <div className="col-md-6">
                <label htmlFor="grade" className="form-label">Класс *</label>
                <select
                  className="form-select form-select-lg"
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
            
            <div className="mt-4">
              <label className="form-label">Предметы *</label>
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-3">
                <div className="col">
                  <div className="form-check card h-100">
                    <div className="card-body">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="math"
                        name="subjects"
                        value="math"
                        checked={formData.subjects.includes('math')}
                        onChange={handleCheckboxChange}
                      />
                      <label className="form-check-label w-100" htmlFor="math">
                        <i className="bi bi-calculator me-2"></i>
                        Математика
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="form-check card h-100">
                    <div className="card-body">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="biology"
                        name="subjects"
                        value="biology"
                        checked={formData.subjects.includes('biology')}
                        onChange={handleCheckboxChange}
                      />
                      <label className="form-check-label w-100" htmlFor="biology">
                        <i className="bi bi-tree me-2"></i>
                        Биология
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="form-check card h-100">
                    <div className="card-body">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="physics"
                        name="subjects"
                        value="physics"
                        checked={formData.subjects.includes('physics')}
                        onChange={handleCheckboxChange}
                      />
                      <label className="form-check-label w-100" htmlFor="physics">
                        <i className="bi bi-lightning me-2"></i>
                        Физика
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="form-check card h-100">
                    <div className="card-body">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="chemistry"
                        name="subjects"
                        value="chemistry"
                        checked={formData.subjects.includes('chemistry')}
                        onChange={handleCheckboxChange}
                      />
                      <label className="form-check-label w-100" htmlFor="chemistry">
                        <i className="bi bi-droplet me-2"></i>
                        Химия
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-5 d-grid gap-2">
              <button 
                type="submit" 
                className="btn btn-primary btn-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Отправка...
                  </>
                ) : 'Отправить заявку'}
              </button>
            </div>
            
            <div className="mt-3 text-center">
              <p className="text-muted small mb-0">
                По всем вопросам обращайтесь на почту{' '}
                <a href="mailto:regions@apo-team.ru">regions@apo-team.ru</a>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 