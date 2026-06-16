import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { AdminLayout } from './AdminLayout';
import { SEO } from '../../components/SEO';
import type { Category, Author } from '../../types';

export const NewsFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  // Form Field States
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [author, setAuthor] = useState('');
  const [publishDate, setPublishDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [featured, setFeatured] = useState(false);
  const [image1, setImage1] = useState('');
  const [image2, setImage2] = useState('');
  const [image3, setImage3] = useState('');

  // Dropdowns lists
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDropdownsAndArticle = async () => {
      setLoading(true);
      try {
        const cats = await api.getCategories();
        setCategories(cats);
        if (cats.length > 0 && !category) {
          setCategory(cats[0].name);
        }

        const auths = await api.getAuthors();
        setAuthors(auths);
        if (auths.length > 0 && !author) {
          setAuthor(auths[0].id);
        }

        if (isEditMode && id) {
          const article = await api.getArticleById(id);
          if (article) {
            setTitle(article.title);
            setSummary(article.summary);
            setContent(article.content);
            setCategory(article.category);
            setAuthor(article.author);
            setPublishDate(article.publishDate);
            setStatus(article.status);
            setFeatured(article.featured);
            setImage1(article.image1 || '');
            setImage2(article.image2 || '');
            setImage3(article.image3 || '');
          } else {
            setError('Article not found.');
          }
        }
      } catch (err) {
        console.error('Error fetching form parameters:', err);
        setError('Failed to fetch dependencies.');
      } finally {
        setLoading(false);
      }
    };

    loadDropdownsAndArticle();
  }, [id, isEditMode]);

  // Convert uploaded image file to Base64 URL string
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, imgNum: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('File size exceeds 2MB limit. Please upload a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (imgNum === 1) setImage1(result);
      if (imgNum === 2) setImage2(result);
      if (imgNum === 3) setImage3(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (imgNum: number) => {
    if (imgNum === 1) setImage1('');
    if (imgNum === 2) setImage2('');
    if (imgNum === 3) setImage3('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    if (!category) {
      setError('Please select a category.');
      setSaving(false);
      return;
    }

    if (!author) {
      setError('Please select an author.');
      setSaving(false);
      return;
    }

    const articleData = {
      title,
      summary,
      content,
      category,
      author,
      publishDate,
      status,
      featured,
      image1,
      image2,
      image3
    };

    try {
      if (isEditMode && id) {
        await api.updateArticle(id, articleData);
      } else {
        await api.createArticle(articleData);
      }
      navigate('/admin/news');
    } catch (err) {
      console.error('Error saving article:', err);
      setError('Failed to save article. Try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
          Loading article configuration...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <SEO
        title={isEditMode ? 'Edit Article' : 'Write Article'}
        description="Write and configure your news article content."
      />

      <div className="admin-page-title animate-fade-in">
        <div>
          <h2>{isEditMode ? 'Edit Article' : 'Write News Article'}</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {isEditMode ? `Updating "${title}"` : 'Publish a new press release or announcement'}
          </p>
        </div>
        <Link to="/admin/news" className="btn btn-outline btn-sm">
          Cancel
        </Link>
      </div>

      {error && <div className="alert-error" style={{ marginBottom: '24px' }}>{error}</div>}

      <form onSubmit={handleSubmit} className="form-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="form-grid">
          
          {/* Left Column: Core Fields */}
          <div className="form-left-col">
            <div className="form-group">
              <label className="form-label" htmlFor="title">News Title *</label>
              <input
                type="text"
                id="title"
                className="form-control"
                placeholder="Enter a compelling news title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="summary">Short Summary *</label>
              <textarea
                id="summary"
                className="form-control"
                placeholder="A brief 1-2 sentence preview summary of the article..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={3}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="content">Full Article Content *</label>
              <textarea
                id="content"
                className="form-control"
                placeholder="Write the full body content here. Line breaks are preserved."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                required
              />
            </div>

            {/* Images Upload Panel */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'block', marginBottom: '8px' }}>
                Article Images (Support up to 3)
              </label>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '-8px', marginBottom: '16px' }}>
                Provide a URL or select a local file (max 2MB) to populate each image slot.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {[1, 2, 3].map((num) => {
                  const imgUrl = num === 1 ? image1 : num === 2 ? image2 : image3;
                  const setImgUrl = num === 1 ? setImage1 : num === 2 ? setImage2 : setImage3;
                  
                  return (
                    <div
                      key={num}
                      style={{
                        padding: '16px',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--bg-app)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>Image Slot {num}</span>
                        {imgUrl && (
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(num)}
                            className="btn btn-outline btn-sm"
                            style={{ padding: '2px 8px', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        {/* URL paste */}
                        <div className="form-group">
                          <label className="form-label" style={{ fontSize: '11px' }}>Image URL</label>
                          <input
                            type="url"
                            className="form-control"
                            style={{ padding: '8px 12px', fontSize: '13px' }}
                            placeholder="https://example.com/image.jpg"
                            value={imgUrl.startsWith('data:') ? '' : imgUrl}
                            onChange={(e) => setImgUrl(e.target.value)}
                          />
                        </div>
                        {/* File upload */}
                        <div className="form-group">
                          <label className="form-label" style={{ fontSize: '11px' }}>Local File Upload</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, num)}
                            style={{ fontSize: '12px', marginTop: '6px' }}
                          />
                        </div>
                      </div>

                      {/* Thumbnail Preview */}
                      {imgUrl && (
                        <div style={{ marginTop: '8px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <div style={{ width: '80px', height: '50px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border)', backgroundColor: 'white' }}>
                            <img src={imgUrl} alt={`Slot ${num} preview`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '250px' }}>
                            {imgUrl.startsWith('data:') ? 'Uploaded local Base64 string' : imgUrl}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Settings & Metadata */}
          <div className="form-right-col">
            <h4 style={{ fontSize: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '8px', marginBottom: '16px' }}>
              Publishing Options
            </h4>

            <div className="form-group">
              <label className="form-label" htmlFor="status">Publish Status</label>
              <select
                id="status"
                className="filter-select"
                style={{ width: '100%', backgroundColor: 'white' }}
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
              >
                <option value="draft">Draft (Private)</option>
                <option value="published">Published (Public)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="category">Category *</label>
              <select
                id="category"
                className="filter-select"
                style={{ width: '100%', backgroundColor: 'white' }}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="author">Author *</label>
              <select
                id="author"
                className="filter-select"
                style={{ width: '100%', backgroundColor: 'white' }}
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
              >
                {authors.map(auth => (
                  <option key={auth.id} value={auth.id}>{auth.fullName}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="publishDate">Publication Date</label>
              <input
                type="date"
                id="publishDate"
                className="form-control"
                style={{ backgroundColor: 'white' }}
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginTop: '12px' }}>
              <div className="form-checkbox-group">
                <input
                  type="checkbox"
                  id="featured"
                  className="form-checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                />
                <label className="form-label" htmlFor="featured" style={{ cursor: 'pointer', marginBottom: '0' }}>
                  Mark as Featured Story
                </label>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '28px', marginTop: '4px' }}>
                Featured articles appear inside the top homepage Hero Slider.
              </p>
            </div>

            <button
              type="submit"
              className="btn btn-accent"
              style={{ width: '100%', marginTop: '24px' }}
              disabled={saving}
            >
              {saving ? 'Saving...' : isEditMode ? 'Save Modifications' : 'Publish Article'}
            </button>
          </div>

        </div>
      </form>
    </AdminLayout>
  );
};
