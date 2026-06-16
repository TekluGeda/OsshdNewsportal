import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('news_portal_admin_token');
    setIsAdmin(!!token);
  }, [location.pathname]); // Re-verify on page transitions

  useEffect(() => {
    // Dark mode check from local storage or system preference
    const savedTheme = localStorage.getItem('news_portal_theme');
    const isDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setIsDarkMode(isDark);
    if (isDark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, []);

  const toggleDarkMode = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    if (nextMode) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('news_portal_theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('news_portal_theme', 'light');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('news_portal_admin_token');
    setIsAdmin(false);
    navigate('/');
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header-wrapper">
        <div className="container header-container">
          <Link to="/" className="logo">
                <img
                  src="images/OSSHD.jpg"
                  //alt="OSSHD"
                  width="40"
                />
                OSSHD
              </Link>
          {/* Navigation Links */}
          <nav className="nav-links">
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
              Home
            </Link>
            <a href="#latest" className="nav-link" onClick={(e) => {
              if (location.pathname !== '/') {
                e.preventDefault();
                navigate('/#latest');
              }
            }}>
              Latest News
            </a>
            <a href="#grid" className="nav-link" onClick={(e) => {
              if (location.pathname !== '/') {
                e.preventDefault();
                navigate('/#grid');
              }
            }}>
              Explore News
            </a>
          </nav>

          {/* User actions / auth / Dark mode */}
          <div className="header-actions">
            {/* Dark Mode toggle */}
            <button 
              onClick={toggleDarkMode}
              className="btn btn-outline" 
              style={{ width: '40px', height: '40px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                // Sun Icon
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="M4.93 4.93l1.41 1.41" />
                  <path d="M17.66 17.66l1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="M6.34 17.66l-1.41 1.41" />
                  <path d="M19.07 4.93l-1.41 1.41" />
                </svg>
              ) : (
                // Moon Icon
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              )}
            </button>

            {isAdmin ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Link to="/admin" className="btn btn-primary btn-sm">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="btn btn-outline btn-sm">
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/admin/login" className="btn btn-outline btn-sm">
                Admin Panel
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {children}
      </main>

      {/* Footer */}
      <footer className="footer-wrapper">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">OSSHD</div>
              <p className="footer-description">
                A modern responsive news portal of OSSHD. Stay up to date with official announcements, project updates, and events.
              </p>
            </div>
            
            <div>
              <h4 className="footer-title">Categories</h4>
              <ul className="footer-links">
               <li><Link to="/?category=Projects" className="footer-link">Projects</Link></li>
                <li><Link to="/?category=Health" className="footer-link">Health</Link></li>
                <li><Link to="/?category=Business" className="footer-link">Business</Link></li>
                <li><Link to="/?category=Technology" className="footer-link">Technology</Link></li>
                
              </ul>
            </div>

            <div>
              <h4 className="footer-title">Useful Links</h4>
              <ul className="footer-links">
                <li><Link to="/" className="footer-link">Home</Link></li>
                <li><Link to="/admin/login" className="footer-link">Admin Portal</Link></li>
                <li><a href="#latest" className="footer-link">Latest Stories</a></li>
                <li><a href="https://www.google.com/maps/d/viewer?mid=1HUCuLK7hKVE84yoijEU7qEXHj5mEvek&femb=1&ll=10.303550008363114%2C38.007813800000015&z=6" className="footer-link" target="_blank" rel="noopener noreferrer">Location map</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} OSSHD News Portal.</p>
            <p>OSSHD@2026.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
