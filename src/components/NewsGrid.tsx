import React from 'react';
import type { News } from '../types';
import { NewsCard } from './NewsCard';

interface NewsGridProps {
  articles: News[];
  authorsMap: Record<string, string>;
}

export const NewsGrid: React.FC<NewsGridProps> = ({ articles, authorsMap }) => {
  if (articles.length === 0) {
    return (
      <div className="empty-state">
        <h3 className="empty-state-title">No articles found</h3>
        <p>Try modifying your search query or clear the active filters.</p>
      </div>
    );
  }

  return (
    <div className="news-grid" id="grid">
      {articles.map((article) => (
        <NewsCard
          key={article.id}
          article={article}
          authorName={authorsMap[article.author]}
        />
      ))}
    </div>
  );
};
