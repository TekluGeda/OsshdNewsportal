import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { AdminLayout } from './AdminLayout';
import { SEO } from '../../components/SEO';
import type { Category } from '../../types';

export const CategoryManagementPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotification(null);

    // Prevent duplicate category names
    if (categories.some(c => c.name.toLowerCase() === name.trim().toLowerCase())) {
      setNotification({ type: 'error', message: `Category "${name}" already exists.` });
      setSaving(false);
      return;
    }

    try {
      await api.createCategory({
        name: name.trim(),
        description: description.trim()
      });
      setNotification({ type: 'success', message: 'Category added successfully.' });
      setName('');
      setDescription('');
      loadCategories();
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to add category.' });
    } finally {
      setSaving(false);
    }

    setTimeout(() => setNotification(null), 3000);
  };

  const handleDelete = async (id: string, catName: string) => {
    // Basic dependency check warning: if news are linked to this category
    const articles = await api.getArticles({ status: 'all' });
    const count = articles.filter(a => a.category.toLowerCase() === catName.toLowerCase()).length;
    
    let confirmMsg = `Are you sure you want to delete category "${catName}"?`;
    if (count > 0) {
      confirmMsg = `WARNING: There are ${count} news articles linked to "${catName}". Deleting this category will leave them without an active tag grouping. Proceed?`;
    }

    if (window.confirm(confirmMsg)) {
      try {
        const success = await api.deleteCategory(id);
        if (success) {
          setNotification({ type: 'success', message: 'Category deleted successfully.' });
          loadCategories();
        } else {
          setNotification({ type: 'error', message: 'Failed to delete category.' });
        }
      } catch (err) {
        setNotification({ type: 'error', message: 'Error deleting category.' });
      }

      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <AdminLayout>
      <SEO title="Manage Categories" description="Configure organizational news category tags." />

      <div className="admin-page-title animate-fade-in">
        <div>
          <h2>Category Management</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Add, update, or remove category channels
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
        
        {/* Left: Add category form */}
        <div className="form-card" style={{ height: 'fit-content' }}>
          <h3 style={{ fontSize: '18px', borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '20px' }}>
            New Category
          </h3>
          <form onSubmit={handleAddCategory} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Category Name *</label>
              <input
                type="text"
                id="name"
                className="form-control"
                style={{ backgroundColor: 'var(--bg-app)' }}
                placeholder="e.g., Innovation"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="description">Description</label>
              <textarea
                id="description"
                className="form-control"
                style={{ backgroundColor: 'var(--bg-app)' }}
                placeholder="Brief summary of articles grouped in this category..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
            <button
              type="submit"
              className="btn btn-accent"
              style={{ width: '100%', marginTop: '8px' }}
              disabled={saving}
            >
              {saving ? 'Adding...' : 'Create Category'}
            </button>
          </form>
        </div>

        {/* Right: List of categories */}
        <div className="form-card">
          <h3 style={{ fontSize: '18px', borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '20px' }}>
            Existing Channels
          </h3>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)' }}>
              Reloading categories...
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Category Name</th>
                    <th>Description</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat.id}>
                      <td style={{ fontWeight: '700' }}>
                        <span className={`badge badge-${cat.name.toLowerCase()}`}>{cat.name}</span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{cat.description || 'No description provided.'}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => handleDelete(cat.id, cat.name)}
                          className="btn btn-danger btn-sm"
                          style={{ padding: '4px 10px', fontSize: '11px' }}
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
