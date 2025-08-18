import { useState } from 'react';
import { faqData } from '../data/faqData';

export default function FAQSection() {
  // Состояние для отслеживания открытых FAQ элементов
  const [openItems, setOpenItems] = useState(new Set());

  // Функция для переключения состояния FAQ элемента
  const toggleItem = (id) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <section id="faq" className="py-5 faq-section">
      <div className="container">
        {/* Заголовок секции */}
        <div className="row mb-5">
          <div className="col-12">
            <h2 className="section-heading side-bordered-header mb-3">
              Часто задаваемые вопросы
            </h2>
            <p className="lead text-muted mb-0">
              Ответы на самые популярные вопросы об Арктической олимпиаде «Полярный круг»
            </p>
          </div>
        </div>

        {/* FAQ Аккордеон */}
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-8">
            <div className="faq-accordion">
              {faqData.map((faq, index) => (
                <div key={faq.id} className="faq-item mb-3">
                  <div 
                    className={`faq-question ${openItems.has(faq.id) ? 'active' : ''}`}
                    onClick={() => toggleItem(faq.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleItem(faq.id);
                      }
                    }}
                  >
                    <div className="d-flex align-items-center">
                      <div className="faq-icon me-3">
                        <i className={faq.icon}></i>
                      </div>
                      <div className="faq-question-text flex-grow-1">
                        {faq.question}
                      </div>
                      <div className="faq-toggle-icon">
                        <i className={`bi ${openItems.has(faq.id) ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`faq-answer ${openItems.has(faq.id) ? 'show' : ''}`}>
                    <div className="faq-answer-content">
                      <div 
                        className="faq-answer-text"
                        dangerouslySetInnerHTML={{
                          __html: faq.answer
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\n/g, '<br>')
                            .replace(/• /g, '• ')
                            .replace(/✅ /g, '<span class="text-success">✅ </span>')
                            .replace(/❌ /g, '<span class="text-danger">❌ </span>')
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
