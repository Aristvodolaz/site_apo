import Layout from '../components/Layout';
import OrganizersAndPartners from '../components/OrganizersAndPartners';

export default function TestOrganizers() {
  return (
    <Layout title="Тест организаторов">
      <div className="container py-5">
        <h1 className="text-center mb-5">Тестирование компонента организаторов</h1>
        <OrganizersAndPartners />
      </div>
    </Layout>
  );
} 