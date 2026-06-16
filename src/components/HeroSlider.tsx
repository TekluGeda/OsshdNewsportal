import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { News } from '../types';
import { formatDate } from '../utils/date';

interface HeroSliderProps {
  articles: News[];
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ articles }) => {
  const [currentArticleIdx, setCurrentArticleIdx] = useState<number>(0);
  const [currentImageIdx, setCurrentImageIdx] = useState<number>(0);
  const timerRef = useRef<any>(null);

  const activeArticle = articles[currentArticleIdx];

  // Auto-slide images of the active article every 3 seconds
  useEffect(() => {
    if (!activeArticle) return;

    // Reset image index when current article changes
    setCurrentImageIdx(0);

    // Clear old timer if any
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Start 3-second auto-slide timer for images
    timerRef.current = setInterval(() => {
      setCurrentImageIdx(prev => (prev + 1) % 3);
    }, 3000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentArticleIdx, activeArticle]);

  if (!articles || articles.length === 0) {
    return (
      <div className="hero-slider-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
        <p>No featured news articles available.</p>
      </div>
    );
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentArticleIdx(prev => (prev === 0 ? articles.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentArticleIdx(prev => (prev === articles.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (idx: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentArticleIdx(idx);
  };

  const getActiveImage = (article: News, imgIdx: number): string => {
    if (imgIdx === 0) return article.image1;
    if (imgIdx === 1) return article.image2;
    return article.image3;
  };

  return (
    <section className="hero-slider-section animate-fade-in">
      <div className="hero-slider-container">
        {articles.map((article, aIdx) => {
          const isActive = aIdx === currentArticleIdx;
          return (
            <div key={article.id} className={`hero-slide ${isActive ? 'active' : ''}`}>
              {isActive && (
                <>
                  {/* Three-Image Auto-slider */}
                  <div className="slide-images-container">
                    {[0, 1, 2].map((imgIdx) => {
                      const imgUrl = getActiveImage(article, imgIdx);
                      const isImgActive = imgIdx === currentImageIdx;
                      return (
                        <div key={imgIdx} className={`slide-image-wrapper ${isImgActive ? 'active' : ''}`}>
                          {imgUrl ? (
                            <img src={imgUrl} alt={`${article.title} - Scene ${imgIdx + 1}`} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--primary-light)' }} />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Gradient Overlay */}
                  <div className="slide-overlay" />

                  {/* Slider Content Overlay */}
                  <div className="slide-content">
                    <div className="slide-category">
                      <span className={`badge badge-${article.category.toLowerCase()}`}>
                        {article.category}
                      </span>
                    </div>
                    
                    <Link to={`/news/${article.id}`}>
                      <h2 className="slide-title">{article.title}</h2>
                    </Link>
                    
                    <p className="slide-summary">{article.summary}</p>
                    
                    <div className="slide-meta">
                      <span>{formatDate(article.publishDate)}</span>
                      <span>&bull;</span>
                      <span>Featured Story</span>
                      <span>&bull;</span>
                      <Link to={`/news/${article.id}`} className="btn btn-accent btn-sm" style={{ padding: '4px 12px' }}>
                        Read Article
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}

        {/* Previous and Next Navigation Buttons */}
        {articles.length > 1 && (
          <>
            <button className="slider-nav slider-prev" onClick={handlePrev} aria-label="Previous Article">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button className="slider-nav slider-next" onClick={handleNext} aria-label="Next Article">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>

            {/* Slider Dots indicators */}
            <div className="slider-indicators">
              {articles.map((_, idx) => (
                <button
                  key={idx}
                  className={`slider-dot ${idx === currentArticleIdx ? 'active' : ''}`}
                  onClick={(e) => handleDotClick(idx, e)}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
