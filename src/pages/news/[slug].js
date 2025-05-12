import Layout from '../../components/Layout';
import PageHeader from '../../components/PageHeader';
import Link from 'next/link';
import { newsData } from '../../data/newsData';
import { useRouter } from 'next/router';

export default function NewsArticle() {
  const router = useRouter();
  const { slug } = router.query;
  
  // Find the news article based on the URL
  const newsItem = newsData.find(item => {
    const itemSlug = item.link.split('/').pop();
    return itemSlug === slug;
  });

  // If article not found, show error message
  if (!newsItem) {
    return (
      <Layout title="Новость не найдена">
        <PageHeader 
          title="Новость не найдена" 
          subtitle="Запрашиваемая новость не существует или была удалена"
        />
        <div className="container py-5">
          <div className="text-center">
            <p className="lead mb-4">К сожалению, запрашиваемая новость не найдена.</p>
            <Link href="/news" legacyBehavior>
              <a className="btn btn-primary">Вернуться к списку новостей</a>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // Format the date
  const formattedDate = new Date(newsItem.date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <Layout title={newsItem.title}>
      <PageHeader 
        title={newsItem.title}
        subtitle={formattedDate}
      />
      
      <div className="container py-5">
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <article>
              <div className="mb-4">
                <p className="lead">{newsItem.summary}</p>
              </div>
              
              <div className="content mb-5" dangerouslySetInnerHTML={{ __html: newsItem.content }} />
              
              <div className="mt-5 pt-4 border-top">
                <div className="d-flex justify-content-between align-items-center">
                  <Link href="/news" legacyBehavior>
                    <a className="btn btn-outline-primary">
                      <i className="bi bi-arrow-left me-2"></i>
                      Все новости
                    </a>
                  </Link>
                  
                  <div className="share-buttons">
                    <button 
                      className="btn btn-outline-primary me-2"
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: newsItem.title,
                            text: newsItem.summary,
                            url: window.location.href
                          });
                        }
                      }}
                    >
                      <i className="bi bi-share me-2"></i>
                      Поделиться
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Generate static paths for all news articles
export async function getStaticPaths() {
  const paths = newsData.map(item => ({
    params: { slug: item.link.split('/').pop() }
  }));

  return {
    paths,
    fallback: false
  };
}

// Get static props for each news article
export async function getStaticProps({ params }) {
  return {
    props: {}
  };
} 