import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { News } from "../types";
import { api } from "../services/api";
import { Layout } from "../components/Layout";
import { SEO } from "../components/SEO";
import { HeroSlider } from "../components/HeroSlider";
import { FilterBar } from "../components/FilterBar";
import { NewsGrid } from "../components/NewsGrid";
import { Pagination } from "../components/Pagination";
import { NewsCard } from "../components/NewsCard";

const ITEMS_PER_PAGE = 6;

export const HomePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get("category") || "";

  // STATE
  const [featuredArticles, setFeaturedArticles] = useState<News[]>([]);
  const [latestArticles, setLatestArticles] = useState<News[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<News[]>([]);
  const [paginatedArticles, setPaginatedArticles] = useState<News[]>([]);
  const [authorsMap, setAuthorsMap] = useState<Record<string, string>>({});

  const [filters, setFilters] = useState({
    category: initialCategory,
    search: "",
    sort: "newest" as "newest" | "oldest",
    date: ""
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // sync URL category
  useEffect(() => {
    const cat = queryParams.get("category") || "";
    setFilters((prev) => ({ ...prev, category: cat }));
    setCurrentPage(1);
  }, [location.search]);

  // =========================
  // MAIN DATA LOADER (OPTIMIZED)
  // =========================
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        const [featured, latest, grid, authors] = await Promise.all([
          api.getArticles({ featured: true, status: "published" }),
          api.getArticles({ status: "published", sort: "newest" }),
          api.getArticles({
            category: filters.category,
            search: filters.search,
            sort: filters.sort,
            date: filters.date,
            status: "published"
          }),
          api.getAuthors()
        ]);

        setFeaturedArticles(featured);
        setLatestArticles(latest.slice(0, 3));

        setFilteredArticles(grid);
        setTotalPages(Math.ceil(grid.length / ITEMS_PER_PAGE));
        setCurrentPage(1);

        const map: Record<string, string> = {};
        authors.forEach((a) => {
          map[a.id] = a.fullName;
        });
        setAuthorsMap(map);
      } catch (err) {
        console.error("Homepage load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filters]);

  // pagination
  useEffect(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    setPaginatedArticles(
      filteredArticles.slice(start, start + ITEMS_PER_PAGE)
    );
  }, [filteredArticles, currentPage]);

  // filter handler
  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);

    if (newFilters.category) {
      navigate(`/?category=${encodeURIComponent(newFilters.category)}`);
    } else {
      navigate("/");
    }
  };

  // page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    document.getElementById("grid-heading")?.scrollIntoView({
      behavior: "smooth"
    });
  };

  return (
    <Layout>
      <SEO
        title="Home"
        description="Stay informed with our corporate news portal."
      />

      {/* HERO SLIDER */}
      {!loading && featuredArticles.length > 0 && (
        <div className="container">
          <HeroSlider articles={featuredArticles} />
        </div>
      )}

      {/* LATEST NEWS */}
      <section
        id="latest"
        style={{
          padding: "48px 0",
          borderBottom: "1px solid var(--border)"
        }}
      >
        <div className="container">
          <h2 className="news-section-title">Latest Headlines</h2>

          {loading ? (
            <p style={{ textAlign: "center" }}>Loading...</p>
          ) : latestArticles.length > 0 ? (
            <div className="related-grid">
              {latestArticles.map((article) => (
                <NewsCard
                  key={article.id}
                  article={article}
                  authorName={authorsMap[article.author]}
                />
              ))}
            </div>
          ) : (
            <p style={{ textAlign: "center" }}>No articles yet</p>
          )}
        </div>
      </section>

      {/* GRID */}
      <section id="grid" style={{ padding: "64px 0 24px" }}>
        <div className="container">
          <div id="grid-heading" className="news-section-title">
            <span>Explore All News</span>
            <span style={{ fontSize: "14px" }}>
              {filteredArticles.length} articles
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
            <p style={{ textAlign: "center" }}>Loading...</p>
          ) : (
            <>
              <NewsGrid
                articles={paginatedArticles}
                authorsMap={authorsMap}
              />

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
