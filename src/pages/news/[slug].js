import Layout from '../../components/Layout';
import PageHeader from '../../components/PageHeader';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { getDocument, getNews } from '../../lib/dataService';

export default function NewsArticle() {
  const router = useRouter();
  const { slug } = router.query;
  
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewsItem = async () => {
      if (!slug) return;

      try {
        const news = await getDocument('news', slug);
        if (news) {
          setNewsItem(news);
        } else {
          setError('Новость не найдена');
        }
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Ошибка при загрузке новости');
      } finally {
        setLoading(false);
      }
    };

    fetchNewsItem();
  }, [slug]);

  // Handle fallback state
  if (router.isFallback) {
    return (
      <Layout title="Загрузка...">
        <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Загрузка...</span>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout title="Загрузка...">
        <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Загрузка...</span>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !newsItem) {
    return (
      <Layout title="Новость не найдена">
        <PageHeader 
          title="Новость не найдена" 
          subtitle="Запрашиваемая новость не существует или была удалена"
        />
        <div className="container py-5">
          <div className="text-center">
            <p className="lead mb-4">К сожалению, запрашиваемая новость не найдена.</p>
            <Link href="/news" className="btn btn-primary">
              Вернуться к списку новостей
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
                  <Link href="/news" className="btn btn-outline-primary">
                      <i className="bi bi-arrow-left me-2"></i>
                      Все новости
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
  try {
    // Fetch all news items from Firebase
    const news = await getNews();
    
    // Generate paths from news IDs, ensuring slug is a string
    const paths = news.map(item => ({
      params: { slug: String(item.id) }
  }));

  return {
    paths,
      fallback: true // Enable fallback for new content
    };
  } catch (error) {
    console.error('Error generating static paths:', error);
    return {
      paths: [],
      fallback: true // Enable fallback even if initial fetch fails
  };
  }
}

// Get static props for each news article
export async function getStaticProps({ params }) {
  try {
    // Ensure slug is a string and fetch the specific news item
    const slug = String(params.slug);
    const newsItem = await getDocument('news', slug);
    
    if (!newsItem) {
      return {
        notFound: true // This will show 404 page
      };
    }

    // Convert Firestore Timestamp to ISO string for serialization
    const serializedNewsItem = {
      ...newsItem,
      updated_at: newsItem.updated_at ? newsItem.updated_at.toDate().toISOString() : null,
      created_at: newsItem.created_at ? newsItem.created_at.toDate().toISOString() : null,
      date: newsItem.date ? new Date(newsItem.date).toISOString() : null
    };

    return {
      props: {
        newsItem: serializedNewsItem
      },
      revalidate: 60 // Revalidate every 60 seconds
    };
  } catch (error) {
    console.error('Error fetching news item:', error);
  return {
      notFound: true
  };
  }
} 