import type { News, Category, Author } from '../types';
import {
  getStoredArticles,
  saveStoredArticles,
  getStoredCategories,
  saveStoredCategories,
  getStoredAuthors,
  saveStoredAuthors
} from './db';

const delay = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Articles CRUD
  async getArticles(filters?: {
    category?: string;
    search?: string;
    status?: 'draft' | 'published' | 'all';
    featured?: boolean;
    sort?: 'newest' | 'oldest';
    date?: string; // YYYY-MM-DD
  }): Promise<News[]> {
    await delay();
    let articles = getStoredArticles();

    if (filters) {
      const { category, search, status, featured, sort, date } = filters;

      // Filter by status (default is published for regular users)
      if (status && status !== 'all') {
        articles = articles.filter(a => a.status === status);
      } else if (!status) {
        articles = articles.filter(a => a.status === 'published');
      }

      // Filter by featured
      if (featured !== undefined) {
        articles = articles.filter(a => a.featured === featured);
      }

      // Filter by category
      if (category && category !== '') {
        articles = articles.filter(
          a => a.category.toLowerCase() === category.toLowerCase()
        );
      }

      // Filter by search query (title or content or summary)
      if (search && search.trim() !== '') {
        const query = search.toLowerCase();
        articles = articles.filter(
          a =>
            a.title.toLowerCase().includes(query) ||
            a.summary.toLowerCase().includes(query) ||
            a.content.toLowerCase().includes(query)
        );
      }

      // Filter by exact publish date
      if (date && date !== '') {
        articles = articles.filter(a => a.publishDate === date);
      }

      // Sort
      if (sort === 'oldest') {
        articles.sort(
          (a, b) => new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime()
        );
      } else {
        // default: newest
        articles.sort(
          (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
        );
      }
    } else {
      // Default filter: only published, sorted by newest
      articles = articles
        .filter(a => a.status === 'published')
        .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
    }

    return articles;
  },

  async getArticleById(id: string): Promise<News | null> {
    await delay();
    const articles = getStoredArticles();
    const article = articles.find(a => a.id === id);
    if (article) {
      // Increment views count mock
      article.views = (article.views || 0) + 1;
      saveStoredArticles(articles);
      return article;
    }
    return null;
  },

  async createArticle(articleData: Omit<News, 'id' | 'createdDate' | 'updatedDate'>): Promise<News> {
    await delay();
    const articles = getStoredArticles();
    const newArticle: News = {
      ...articleData,
      id: `art-${Date.now()}`,
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
      views: 0
    };
    articles.push(newArticle);
    saveStoredArticles(articles);
    return newArticle;
  },

  async updateArticle(id: string, articleData: Partial<News>): Promise<News | null> {
    await delay();
    const articles = getStoredArticles();
    const index = articles.findIndex(a => a.id === id);
    if (index === -1) return null;

    const updatedArticle: News = {
      ...articles[index],
      ...articleData,
      updatedDate: new Date().toISOString()
    };
    articles[index] = updatedArticle;
    saveStoredArticles(articles);
    return updatedArticle;
  },

  async deleteArticle(id: string): Promise<boolean> {
    await delay();
    const articles = getStoredArticles();
    const filtered = articles.filter(a => a.id !== id);
    if (filtered.length === articles.length) return false;
    saveStoredArticles(filtered);
    return true;
  },

  // Categories CRUD
  async getCategories(): Promise<Category[]> {
    await delay();
    return getStoredCategories();
  },

  async createCategory(categoryData: Omit<Category, 'id'>): Promise<Category> {
    await delay();
    const categories = getStoredCategories();
    const newCategory: Category = {
      ...categoryData,
      id: `cat-${Date.now()}`
    };
    categories.push(newCategory);
    saveStoredCategories(categories);
    return newCategory;
  },

  async deleteCategory(id: string): Promise<boolean> {
    await delay();
    const categories = getStoredCategories();
    const filtered = categories.filter(c => c.id !== id);
    if (filtered.length === categories.length) return false;
    saveStoredCategories(filtered);
    return true;
  },

  // Authors CRUD
  async getAuthors(): Promise<Author[]> {
    await delay();
    return getStoredAuthors();
  },

  async createAuthor(authorData: Omit<Author, 'id'>): Promise<Author> {
    await delay();
    const authors = getStoredAuthors();
    const newAuthor: Author = {
      ...authorData,
      id: `auth-${Date.now()}`
    };
    authors.push(newAuthor);
    saveStoredAuthors(authors);
    return newAuthor;
  },

  async deleteAuthor(id: string): Promise<boolean> {
    await delay();
    const authors = getStoredAuthors();
    const filtered = authors.filter(a => a.id !== id);
    if (filtered.length === authors.length) return false;
    saveStoredAuthors(filtered);
    return true;
  },

  // News statistics for Admin Dashboard
  async getStats(): Promise<{
    totalArticles: number;
    publishedArticles: number;
    draftArticles: number;
    featuredArticles: number;
    totalViews: number;
    categoriesCount: number;
    authorsCount: number;
    categoryDistribution: { name: string; count: number }[];
  }> {
    await delay();
    const articles = getStoredArticles();
    const categories = getStoredCategories();
    const authors = getStoredAuthors();

    const published = articles.filter(a => a.status === 'published');
    const drafts = articles.filter(a => a.status === 'draft');
    const featured = articles.filter(a => a.featured);
    const totalViews = articles.reduce((acc, curr) => acc + (curr.views || 0), 0);

    const distMap: Record<string, number> = {};
    articles.forEach(a => {
      distMap[a.category] = (distMap[a.category] || 0) + 1;
    });

    const categoryDistribution = categories.map(cat => ({
      name: cat.name,
      count: distMap[cat.name] || 0
    }));

    return {
      totalArticles: articles.length,
      publishedArticles: published.length,
      draftArticles: drafts.length,
      featuredArticles: featured.length,
      totalViews,
      categoriesCount: categories.length,
      authorsCount: authors.length,
      categoryDistribution
    };
  }
};
