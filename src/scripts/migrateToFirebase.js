import { createDocumentWithId } from '../lib/dataService';
import { contactsData } from '../data/contactsData';
import { historyData } from '../data/historyData';
import { documentsData } from '../data/documentsData';
import { subjectsData } from '../data/subjectsData';
import { regionsData } from '../data/regionsData';
import { newsData } from '../data/newsData';

// Функция для проверки данных перед миграцией
const validateData = (data, name) => {
  if (!data) {
    throw new Error(`Данные ${name} отсутствуют`);
  }
  if (Array.isArray(data) && data.length === 0) {
    console.warn(`Предупреждение: ${name} является пустым массивом`);
  }
  return true;
};

export const migrateAllData = async () => {
  const results = {
    success: [],
    errors: []
  };

  try {
    console.log('Starting data migration...');

    // Проверяем наличие всех необходимых данных
    validateData(contactsData, 'contacts');
    validateData(historyData, 'history');
    validateData(documentsData, 'documents');
    validateData(subjectsData, 'subjects');
    validateData(regionsData, 'regions');
    validateData(newsData, 'news');

    // Мигрируем статические данные
    try {
      await createDocumentWithId('content', 'contacts', contactsData);
      console.log('✓ Contacts data migrated');
      results.success.push('contacts');
    } catch (error) {
      console.error('Error migrating contacts:', error);
      results.errors.push({ type: 'contacts', error: error.message });
    }

    try {
      await createDocumentWithId('content', 'history', historyData);
      console.log('✓ History data migrated');
      results.success.push('history');
    } catch (error) {
      console.error('Error migrating history:', error);
      results.errors.push({ type: 'history', error: error.message });
    }

    try {
      await createDocumentWithId('content', 'documents', documentsData);
      console.log('✓ Documents data migrated');
      results.success.push('documents');
    } catch (error) {
      console.error('Error migrating documents:', error);
      results.errors.push({ type: 'documents', error: error.message });
    }

    try {
      await createDocumentWithId('content', 'subjects', subjectsData);
      console.log('✓ Subjects data migrated');
      results.success.push('subjects');
    } catch (error) {
      console.error('Error migrating subjects:', error);
      results.errors.push({ type: 'subjects', error: error.message });
    }

    try {
      await createDocumentWithId('content', 'regions', regionsData);
      console.log('✓ Regions data migrated');
      results.success.push('regions');
    } catch (error) {
      console.error('Error migrating regions:', error);
      results.errors.push({ type: 'regions', error: error.message });
    }

    // Мигрируем новости как отдельные документы
    let newsSuccess = 0;
    let newsErrors = 0;

    for (const news of newsData) {
      try {
        await createDocumentWithId('news', news.id.toString(), {
          ...news,
          date: new Date(news.date).toISOString()
        });
        newsSuccess++;
      } catch (error) {
        console.error(`Error migrating news item ${news.id}:`, error);
        newsErrors++;
        results.errors.push({ type: 'news', id: news.id, error: error.message });
      }
    }

    console.log(`✓ News data migrated (Success: ${newsSuccess}, Errors: ${newsErrors})`);
    if (newsSuccess > 0) {
      results.success.push('news');
    }

    // Итоговый отчет
    console.log('\nMigration completed!');
    console.log(`Successful migrations: ${results.success.length}`);
    console.log(`Failed migrations: ${results.errors.length}`);

    return results;
  } catch (error) {
    console.error('Critical error during migration:', error);
    throw error;
  }
}; 