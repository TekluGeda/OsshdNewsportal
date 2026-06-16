import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Authenticate admin token
    const token = localStorage.getItem('news_portal_admin_token');
    if (!token) {
      navigate('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('news_portal_admin_token');
    navigate('/admin/login');
  };

  if (!isAuthenticated) {
    return (
      <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        Authenticating session...
      </div>
    );
  }

  return (
    <div className="admin-layout-container">
      {/* Sidebar navigation */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="C:\Users\HP\.gemini\antigravity\scratch\news-portal\src\assets\OSSHD.jpg" />
            </svg>
            OSSHD Admin
          </Link>
        </div>

        <ul className="admin-menu">
          <li className="admin-menu-item">
            <Link to="/admin" className={`admin-link ${location.pathname === '/admin' ? 'active' : ''}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="7" height="9" x="3" y="3" rx="1" />
                <rect width="7" height="5" x="14" y="3" rx="1" />
                <rect width="7" height="9" x="14" y="12" rx="1" />
                <rect width="7" height="5" x="3" y="16" rx="1" />
              </svg>
             News Dashboard
            </Link>
          </li>
          <li className="admin-menu-item">
            <Link to="/admin/news" className={`admin-link ${location.pathname.startsWith('/admin/news') ? 'active' : ''}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                <path d="M18 14h-8" />
                <path d="M15 18h-5" />
              </svg>
              Manage News and Articles
            </Link>
          </li>
          <li className="admin-menu-item">
            <Link to="/admin/categories" className={`admin-link ${location.pathname === '/admin/categories' ? 'active' : ''}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m16 16 3-3 3 3" />
                <path d="m19 13-3 3" />
                <path d="M21 12V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7" />
                <path d="M16 19h6" />
                <path d="M3 10h18" />
                <path d="M8 14h4" />
              </svg>
              Categories
            </Link>
          </li>
          <li className="admin-menu-item">
            <Link to="/admin/authors" className={`admin-link ${location.pathname === '/admin/authors' ? 'active' : ''}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Authors
            </Link>
          </li>
        </ul>

        <div className="admin-sidebar-footer">
          <button
            onClick={handleLogout}
            className="btn btn-outline"
            style={{ width: '100%', borderColor: 'rgba(255, 255, 255, 0.2)', color: 'rgba(255, 255, 255, 0.8)' }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main admin panels content */}
      <main className="admin-main">
        <header className="admin-header">
          <div style={{ fontWeight: '600', fontSize: '15px' }}>
            System Status: <span style={{ color: 'var(--success)' }}>&bull; Online</span>
          </div>

          <div className="admin-user-profile">
            <div className="detail-author-avatar" style={{ backgroundColor: 'var(--accent)' }}>A</div>
            <div>
              <div style={{ fontWeight: '600', fontSize: '14px' }}>Admin Workspace</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Super Administrator</div>
            </div>
          </div>
        </header>

        <div className="admin-page-content">
          {children}
        </div>
      </main>
    </div>
  );
};
