import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { News, Author } from '../types';
import { api } from '../services/api';
import { Layout } from '../components/Layout';
import { SEO } from '../components/SEO';
import { NewsGallery } from '../components/NewsGallery';
import { SocialShare } from '../components/SocialShare';
import { NewsCard } from '../components/NewsCard';
import { formatDate } from '../utils/date';

export const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const [article, setArticle] = useState<News | null>(null);
  const [author, setAuthor] = useState<Author | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<News[]>([]);
  const [authorsMap, setAuthorsMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch all authors map for related cards
  useEffect(() => {
    const loadAuthors = async () => {
      try {
        const authors = await api.getAuthors();
        const mapping: Record<string, string> = {};
        authors.forEach(auth => {
          mapping[auth.id] = auth.fullName;
        });
        setAuthorsMap(mapping);
      } catch (err) {
        console.error('Error fetching authors map:', err);
      }
    };
    loadAuthors();
  }, []);

  // Fetch active article and related content
  useEffect(() => {
    const loadArticleData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await api.getArticleById(id);
        if (data) {
          setArticle(data);

          // Get Author details
          const authors = await api.getAuthors();
          const foundAuthor = authors.find(auth => auth.id === data.author);
          setAuthor(foundAuthor || null);

          // Get Related news (same category, exclude current)
          const allInCategory = await api.getArticles({
            category: data.category,
            status: 'published'
          });
          const filtered = allInCategory
            .filter(art => art.id !== data.id)
            .slice(0, 3);
          setRelatedArticles(filtered);
        } else {
          // Redirect home or show error
          setArticle(null);
        }
      } catch (err) {
        console.error('Error fetching detailed article:', err);
      } finally {
        setLoading(false);
      }
    };

    loadArticleData();
    // Scroll to top on transition
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading article details...
        </div>
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout>
        <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '16px' }}>Article Not Found</h2>
          <p style={{ marginBottom: '24px', color: 'var(--text-muted)' }}>The article you are looking for does not exist or has been deleted.</p>
          <Link to="/" className="btn btn-primary">
            Back to Homepage
          </Link>
        </div>
      </Layout>
    );
  }

  const authorName = author ? author.fullName : 'Staff Writer';
  const pageUrl = window.location.href;

  return (
    <Layout>
      {/* Dynamic SEO update including Structured Data for NewsArticle schema */}
      <SEO
        title={article.title}
        description={article.summary}
        image={article.image1}
        type="article"
        articleData={{
          headline: article.title,
          description: article.summary,
          images: [article.image1, article.image2, article.image3].filter(img => !!img),
          datePublished: article.publishDate,
          dateModified: article.updatedDate || article.createdDate,
          authorName: authorName,
          publisherName: 'Chronicle Organization'
        }}
      />

      <div className="detail-container animate-fade-in">
        <article className="container">
          
          {/* Header */}
          <div className="detail-header">
            <Link to="/" className="detail-back">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5" />
                <path d="m12 19-7-7 7-7" />
              </svg>
              Back to News Feed
            </Link>

            <h1 className="detail-title">{article.title}</h1>

            <div className="detail-meta-wrapper">
              <div className="detail-meta-left">
                <div className="detail-meta-item">
                  <div className="detail-author-avatar">
                    {authorName.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{authorName}</div>
                    <div style={{ fontSize: '12px' }}>Author</div>
                  </div>
                </div>
                <div className="detail-meta-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                  </svg>
                  <span>Published {formatDate(article.publishDate)}</span>
                </div>
                <div className="detail-meta-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <span>{article.views || 0} Views</span>
                </div>
              </div>

              <div>
                <span className={`badge badge-${article.category.toLowerCase()}`}>
                  {article.category}
                </span>
              </div>
            </div>
          </div>

          {/* Three-Image Gallery Slider */}
          <NewsGallery
            image1={article.image1}
            image2={article.image2}
            image3={article.image3}
            title={article.title}
          />

          {/* Article content & Social Share */}
          <div className="detail-body">
            <div className="detail-content">
              {article.content}
            </div>

            {/* Social Sharing Toolbar */}
            <SocialShare title={article.title} url={pageUrl} />
          </div>

        </article>
      </div>

      {/* Related News Section */}
      {relatedArticles.length > 0 && (
        <section className="related-news-section">
          <div className="container">
            <h3 className="related-title">Related Stories</h3>
            <div className="related-grid">
              {relatedArticles.map(art => (
                <NewsCard
                  key={art.id}
                  article={art}
                  authorName={authorsMap[art.author]}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};
