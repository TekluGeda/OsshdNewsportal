import React from 'react';
import { Link } from 'react-router-dom';
import type { News } from '../types';
import { formatDate } from '../utils/date';

interface NewsCardProps {
  article: News;
  authorName?: string;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article, authorName = 'Staff Writer' }) => {
  return (
    <article className="news-card animate-fade-in">
      <div className="card-image-wrapper">
        <span className={`badge card-category-tag badge-${article.category.toLowerCase()}`}>
          {article.category}
        </span>
        {article.image1 ? (
          <img src={article.image1} alt={article.title} loading="lazy" />
        ) : (
          <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--border)' }} />
        )}
      </div>

      <div className="card-content">
        <div className="card-meta">
          <span>{formatDate(article.publishDate)}</span>
        </div>

        <Link to={`/news/${article.id}`}>
          <h3 className="card-title" title={article.title}>{article.title}</h3>
        </Link>

        <p className="card-summary">{article.summary}</p>

        <div className="card-footer">
          <div className="card-author">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            {authorName}
          </div>

          <Link to={`/news/${article.id}`} className="card-readmore">
            Read More
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
};
