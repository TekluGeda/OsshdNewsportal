import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article';
  articleData?: {
    headline: string;
    description: string;
    images: string[];
    datePublished: string;
    dateModified: string;
    authorName: string;
    publisherName: string;
  };
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  image = 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=60',
  type = 'website',
  articleData
}) => {
  const siteTitle = `${title} | Org News Portal`;

  useEffect(() => {
    // 1. Update document title
    document.title = siteTitle;

    // Helper to find or create meta tag
    const updateMetaTag = (nameAttr: string, propertyAttr: string, value: string) => {
      let element: HTMLMetaElement | null = null;
      if (nameAttr) {
        element = document.querySelector(`meta[name="${nameAttr}"]`);
      } else if (propertyAttr) {
        element = document.querySelector(`meta[property="${propertyAttr}"]`);
      }

      if (element) {
        element.setAttribute('content', value);
      } else {
        const meta = document.createElement('meta');
        if (nameAttr) meta.setAttribute('name', nameAttr);
        if (propertyAttr) meta.setAttribute('property', propertyAttr);
        meta.setAttribute('content', value);
        document.head.appendChild(meta);
      }
    };

    // 2. Update basic description meta
    updateMetaTag('description', '', description);

    // 3. Update Open Graph Tags
    updateMetaTag('', 'og:title', siteTitle);
    updateMetaTag('', 'og:description', description);
    updateMetaTag('', 'og:type', type);
    updateMetaTag('', 'og:image', image);
    updateMetaTag('', 'og:url', window.location.href);

    // 4. Update Twitter Card Tags
    updateMetaTag('twitter:card', '', 'summary_large_image');
    updateMetaTag('twitter:title', '', siteTitle);
    updateMetaTag('twitter:description', '', description);
    updateMetaTag('twitter:image', '', image);

    // 5. Ingest Structured Data (JSON-LD)
    let scriptId = 'jsonld-structured-data';
    let scriptElement = document.getElementById(scriptId);
    if (scriptElement) {
      scriptElement.remove();
    }

    if (articleData) {
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        'headline': articleData.headline,
        'description': articleData.description,
        'image': articleData.images.filter(img => img), // Remove empty strings
        'datePublished': articleData.datePublished,
        'dateModified': articleData.dateModified,
        'author': {
          '@type': 'Person',
          'name': articleData.authorName
        },
        'publisher': {
          '@type': 'Organization',
          'name': articleData.publisherName,
          'logo': {
            '@type': 'ImageObject',
            'url': image // Fallback logo
          }
        }
      };

      const script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      script.innerHTML = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    // Cleanup: remove structured data script on unmount
    return () => {
      const cleanupScript = document.getElementById(scriptId);
      if (cleanupScript) {
        cleanupScript.remove();
      }
    };
  }, [siteTitle, description, image, type, articleData]);

  return null; // This component changes head elements, doesn't render visual content
};
