import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import RegistrationForm from '../components/RegistrationForm';

export default function Register() {
  return (
    <Layout title="Регистрация">
      <PageHeader 
        title="Регистрация на олимпиаду" 
        subtitle="Заполните форму для участия в Арктической олимпиаде «Полярный круг»"
      />
      
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-4 mb-4 mb-lg-0">
            <div className="card shadow-sm border-0 rounded-4 h-100">
              <div className="card-body p-4">
                <h4 className="card-title mb-4">
                  <i className="bi bi-info-circle-fill text-primary me-2"></i>
                  Важная информация
                </h4>
                <div className="d-flex flex-column gap-4">
                  <div>
                    <h5 className="h6 mb-2">Сроки регистрации</h5>
                    <p className="mb-0">
                      Регистрация открыта до 18 января 2026 года. 
                      Отборочный этап пройдет с 19 по 23 января 2026 года.
                    </p>
                  </div>
                  <div>
                    <h5 className="h6 mb-2">Подтверждение участия</h5>
                    <p className="mb-0">
                      После заполнения формы на указанный email будет отправлено письмо 
                      с подтверждением регистрации и дальнейшими инструкциями.
                    </p>
                  </div>
                  <div className="alert alert-primary mb-0" role="alert">
                    <i className="bi bi-envelope-check me-2"></i>
                    Проверьте папку «Спам», если письмо не пришло в течение нескольких минут.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-8">
            <RegistrationForm />
          </div>
        </div>
      </div>
    </Layout>
  );
} 