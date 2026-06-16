import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { AdminLayout } from './AdminLayout';
import { SEO } from '../../components/SEO';
import type { News } from '../../types';
import { formatDate } from '../../utils/date';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<{
    totalArticles: number;
    publishedArticles: number;
    draftArticles: number;
    featuredArticles: number;
    totalViews: number;
    categoriesCount: number;
    authorsCount: number;
    categoryDistribution: { name: string; count: number }[];
  } | null>(null);

  const [recentArticles, setRecentArticles] = useState<News[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const statsData = await api.getStats();
        setStats(statsData);

        const articles = await api.getArticles({ status: 'all' });
        // Take the 5 most recently created/updated articles
        setRecentArticles(articles.slice(0, 5));
      } catch (err) {
        console.error('Error loading dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  if (loading || !stats) {
    return (
      <AdminLayout>
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
          Loading dashboard statistics...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <SEO title="Admin Dashboard" description="Chronicle News Portal administration metrics and quick shortcuts." />
      
      <div className="admin-page-title animate-fade-in">
        <div>
          <h2>Executive Dashboard</h2>
          <p style={{ fontSize: '14px', fontWeight: 'normal', color: 'var(--text-muted)', marginTop: '4px' }}>
            System overview and publication stats
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/admin/news/new" className="btn btn-accent btn-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            Write Article
          </Link>
        </div>
      </div>

      {/* Grid of stats */}
      <div className="stats-grid animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="stats-card">
          <div className="stats-info">
            <span className="stats-label">Total Articles</span>
            <span className="stats-value">{stats.totalArticles}</span>
          </div>
          <div className="stats-icon-box">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
            </svg>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-info">
            <span className="stats-label">Published</span>
            <span className="stats-value" style={{ color: 'var(--success)' }}>{stats.publishedArticles}</span>
          </div>
          <div className="stats-icon-box" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-info">
            <span className="stats-label">Drafts</span>
            <span className="stats-value" style={{ color: 'var(--text-muted)' }}>{stats.draftArticles}</span>
          </div>
          <div className="stats-icon-box" style={{ backgroundColor: 'rgba(148, 163, 184, 0.1)', color: 'var(--text-muted)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-info">
            <span className="stats-label">Total Views</span>
            <span className="stats-value" style={{ color: 'var(--accent)' }}>{stats.totalViews}</span>
          </div>
          <div className="stats-icon-box" style={{ backgroundColor: 'var(--accent-glow)', color: 'var(--accent)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Grid of Sections */}
      <div className="dashboard-sections-grid animate-fade-in" style={{ animationDelay: '0.2s' }}>
        
        {/* Left: Recent articles */}
        <div className="dashboard-card">
          <div className="dashboard-card-title">
            <span>Recent Articles</span>
            <Link to="/admin/news" style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: '600' }}>
              View All &rarr;
            </Link>
          </div>

          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Publish Date</th>
                  <th>Views</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentArticles.length > 0 ? (
                  recentArticles.map(art => (
                    <tr key={art.id}>
                      <td style={{ fontWeight: '600' }}>
                        <Link to={`/news/${art.id}`} style={{ color: 'var(--text-main)' }}>
                          {art.title}
                        </Link>
                        {art.featured && (
                          <span className="badge" style={{ backgroundColor: 'var(--accent-glow)', color: 'var(--accent)', textTransform: 'uppercase', fontSize: '9px', padding: '2px 6px', marginLeft: '8px' }}>
                            Featured
                          </span>
                        )}
                      </td>
                      <td>
                        <span className={`badge badge-${art.category.toLowerCase()}`}>
                          {art.category}
                        </span>
                      </td>
                      <td>{formatDate(art.publishDate)}</td>
                      <td>{art.views || 0}</td>
                      <td>
                        <div className="status-indicator">
                          <span className={`status-dot ${art.status}`} />
                          <span style={{ textTransform: 'capitalize' }}>{art.status}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                      No articles in database. Click "Write Article" to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Category Distribution */}
        <div className="dashboard-card">
          <div className="dashboard-card-title">
            <span>Category Density</span>
          </div>

          <div>
            {stats.categoryDistribution.map((dist, idx) => {
              // Calculate percent
              const percent = stats.totalArticles > 0 ? (dist.count / stats.totalArticles) * 100 : 0;
              return (
                <div key={idx} className="dist-item">
                  <div className="dist-meta">
                    <span style={{ fontWeight: '600' }}>{dist.name}</span>
                    <span style={{ color: 'var(--text-muted)' }}>
                      {dist.count} {dist.count === 1 ? 'article' : 'articles'} ({Math.round(percent)}%)
                    </span>
                  </div>
                  <div className="dist-bar-bg">
                    <div
                      className="dist-bar-fill"
                      style={{
                        width: `${percent}%`,
                        background: `linear-gradient(90deg, var(--primary-light) 0%, var(--accent) 100%)`
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};
