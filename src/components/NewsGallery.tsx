import React, { useState } from 'react';

interface NewsGalleryProps {
  image1: string;
  image2: string;
  image3: string;
  title: string;
}

export const NewsGallery: React.FC<NewsGalleryProps> = ({
  image1,
  image2,
  image3,
  title
}) => {
  const [activeIdx, setActiveIdx] = useState<number>(0);

  const images = [image1, image2, image3].filter(img => !!img);

  if (images.length === 0) return null;

  const handlePrev = () => {
    setActiveIdx(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIdx(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="detail-gallery-section">
      <div className="gallery-slider-container">
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`gallery-slide ${idx === activeIdx ? 'active' : ''}`}
          >
            {idx === activeIdx && (
              <img src={img} alt={`${title} - Gallery ${idx + 1}`} />
            )}
          </div>
        ))}

        {/* Previous and Next Navigation */}
        {images.length > 1 && (
          <>
            <button
              className="slider-nav slider-prev"
              onClick={handlePrev}
              aria-label="Previous image"
              style={{ top: '50%', transform: 'translateY(-50%)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              className="slider-nav slider-next"
              onClick={handleNext}
              aria-label="Next image"
              style={{ top: '50%', transform: 'translateY(-50%)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>

            {/* Slide Dots */}
            <div className="gallery-indicators">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  className={`slider-dot ${idx === activeIdx ? 'active' : ''}`}
                  onClick={() => setActiveIdx(idx)}
                  aria-label={`Go to image ${idx + 1}`}
                  style={{ backgroundColor: idx === activeIdx ? 'var(--accent)' : 'rgba(255, 255, 255, 0.5)' }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
