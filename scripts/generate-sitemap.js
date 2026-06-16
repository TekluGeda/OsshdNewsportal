import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://news.mydomain.com';

// Define seed article IDs that match our mock DB so they are indexed
const SEED_ARTICLE_IDS = [
  'art-1',
  'art-2',
  'art-3',
  'art-4',
  'art-5',
  'art-6',
  'art-7'
];

const CATEGORIES = [
  'Technology',
  'Health',
  'Education',
  'Business',
  'Projects',
  'Announcements',
  'Events'
];

const generateSitemap = () => {
  const currentDate = new Date().toISOString().split('T')[0];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // 1. Homepage
  xml += '  <url>\n';
  xml += `    <loc>${SITE_URL}/</loc>\n`;
  xml += `    <lastmod>${currentDate}</lastmod>\n`;
  xml += '    <changefreq>daily</changefreq>\n';
  xml += '    <priority>1.0</priority>\n';
  xml += '  </url>\n';

  // 2. Categories
  CATEGORIES.forEach((cat) => {
    xml += '  <url>\n';
    xml += `    <loc>${SITE_URL}/?category=${encodeURIComponent(cat)}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.8</priority>\n';
    xml += '  </url>\n';
  });

  // 3. Admin Login
  xml += '  <url>\n';
  xml += `    <loc>${SITE_URL}/admin/login</loc>\n`;
  xml += `    <lastmod>${currentDate}</lastmod>\n`;
  xml += '    <changefreq>monthly</changefreq>\n';
  xml += '    <priority>0.3</priority>\n';
  xml += '  </url>\n';

  // 4. Articles
  SEED_ARTICLE_IDS.forEach((id) => {
    xml += '  <url>\n';
    xml += `    <loc>${SITE_URL}/news/${id}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.6</priority>\n';
    xml += '  </url>\n';
  });

  xml += '</urlset>\n';

  // Save to public directory
  const destDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const destPath = path.join(destDir, 'sitemap.xml');
  fs.writeFileSync(destPath, xml, 'utf8');

  console.log(`\x1b[32m✔ Sitemap successfully generated at ${destPath}\x1b[0m`);
};

generateSitemap();
