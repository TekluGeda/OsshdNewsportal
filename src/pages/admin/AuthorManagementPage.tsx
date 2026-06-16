import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { AdminLayout } from './AdminLayout';
import { SEO } from '../../components/SEO';
import type { Author } from '../../types';

export const AuthorManagementPage: React.FC = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadAuthors = async () => {
    setLoading(true);
    try {
      const data = await api.getAuthors();
      setAuthors(data);
    } catch (err) {
      console.error('Error fetching authors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuthors();
  }, []);

  const handleAddAuthor = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotification(null);

    // Prevent duplicate emails
    if (authors.some(a => a.email.toLowerCase() === email.trim().toLowerCase())) {
      setNotification({ type: 'error', message: `Author email "${email}" is already registered.` });
      setSaving(false);
      return;
    }

    try {
      await api.createAuthor({
        fullName: fullName.trim(),
        email: email.trim()
      });
      setNotification({ type: 'success', message: 'Author registered successfully.' });
      setFullName('');
      setEmail('');
      loadAuthors();
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to add author.' });
    } finally {
      setSaving(false);
    }

    setTimeout(() => setNotification(null), 3000);
  };

  const handleDelete = async (id: string, name: string) => {
    // Basic safety verification: ensure at least one author exists or warn if articles exist
    const articles = await api.getArticles({ status: 'all' });
    const count = articles.filter(a => a.author === id).length;

    let confirmMsg = `Are you sure you want to remove author "${name}"?`;
    if (count > 0) {
      confirmMsg = `WARNING: Author "${name}" has published ${count} news articles. Removing them will clear their ownership signature. Proceed?`;
    }

    if (window.confirm(confirmMsg)) {
      try {
        const success = await api.deleteAuthor(id);
        if (success) {
          setNotification({ type: 'success', message: 'Author deleted successfully.' });
          loadAuthors();
        } else {
          setNotification({ type: 'error', message: 'Failed to delete author.' });
        }
      } catch (err) {
        setNotification({ type: 'error', message: 'Error deleting author.' });
      }

      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <AdminLayout>
      <SEO title="Manage Authors" description="Manage news portal authors and team members." />

      <div className="admin-page-title animate-fade-in">
        <div>
          <h2>Author Workspace</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Register new content writers and view current credentials
          </p>
        </div>
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

      <div className="split-crud-container animate-fade-in" style={{ animationDelay: '0.1s' }}>
        
        {/* Left Form */}
        <div className="form-card" style={{ height: 'fit-content' }}>
          <h3 style={{ fontSize: '18px', borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '20px' }}>
            New Writer
          </h3>
          <form onSubmit={handleAddAuthor} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="fullName">Full Name *</label>
              <input
                type="text"
                id="fullName"
                className="form-control"
                style={{ backgroundColor: 'var(--bg-app)' }}
                placeholder="e.g., Alice Vance"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                className="form-control"
                style={{ backgroundColor: 'var(--bg-app)' }}
                placeholder="e.g., avance@organization.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-accent"
              style={{ width: '100%', marginTop: '8px' }}
              disabled={saving}
            >
              {saving ? 'Adding...' : 'Register Writer'}
            </button>
          </form>
        </div>

        {/* Right List */}
        <div className="form-card">
          <h3 style={{ fontSize: '18px', borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '20px' }}>
            Registered Authors
          </h3>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)' }}>
              Reloading authors...
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Writer Name</th>
                    <th>Email</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {authors.map((auth) => (
                    <tr key={auth.id}>
                      <td style={{ fontWeight: '700' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div className="detail-author-avatar" style={{ width: '26px', height: '26px', fontSize: '11px' }}>
                            {auth.fullName.charAt(0)}
                          </div>
                          {auth.fullName}
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{auth.email}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => handleDelete(auth.id, auth.fullName)}
                          className="btn btn-danger btn-sm"
                          style={{ padding: '4px 10px', fontSize: '11px' }}
                          disabled={authors.length <= 1} // Keep at least one author in the registry
                          title={authors.length <= 1 ? "Cannot delete the last remaining author." : ""}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
};
