import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Redirect if already authenticated
    const token = localStorage.getItem('news_portal_admin_token');
    if (token) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      // Mock credentials validation
      if (username === 'OSSHD' && password === 'admin123') {
        localStorage.setItem('news_portal_admin_token', 'mock-jwt-token-chronicle');
        navigate('/admin');
      } else {
        setError('Invalid username or password. Please use correct username/password.');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="login-wrapper">
      <SEO
        title="Admin Login"
        description="Authenticate to access the administrative control dashboard."
      />
      
      <div className="login-card animate-fade-in">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
            Back to Site
          </Link>
          <h1 className="login-logo">OSSHD</h1>
          <p className="login-tagline">Content Administration Gateway</p>
        </div>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              className="form-control"
              placeholder="Enter admin username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-accent"
            disabled={loading}
            style={{ width: '100%', padding: '12px', marginTop: '8px' }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-light)' }}>
          Tip: Use <strong style={{ color: 'var(--text-muted)' }}>admin</strong> and <strong style={{ color: 'var(--text-muted)' }}>admin123</strong> to log in.
        </div>
      </div>
    </div>
  );
};
