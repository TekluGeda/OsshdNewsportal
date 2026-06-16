import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { News } from '../types';
import { api } from '../services/api';
import { Layout } from '../components/Layout';
import { SEO } from '../components/SEO';
import { HeroSlider } from '../components/HeroSlider';
import { FilterBar } from '../components/FilterBar';
import { NewsGrid } from '../components/NewsGrid';
import { Pagination } from '../components/Pagination';
import { NewsCard } from '../components/NewsCard';

const ITEMS_PER_PAGE = 6;

export const HomePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Parse URL search parameters for initial categories
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || '';

  // State Management
  const [featuredArticles, setFeaturedArticles] = useState<News[]>([]);
  const [latestArticles, setLatestArticles] = useState<News[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<News[]>([]);
  const [paginatedArticles, setPaginatedArticles] = useState<News[]>([]);
  const [authorsMap, setAuthorsMap] = useState<Record<string, string>>({});
  
  const [filters, setFilters] = useState({
    category: initialCategory,
    search: '',
    sort: 'newest' as 'newest' | 'oldest',
    date: ''
  });

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  // Sync category state with URL query parameter changes
  useEffect(() => {
    const cat = queryParams.get('category') || '';
    setFilters(prev => ({ ...prev, category: cat }));
    setCurrentPage(1); // Reset page on category change
  }, [location.search]);

  // Load authors mapping once
  useEffect(() => {
    const loadAuthors = async () => {
      try {
        const authors = await api.getAuthors();
        const mapping: Record<string, string> = {};
        authors.forEach(auth => {
          mapping[auth.id] = auth.fullName;
        });
        setAuthorsMap(mapping);
      } catch (err) {
        console.error('Error fetching authors:', err);
      }
    };
    loadAuthors();
  }, []);

  // Fetch articles based on filter criteria
  useEffect(() => {
    const loadArticles = async () => {
      setLoading(true);
      try {
        // 1. Fetch featured articles for slider (always published, ignore filter parameters)
        const featured = await api.getArticles({ featured: true, status: 'published' });
        setFeaturedArticles(featured);

        // 2. Fetch latest articles for "Latest News Section" (recent 3 published items)
        const latest = await api.getArticles({ status: 'published', sort: 'newest' });
        setLatestArticles(latest.slice(0, 3));

        // 3. Fetch filtered articles for the news grid
        const gridFiltered = await api.getArticles({
          category: filters.category,
          search: filters.search,
          sort: filters.sort,
          date: filters.date,
          status: 'published'
        });
        
        setFilteredArticles(gridFiltered);
        setTotalPages(Math.ceil(gridFiltered.length / ITEMS_PER_PAGE));
        setCurrentPage(1); // Reset page index when filter updates
      } catch (err) {
        console.error('Error fetching articles:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadArticles();
  }, [filters]);

  // Handle pagination slicing when filtered list or current page changes
  useEffect(() => {
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    const sliced = filteredArticles.slice(startIdx, startIdx + ITEMS_PER_PAGE);
    setPaginatedArticles(sliced);
  }, [filteredArticles, currentPage]);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    
    // Sync category URL param
    if (newFilters.category) {
      navigate(`/?category=${encodeURIComponent(newFilters.category)}`);
    } else {
      navigate('/');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Smooth scroll down to grid listing when changing pages
    const gridEl = document.getElementById('grid-heading');
    if (gridEl) {
      gridEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Layout>
      <SEO
        title="Home"
        description="Stay informed with our comprehensive corporate news portal. Read announcements, Project summaries and  events lists."
      />

      {/* Top: Featured News Slider */}
      {!loading && featuredArticles.length > 0 && (
        <div className="container">
          <HeroSlider articles={featuredArticles} />
        </div>
      )}

      {/* Middle: Latest News Section */}
      <section className="related-news-section animate-fade-in" id="latest" style={{ padding: '48px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <h2 className="news-section-title" style={{ justifyContent: 'center', marginBottom: '32px' }}>
            Latest Headlines
          </h2>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)' }}>Loading headlines...</div>
          ) : latestArticles.length > 0 ? (
            <div className="related-grid">
              {latestArticles.map(article => (
                <NewsCard
                  key={article.id}
                  article={article}
                  authorName={authorsMap[article.author]}
                />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No articles published yet.</div>
          )}
        </div>
      </section>

      {/* Below: News Grid with Search & Filters */}
      <section style={{ padding: '64px 0 24px 0' }} id="grid">
        <div className="container">
          <div className="news-section-title" id="grid-heading">
            <span>Explore All News</span>
            <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-muted)' }}>
              Showing {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'}
            </span>
          </div>

          <FilterBar
            currentCategory={filters.category}
            currentSearch={filters.search}
            currentSort={filters.sort}
            currentDate={filters.date}
            onFilterChange={handleFilterChange}
          />

          {loading ? (
            <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--text-muted)' }}>Loading news feed...</div>
          ) : (
            <>
              <NewsGrid articles={paginatedArticles} authorsMap={authorsMap} />
              
              {/* Bottom: Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};
