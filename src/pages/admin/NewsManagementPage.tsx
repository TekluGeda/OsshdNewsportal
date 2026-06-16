import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { AdminLayout } from './AdminLayout';
import { SEO } from '../../components/SEO';
import type { News, Category } from '../../types';
import { formatDate } from '../../utils/date';

export const NewsManagementPage: React.FC = () => {
  const [articles, setArticles] = useState<News[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState<'all' | 'draft' | 'published'>('all');

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const data = await api.getArticles({
        search,
        category,
        status,
        sort: 'newest'
      });
      setArticles(data);
    } catch (err) {
      console.error('Error fetching admin articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load categories for filter
    const loadCategories = async () => {
      const cats = await api.getCategories();
      setCategories(cats);
    };
    loadCategories();
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [search, category, status]);

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        const success = await api.deleteArticle(id);
        if (success) {
          setNotification({ type: 'success', message: 'Article deleted successfully.' });
          fetchArticles();
        } else {
          setNotification({ type: 'error', message: 'Failed to delete article.' });
        }
      } catch (err) {
        setNotification({ type: 'error', message: 'Error deleting article.' });
      }

      // Clear notifications after 3 seconds
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <AdminLayout>
      <SEO title="Manage News" description="Administrative list of all draft and published news articles." />

      <div className="admin-page-title animate-fade-in">
        <div>
          <h2>Articles Management</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Publish, edit, and audit news stories
          </p>
        </div>
        <Link to="/admin/news/new" className="btn btn-accent btn-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          Write Article
        </Link>
      </div>

      {notification && (
        <div
          className={`animate-fade-in ${notification.type === 'success' ? 'status-indicator' : 'alert-error'}`}
          style={{
            padding: '12px 16px',
            backgroundColor: notification.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: notification.type === 'success' ? 'var(--success)' : 'var(--danger)',
            borderRadius: 'var(--radius-sm)',
            border: `1px solid ${notification.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
            marginBottom: '24px',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          {notification.message}
        </div>
      )}

      {/* Admin Filter bar */}
      <div className="filter-section animate-fade-in" style={{ padding: '16px 0', marginBottom: '24px' }}>
        <div className="filter-container">
          <div className="search-input-wrapper" style={{ flex: '1 1 300px' }}>
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              className="search-input"
              style={{ padding: '10px 16px 10px 36px' }}
              placeholder="Search by title, body keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filters-group">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="filter-select"
              style={{ padding: '10px 32px 10px 12px', minWidth: '150px' }}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="filter-select"
              style={{ padding: '10px 32px 10px 12px', minWidth: '150px' }}
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table list */}
      <div className="form-card animate-fade-in" style={{ padding: '24px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
            Refreshing article feed...
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Published Date</th>
                  <th>Views</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.length > 0 ? (
                  articles.map(art => (
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
                      <td style={{ textAlign: 'right' }}>
                        <div className="admin-table-actions" style={{ justifyContent: 'flex-end' }}>
                          <Link to={`/admin/news/edit/${art.id}`} className="btn btn-outline btn-sm" style={{ padding: '6px 10px' }}>
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(art.id, art.title)}
                            className="btn btn-danger btn-sm"
                            style={{ padding: '6px 10px' }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px' }}>
                      No matching articles found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
